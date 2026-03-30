'use client';

import { Typography, Box, TextField, Button, Alert, Divider, IconButton, InputAdornment, Select, MenuItem, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import { getApiUrl } from '@/lib/api-config';
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface SettingItem {
  key: string;
  label: string;
  description: string;
  type: 'secret' | 'select' | 'string';
  value: string | null;
  options?: string[];
}

export default function SettingsPage() {
  const theme = useTheme();
  const [settings, setSettings] = useState<SettingItem[]>([]);
  const [pendingValues, setPendingValues] = useState<Record<string, string>>({});
  const [visibleSecrets, setVisibleSecrets] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState<{ total: number; changed: number } | null>(null);
  const [migrationError, setMigrationError] = useState<string | null>(null);

  const [isCheckingIngestion, setIsCheckingIngestion] = useState(false);
  const [ingestionResult, setIngestionResult] = useState<{ processed: number; moved_to_registered: number; moved_to_working: number; skipped: number } | null>(null);
  const [ingestionError, setIngestionError] = useState<string | null>(null);

  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [isDownloadingBackup, setIsDownloadingBackup] = useState(false);
  const [backupDownloaded, setBackupDownloaded] = useState(false);
  const [isPurging, setIsPurging] = useState(false);
  const [purgeError, setPurgeError] = useState<string | null>(null);
  const [purgeSuccess, setPurgeSuccess] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(getApiUrl('/settings'));
        if (response.ok) {
          const data = await response.json();
          const items: SettingItem[] = data.settings;
          setSettings(items);
          const initial: Record<string, string> = {};
          items.forEach(s => { if (s.value != null) initial[s.key] = String(s.value); });
          setPendingValues(initial);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (key: string, value: string) => {
    setPendingValues(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError(null);
    try {
      const response = await fetch(getApiUrl('/settings'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pendingValues),
      });
      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        const error = await response.json();
        setSaveError(error.detail || 'Failed to save settings');
      }
    } catch {
      setSaveError('Network error. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderInput = (setting: SettingItem) => {
    const value = pendingValues[setting.key] ?? '';
    if (setting.type === 'secret') {
      const visible = visibleSecrets[setting.key] ?? false;
      return (
        <TextField
          fullWidth
          type={visible ? 'text' : 'password'}
          placeholder={`Enter ${setting.label}`}
          value={value}
          onChange={e => handleChange(setting.key, e.target.value)}
          disabled={isLoading}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setVisibleSecrets(prev => ({ ...prev, [setting.key]: !visible }))}
                  edge="end"
                  disabled={isLoading}
                >
                  {visible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ '& .MuiOutlinedInput-root': { backgroundColor: theme.palette.background.paper } }}
        />
      );
    }
    if (setting.type === 'select' && setting.options && setting.options.length > 0) {
      return (
        <FormControl fullWidth size="small">
          <InputLabel>{setting.label}</InputLabel>
          <Select
            value={value}
            label={setting.label}
            onChange={e => handleChange(setting.key, e.target.value)}
            disabled={isLoading}
          >
            {setting.options.map(opt => (
              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }
    return (
      <TextField
        fullWidth
        value={value}
        onChange={e => handleChange(setting.key, e.target.value)}
        disabled={isLoading}
        size="small"
        sx={{ '& .MuiOutlinedInput-root': { backgroundColor: theme.palette.background.paper } }}
      />
    );
  };

  const handleMigrateSchema = async () => {
    setIsMigrating(true);
    setMigrationResult(null);
    setMigrationError(null);
    try {
      const response = await fetch(getApiUrl('/admin/migrate-schema'), { method: 'POST' });
      if (response.ok) {
        setMigrationResult(await response.json());
      } else {
        const error = await response.json();
        setMigrationError(error.detail || 'Migration failed');
      }
    } catch {
      setMigrationError('Network error. Please try again.');
    } finally {
      setIsMigrating(false);
    }
  };

  const handleCheckIngestionLog = async () => {
    setIsCheckingIngestion(true);
    setIngestionResult(null);
    setIngestionError(null);
    try {
      const response = await fetch(getApiUrl('/internal/check-ingestion-log'), { method: 'POST' });
      if (response.ok) {
        setIngestionResult(await response.json());
      } else {
        const error = await response.json();
        setIngestionError(error.detail || 'Ingestion check failed');
      }
    } catch {
      setIngestionError('Network error. Please try again.');
    } finally {
      setIsCheckingIngestion(false);
    }
  };

  const handleOpenResetModal = () => {
    setResetModalOpen(true);
    setBackupDownloaded(false);
    setPurgeError(null);
    setPurgeSuccess(false);
  };

  const handleCloseResetModal = () => {
    if (isPurging || isDownloadingBackup) return;
    setResetModalOpen(false);
  };

  const handleDownloadBackup = async () => {
    setIsDownloadingBackup(true);
    setPurgeError(null);
    try {
      const response = await fetch(getApiUrl('/admin/download-backup'));
      if (response.ok) {
        const blob = await response.blob();
        const disposition = response.headers.get('Content-Disposition') || '';
        const filenameMatch = disposition.match(/filename=([^;]+)/);
        const filename = filenameMatch ? filenameMatch[1] : 'ascr_backup.zip';
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        setBackupDownloaded(true);
      } else {
        const error = await response.json();
        setPurgeError(error.detail || 'Backup download failed');
      }
    } catch {
      setPurgeError('Network error. Please try again.');
    } finally {
      setIsDownloadingBackup(false);
    }
  };

  const handleConfirmReset = async () => {
    setIsPurging(true);
    setPurgeError(null);
    try {
      const response = await fetch(getApiUrl('/admin/purge-all-data'), { method: 'POST' });
      if (response.ok) {
        setPurgeSuccess(true);
      } else {
        const error = await response.json();
        setPurgeError(error.detail || 'Reset failed');
      }
    } catch {
      setPurgeError('Network error. Please try again.');
    } finally {
      setIsPurging(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, minHeight: 'calc(92vh - 24px)', backgroundColor: 'background.primary', p: 3 }}>
      <Box sx={{ width: '100%', maxWidth: '680px', display: 'flex', flexDirection: 'column', gap: 3 }}>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '40px' }}>
          <Typography variant="h4" fontWeight={600} color="text.primary">Settings</Typography>
          <Box sx={{ opacity: saveSuccess ? 1 : 0, transform: saveSuccess ? 'translateX(0)' : 'translateX(20px)', transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out', pointerEvents: saveSuccess ? 'auto' : 'none' }}>
            <Typography variant="body2" sx={{ color: theme.palette.success.main, fontWeight: 500, fontSize: '0.95rem', whiteSpace: 'nowrap' }}>
              ✓ Settings saved
            </Typography>
          </Box>
        </Box>

        {saveError && <Alert severity="error" onClose={() => setSaveError(null)}>{saveError}</Alert>}

        {/* Configuration — rendered from backend schema */}
        <Box>
          <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>Configuration</Typography>
          <Divider sx={{ mb: 3 }} />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {settings.map(setting => (
              <Box key={setting.key}>
                <Typography variant="body1" fontWeight={500} sx={{ mb: 0.5 }}>{setting.label}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>{setting.description}</Typography>
                {renderInput(setting)}
              </Box>
            ))}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={isSaving || isLoading}
                sx={{ backgroundColor: theme.palette.secondary.dark, '&:hover': { backgroundColor: theme.palette.secondary.main } }}
              >
                {isSaving ? 'Saving...' : 'Save Settings'}
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Schema Migration */}
        <Box>
          <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>Schema Migration</Typography>
          <Divider sx={{ mb: 3 }} />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Apply the current data schema to all cell line records. Adds any fields missing from existing records with null or empty defaults. Existing values are never overwritten.
          </Typography>
          {migrationResult && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setMigrationResult(null)}>Migration complete — {migrationResult.changed} of {migrationResult.total} records updated.</Alert>}
          {migrationError && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setMigrationError(null)}>{migrationError}</Alert>}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={handleMigrateSchema} disabled={isMigrating}>
              {isMigrating ? 'Running...' : 'Run Schema Migration'}
            </Button>
          </Box>
        </Box>

        {/* Ingestion Log */}
        <Box>
          <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>Ingestion Log</Typography>
          <Divider sx={{ mb: 3 }} />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Process the ingestion run log now. The system runs this automatically every Saturday, but you can trigger it manually here. Files in the ready directory with a PROD-PASS status will be moved to registered; files with an ERROR status will be returned to working.
          </Typography>
          {ingestionResult && <Alert severity="info" sx={{ mb: 2 }} onClose={() => setIngestionResult(null)}>Check complete — {ingestionResult.moved_to_registered} moved to registered, {ingestionResult.moved_to_working} returned to working, {ingestionResult.skipped} skipped ({ingestionResult.processed} total ready files).</Alert>}
          {ingestionError && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setIngestionError(null)}>{ingestionError}</Alert>}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={handleCheckIngestionLog} disabled={isCheckingIngestion}>
              {isCheckingIngestion ? 'Checking...' : 'Check Ingestion Log Now'}
            </Button>
          </Box>
        </Box>

        {/* Danger Zone */}
        <Box>
          <Typography variant="h6" fontWeight={600} color="error.main" sx={{ mb: 1 }}>Danger Zone</Typography>
          <Divider sx={{ mb: 3, borderColor: 'error.main' }} />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Reset the application to an empty state by deleting all cell line data from working, ready, and registered directories. You will be required to download a backup before the reset is permitted.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="outlined" color="error" onClick={handleOpenResetModal}>Factory Reset</Button>
          </Box>
        </Box>

      </Box>

      <Dialog open={resetModalOpen} onClose={handleCloseResetModal} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Factory Reset</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
          {purgeSuccess ? (
            <Alert severity="success">All data has been deleted. The system is now empty.</Alert>
          ) : (
            <>
              {purgeError && <Alert severity="error" onClose={() => setPurgeError(null)}>{purgeError}</Alert>}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="subtitle1" fontWeight={600}>Step 1 — Backup existing data</Typography>
                  {backupDownloaded && <CheckCircleIcon fontSize="small" sx={{ color: theme.palette.success.main }} />}
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Download a zip of all current cell line data before proceeding. You must complete this step to unlock the reset.
                </Typography>
                <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleDownloadBackup} disabled={isDownloadingBackup}>
                  {isDownloadingBackup ? 'Preparing download...' : backupDownloaded ? 'Download again' : 'Download backup'}
                </Button>
              </Box>
              <Divider />
              <Box sx={{ opacity: backupDownloaded ? 1 : 0.4, transition: 'opacity 0.3s' }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>Step 2 — Confirm reset</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  This will permanently delete all cell line records from working, ready, and registered directories. This cannot be undone.
                </Typography>
                <Button variant="contained" color="error" onClick={handleConfirmReset} disabled={!backupDownloaded || isPurging}>
                  {isPurging ? 'Deleting all data...' : 'Delete all data'}
                </Button>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseResetModal} disabled={isPurging || isDownloadingBackup}>
            {purgeSuccess ? 'Close' : 'Cancel'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
