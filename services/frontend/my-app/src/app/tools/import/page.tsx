'use client';

import { Typography, Box, IconButton, Tooltip, Button } from '@mui/material';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { useTheme } from '@mui/material/styles';
import { getApiUrl } from '@/lib/api-config';
import { useState } from 'react';
import Card from '@/app/components/Card';

type ImportResult = {
  filename: string;
  status: 'success' | 'error';
  message: string;
};

const parseValidationErrors = (errorData: any): string[] => {
  if (!errorData.detail || !Array.isArray(errorData.detail)) return ['Validation failed'];
  return errorData.detail.map((error: any) => {
    const location = error.loc?.slice(1).join(' → ') || 'Unknown field';
    return `${location}: ${error.msg || 'Invalid value'}`;
  });
};

export default function ImportPage() {
  const theme = useTheme();
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<ImportResult[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files).filter(f => f.name.endsWith('.json'));
    setFiles(prev => [...prev, ...dropped]);
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(prev => [...prev, ...Array.from(e.target.files || [])]);
  };
  const removeFile = (idx: number) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const importFiles = async () => {
    if (files.length === 0) return;
    setIsImporting(true);
    setResults([]);

    const accumulated: ImportResult[] = [];

    for (const file of files) {
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        const response = await fetch(getApiUrl('/working/cell-line'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const result = await response.json();
          accumulated.push({ filename: file.name, status: 'success', message: `Saved as ${result.filename}` });
        } else if (response.status === 422) {
          const errorData = await response.json();
          const errors = parseValidationErrors(errorData);
          accumulated.push({ filename: file.name, status: 'error', message: errors[0] || 'Validation failed' });
        } else {
          const errorData = await response.json();
          accumulated.push({ filename: file.name, status: 'error', message: errorData.detail || 'Import failed' });
        }
      } catch (err) {
        accumulated.push({
          filename: file.name,
          status: 'error',
          message: err instanceof Error ? err.message : 'Failed to read or parse file',
        });
      }
    }

    setResults(accumulated);
    setIsImporting(false);

    // Remove successful files from the queue; keep failed ones for retry
    const failedNames = new Set(accumulated.filter(r => r.status === 'error').map(r => r.filename));
    setFiles(prev => prev.filter(f => failedNames.has(f.name)));
  };

  const clearAll = () => {
    setFiles([]);
    setResults([]);
  };

  return (
    <Box sx={{ p: 3, height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        <FileUploadOutlinedIcon sx={{ fontSize: 28, color: 'primary.main', mr: 2 }} />
        <Typography variant="h5" component="h1">Import</Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, flex: 1, minHeight: 0 }}>

      {/* Left: upload section */}
      <Card width="380px" header="Import JSON Files" headerBgColor={theme.palette.background.paper} headerTextColor={theme.palette.text.primary}>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

          {/* Drop zone */}
          <Box
            component="label"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            sx={{
              flex: 1,
              m: 2,
              mb: 1,
              border: `2px dashed ${isDragging ? theme.palette.secondary.dark : theme.palette.grey[300]}`,
              borderRadius: 2,
              backgroundColor: isDragging ? theme.palette.action.hover : theme.palette.grey[50],
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': { borderColor: theme.palette.secondary.main, backgroundColor: theme.palette.action.hover },
            }}
          >
            <FileUploadOutlinedIcon sx={{ fontSize: 48, color: isDragging ? theme.palette.secondary.dark : theme.palette.grey[400], mb: 1 }} />
            <Typography variant="body2" fontWeight={500} color="text.primary">Drop JSON files or click to browse</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>Files must conform to the cell line schema</Typography>
            <input type="file" hidden multiple accept=".json" onChange={handleFileSelect} />
          </Box>

          {/* Queued file list */}
          {files.length > 0 && (
            <Box sx={{ px: 2, pb: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                {files.length} file{files.length !== 1 ? 's' : ''} queued
              </Typography>
              {files.map((file, idx) => (
                <Box
                  key={`${file.name}-${idx}`}
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 0.75, backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.grey[200]}`, borderRadius: 1 }}
                >
                  <Box sx={{ width: 16, height: 16, flexShrink: 0 }}>
                    <img src="/icons/json.png" alt="json" style={{ width: '100%', height: '100%' }} />
                  </Box>
                  <Typography variant="body2" sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.8rem' }}>
                    {file.name}
                  </Typography>
                  <Tooltip title="Remove">
                    <IconButton size="small" onClick={() => removeFile(idx)} sx={{ p: 0.25 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                    </IconButton>
                  </Tooltip>
                </Box>
              ))}
            </Box>
          )}

          {/* Import button */}
          <Button
            variant="contained"
            disabled={files.length === 0 || isImporting}
            onClick={importFiles}
            sx={{
              backgroundColor: theme.palette.action.selected,
              width: '100%',
              height: '48px',
              borderRadius: '0 0 8px 8px',
              border: `1px solid ${theme.palette.action.selected}`,
              borderTop: 'none',
              '&:hover': { backgroundColor: theme.palette.action.hover, boxShadow: 'none' },
              '&:disabled': { backgroundColor: theme.palette.grey[300], borderColor: theme.palette.grey[300] },
              color: theme.palette.text.primary,
              boxShadow: 'none',
              fontWeight: 600,
            }}
          >
            {isImporting
              ? 'Importing...'
              : `Import ${files.length > 0 ? `${files.length} file${files.length !== 1 ? 's' : ''} ` : ''}as Working Copies`}
          </Button>
        </Box>
      </Card>

      {/* Right: results pane */}
      <Card
        flex={1}
        header={
          <>
            <Typography variant="subtitle1" fontWeight={600} sx={{ px: 0.5, fontSize: '0.9rem', color: theme.palette.text.primary }}>
              {results.length > 0
                ? `Results — ${results.filter(r => r.status === 'success').length} succeeded, ${results.filter(r => r.status === 'error').length} failed`
                : 'Results'}
            </Typography>
            {results.length > 0 && (
              <Tooltip title="Clear results">
                <IconButton size="small" onClick={clearAll} sx={{ color: theme.palette.text.secondary }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </IconButton>
              </Tooltip>
            )}
          </>
        }
        headerBgColor={theme.palette.background.paper}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {results.length === 0 ? (
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Import results will appear here.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ flex: 1, overflow: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
              {results.map((result, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1.5,
                    p: 1.5,
                    borderRadius: 1,
                    border: `1px solid ${result.status === 'success' ? theme.palette.grey[200] : theme.palette.error.light}`,
                    backgroundColor: result.status === 'error' ? `${theme.palette.error.light}22` : theme.palette.background.paper,
                  }}
                >
                  {result.status === 'success'
                    ? <CheckCircleIcon sx={{ fontSize: 18, color: theme.palette.text.secondary, flexShrink: 0, mt: 0.1 }} />
                    : <ErrorIcon sx={{ fontSize: 18, color: theme.palette.error.main, flexShrink: 0, mt: 0.1 }} />
                  }
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {result.filename}
                    </Typography>
                    <Typography variant="caption" sx={{ color: result.status === 'error' ? theme.palette.error.main : theme.palette.text.secondary }}>
                      {result.message}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Card>

      </Box>
    </Box>
  );
}
