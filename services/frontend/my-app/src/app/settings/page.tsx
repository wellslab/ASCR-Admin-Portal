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

export default function SettingsPage() {
  const theme = useTheme();
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [apiKeySource, setApiKeySource] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState<{ total: number; changed: number } | null>(null);
  const [migrationError, setMigrationError] = useState<string | null>(null);

  // Ingestion log check state
  const [isCheckingIngestion, setIsCheckingIngestion] = useState(false);
  const [ingestionResult, setIngestionResult] = useState<{ processed: number; moved_to_registered: number; moved_to_working: number; skipped: number } | null>(null);
  const [ingestionError, setIngestionError] = useState<string | null>(null);

  // Factory reset modal state
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
          const settings = data.settings;
          if (settings.OPENAI_API_KEY) {
            setApiKey(settings.OPENAI_API_KEY);
          }
          setApiKeySource(settings.OPENAI_API_KEY_SOURCE || null);
          if (Array.isArray(settings.AVAILABLE_MODELS)) {
            setAvailableModels(settings.AVAILABLE_MODELS);
          }
          if (settings.SELECTED_MODEL) {
            setSelectedModel(settings.SELECTED_MODEL);
          }
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError(null);
    try {
      const response = await fetch(getApiUrl('/settings'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          OPENAI_API_KEY: apiKey || undefined,
          SELECTED_MODEL: selectedModel || undefined,
        }),
      });
      if (response.ok) {
        setSaveSuccess(true);
        setApiKeySource(null);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        const error = await response.json();
        setSaveError(error.detail || 'Failed to save settings');
      }
    } catch (error) {
      setSaveError('Network error. Please try again.');
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        minHeight: 'calc(92vh - 24px)',
        backgroundColor: 'background.primary',
        p: 3,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '680px',
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '40px' }}>
          <Typography variant="h4" fontWeight={600} color="text.primary">
            Settings
          </Typography>
          <Box
            sx={{
              opacity: saveSuccess ? 1 : 0,
              transform: saveSuccess ? 'translateX(0)' : 'translateX(20px)',
              transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
              pointerEvents: saveSuccess ? 'auto' : 'none',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.success.main,
                fontWeight: 500,
                fontSize: '0.95rem',
                whiteSpace: 'nowrap',
              }}
            >
              ✓ Settings saved
            </Typography>
          </Box>
        </Box>

        {saveError && (
          <Alert severity="error" onClose={() => setSaveError(null)}>
            {saveError}
          </Alert>
        )}

        <Box>
          <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>
            API Configuration
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="body1" fontWeight={500} sx={{ mb: 0.5 }}>
                OpenAI API Key
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                Your OpenAI API key is used for AI-powered cell line curation. The key is stored securely and never exposed in logs or responses.
                {apiKeySource === 'environment' && (
                  <span style={{ color: theme.palette.warning.main, fontWeight: 500 }}>
                    {' '}Currently using key from environment variables.
                  </span>
                )}
              </Typography>
              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your OpenAI API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                disabled={isLoading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" disabled={isLoading}>
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { backgroundColor: theme.palette.background.paper } }}
              />
            </Box>

            {availableModels.length > 0 && (
              <Box>
                <Typography variant="body1" fontWeight={500} sx={{ mb: 0.5 }}>
                  Curation Model
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                  The model used for all AI curation agents. Models are configured in <code>config.json</code>.
                </Typography>
                <FormControl fullWidth size="small">
                  <InputLabel>Model</InputLabel>
                  <Select
                    value={selectedModel}
                    label="Model"
                    onChange={(e) => setSelectedModel(e.target.value)}
                    disabled={isLoading}
                  >
                    {availableModels.map((model) => (
                      <MenuItem key={model} value={model}>{model}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={isSaving || isLoading || !apiKey}
                sx={{
                  backgroundColor: theme.palette.secondary.dark,
                  '&:hover': { backgroundColor: theme.palette.secondary.main },
                }}
              >
                {isSaving ? 'Saving...' : 'Save Settings'}
              </Button>
            </Box>
          </Box>
        </Box>

        <Box>
          <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>
            Schema Migration
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Apply the current data schema to all cell line records. Adds any fields missing from existing records with null or empty defaults. Existing values are never overwritten.
          </Typography>
          {migrationResult && (
            <Alert severity="success" sx={{ mb: 2 }} onClose={() => setMigrationResult(null)}>
              Migration complete — {migrationResult.changed} of {migrationResult.total} records updated.
            </Alert>
          )}
          {migrationError && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setMigrationError(null)}>
              {migrationError}
            </Alert>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={handleMigrateSchema} disabled={isMigrating}>
              {isMigrating ? 'Running...' : 'Run Schema Migration'}
            </Button>
          </Box>
        </Box>

        <Box>
          <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>
            Ingestion Log
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Process the ingestion run log now. The system runs this automatically every Saturday, but you can trigger it manually here. Files in the ready directory with a PROD-PASS status will be moved to registered; files with an ERROR status will be returned to working.
          </Typography>
          {ingestionResult && (
            <Alert severity="info" sx={{ mb: 2 }} onClose={() => setIngestionResult(null)}>
              Check complete — {ingestionResult.moved_to_registered} moved to registered, {ingestionResult.moved_to_working} returned to working, {ingestionResult.skipped} skipped ({ingestionResult.processed} total ready files).
            </Alert>
          )}
          {ingestionError && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setIngestionError(null)}>
              {ingestionError}
            </Alert>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={handleCheckIngestionLog} disabled={isCheckingIngestion}>
              {isCheckingIngestion ? 'Checking...' : 'Check Ingestion Log Now'}
            </Button>
          </Box>
        </Box>

        <Box>
          <Typography variant="h6" fontWeight={600} color="error.main" sx={{ mb: 1 }}>
            Danger Zone
          </Typography>
          <Divider sx={{ mb: 3, borderColor: 'error.main' }} />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Reset the application to an empty state by deleting all cell line data from working, ready, and registered directories. You will be required to download a backup before the reset is permitted.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="outlined" color="error" onClick={handleOpenResetModal}>
              Factory Reset
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Factory Reset Modal */}
      <Dialog open={resetModalOpen} onClose={handleCloseResetModal} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Factory Reset</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>

          {purgeSuccess ? (
            <Alert severity="success">
              All data has been deleted. The system is now empty.
            </Alert>
          ) : (
            <>
              {purgeError && (
                <Alert severity="error" onClose={() => setPurgeError(null)}>
                  {purgeError}
                </Alert>
              )}

              {/* Step 1 */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Step 1 — Backup existing data
                  </Typography>
                  {backupDownloaded && (
                    <CheckCircleIcon fontSize="small" sx={{ color: theme.palette.success.main }} />
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Download a zip of all current cell line data before proceeding. You must complete this step to unlock the reset.
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownloadBackup}
                  disabled={isDownloadingBackup}
                >
                  {isDownloadingBackup ? 'Preparing download...' : backupDownloaded ? 'Download again' : 'Download backup'}
                </Button>
              </Box>

              <Divider />

              {/* Step 2 */}
              <Box sx={{ opacity: backupDownloaded ? 1 : 0.4, transition: 'opacity 0.3s' }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                  Step 2 — Confirm reset
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  This will permanently delete all cell line records from working, ready, and registered directories. This cannot be undone.
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleConfirmReset}
                  disabled={!backupDownloaded || isPurging}
                >
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
