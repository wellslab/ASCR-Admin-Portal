'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, List, ListItemButton, ListItemText, Skeleton, Alert, Button, Chip,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CellLineEditor from '@/app/components/CellLineEditor';
import { getApiUrl } from '@/lib/api-config';

interface IngestionError {
  filename: string;
  base_name: string;
  version: string;
  last_run_date: string | null;
}

export default function IngestionMonitorPage() {
  const [errors, setErrors] = useState<IngestionError[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [selectedFilename, setSelectedFilename] = useState<string | null>(null);
  const [cellLineData, setCellLineData] = useState<Record<string, any> | null>(null);
  const [isLoadingCellLine, setIsLoadingCellLine] = useState(false);
  const [cellLineError, setCellLineError] = useState<string | null>(null);
  const [editorKey, setEditorKey] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isMarkingReady, setIsMarkingReady] = useState(false);
  const [markReadyError, setMarkReadyError] = useState<string | null>(null);

  const fetchErrors = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const res = await fetch(getApiUrl('/ingestion/errors'));
      if (res.ok) {
        const data = await res.json();
        setErrors(data.errors || []);
      } else {
        setFetchError('Failed to load ingestion errors.');
      }
    } catch {
      setFetchError('Network error — could not reach the backend.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchErrors(); }, []);

  const fetchCellLine = async (filename: string) => {
    setIsLoadingCellLine(true);
    setCellLineError(null);
    setMarkReadyError(null);
    try {
      const res = await fetch(getApiUrl(`/cell-line/${filename}`));
      if (res.ok) {
        const result = await res.json();
        setCellLineData(result.data);
        setSelectedFilename(filename);
        setEditorKey(k => k + 1);
      } else {
        setCellLineError(`Could not load "${filename}".`);
      }
    } catch {
      setCellLineError('Network error — could not reach the backend.');
    } finally {
      setIsLoadingCellLine(false);
    }
  };

  const saveCellLine = async (data: Record<string, any>) => {
    if (!selectedFilename) return;
    try {
      setValidationErrors([]);
      const res = await fetch(getApiUrl(`/working/cell-line/${selectedFilename}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setCellLineData(data);
      } else if (res.status === 422) {
        const err = await res.json();
        const msgs = Array.isArray(err.detail)
          ? err.detail.map((e: any) => `${e.loc?.slice(1).join(' → ')}: ${e.msg}`)
          : [err.detail || 'Validation failed'];
        setValidationErrors(msgs);
      } else {
        setValidationErrors([`Save failed: ${res.statusText}`]);
      }
    } catch {
      setValidationErrors(['An unexpected error occurred while saving.']);
    }
  };

  const handleMarkAsReady = async () => {
    if (!selectedFilename) return;
    setIsMarkingReady(true);
    setMarkReadyError(null);
    try {
      const res = await fetch(getApiUrl(`/cell-line/${selectedFilename}/move-to-ready`), { method: 'POST' });
      if (res.ok) {
        setErrors(prev => prev.filter(e => e.filename !== selectedFilename));
        setSelectedFilename(null);
        setCellLineData(null);
      } else {
        const err = await res.json();
        setMarkReadyError(err.detail || 'Failed to mark as ready.');
      }
    } catch {
      setMarkReadyError('Network error — could not reach the backend.');
    } finally {
      setIsMarkingReady(false);
    }
  };

  const handleSelect = useCallback((filename: string) => {
    if (filename !== selectedFilename) fetchCellLine(filename);
  }, [selectedFilename]);

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 4rem - 16px)', gap: 2, overflow: 'hidden', pr: 2, pb: 2 }}>

      {/* Left panel */}
      <Box sx={{ width: 280, minWidth: 280, display: 'flex', flexDirection: 'column', gap: 1, overflow: 'hidden' }}>
        <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', px: 1 }}>
          Ingestion Errors
        </Typography>

        {fetchError && (
          <Alert severity="error" sx={{ fontSize: '0.75rem' }}>{fetchError}</Alert>
        )}

        <Box sx={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          {isLoading ? (
            [...Array(4)].map((_, i) => <Skeleton key={i} height={40} sx={{ mx: 1 }} />)
          ) : errors.length === 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, pt: 4, px: 2 }}>
              <CheckCircleOutlineIcon sx={{ color: 'success.main', fontSize: 32 }} />
              <Typography variant="body2" color="text.secondary" textAlign="center">
                No ingestion errors.
              </Typography>
            </Box>
          ) : (
            <List dense disablePadding>
              {errors.map(entry => (
                <ListItemButton
                  key={entry.filename}
                  selected={selectedFilename === entry.filename}
                  onClick={() => handleSelect(entry.filename)}
                  sx={{ borderRadius: 1, py: 0.5, px: 1 }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
                        <Typography variant="body2" noWrap sx={{ flex: 1, fontSize: '0.8rem', fontWeight: 500 }}>
                          {entry.filename}
                        </Typography>
                        <Chip label="ERROR" size="small" color="error" sx={{ fontSize: '0.6rem', height: 16 }} />
                      </Box>
                    }
                    secondary={entry.last_run_date ?? undefined}
                    secondaryTypographyProps={{ sx: { fontSize: '0.7rem' } }}
                    disableTypography={false}
                  />
                </ListItemButton>
              ))}
            </List>
          )}
        </Box>
      </Box>

      {/* Right panel */}
      <Box sx={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
        {cellLineError && (
          <Alert severity="warning" onClose={() => setCellLineError(null)}>{cellLineError}</Alert>
        )}
        {markReadyError && (
          <Alert severity="error" onClose={() => setMarkReadyError(null)}>{markReadyError}</Alert>
        )}

        {isLoadingCellLine ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
            {[...Array(6)].map((_, i) => <Skeleton key={i} height={40} />)}
          </Box>
        ) : selectedFilename && cellLineData ? (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', pb: 1 }}>
              <Button
                variant="contained"
                color="success"
                onClick={handleMarkAsReady}
                disabled={isMarkingReady}
              >
                {isMarkingReady ? 'Marking as ready...' : 'Mark as Ready'}
              </Button>
            </Box>
            <CellLineEditor
              key={editorKey}
              data={cellLineData}
              cellLineName={selectedFilename.replace(/_v\d+$/, '')}
              filename={selectedFilename}
              lastModified={null}
              location="working"
              onSave={saveCellLine}
              onCreate={async () => {}}
              onDiscard={() => {
                setSelectedFilename(null);
                setCellLineData(null);
              }}
              onStatusChange={async () => {}}
              validationErrors={validationErrors}
              onClearErrors={() => setValidationErrors([])}
              curationMethod={null}
              onCurationMethodChange={() => {}}
            />
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <Typography color="text.secondary">Select a cell line to view and edit it.</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
