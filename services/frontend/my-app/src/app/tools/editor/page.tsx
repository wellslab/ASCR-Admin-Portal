'use client';

import { useState, useEffect, useRef, memo, useCallback } from 'react';
import {
  Box, Typography, TextField, InputAdornment, List, ListItemButton,
  ListItemText, Skeleton, Alert, ToggleButtonGroup, ToggleButton,
  Popover, Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';
import CellLineEditor from '@/app/components/CellLineEditor';
import { getApiUrl } from '@/lib/api-config';

type Location = 'working' | 'ready' | 'registered';

interface CellLineEntry {
  name: string;
  location: Location;
}


interface CellLinePanelProps {
  cellLines: CellLineEntry[];
  selectedCellLine: string | null;
  onSelect: (filename: string) => void;
  onCreate: (name: string, cellType: string) => void;
}

const CellLinePanel = memo(({ cellLines, selectedCellLine, onSelect, onCreate }: CellLinePanelProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState<Location | 'all'>('all');
  const [createAnchor, setCreateAnchor] = useState<HTMLButtonElement | null>(null);
  const [newCellLineName, setNewCellLineName] = useState('');
  const [newCellType, setNewCellType] = useState('');
  const newNameInputRef = useRef<HTMLInputElement>(null);

  const filteredCellLines = cellLines.filter(cl => {
    const matchesLocation = locationFilter === 'all' || cl.location === locationFilter;
    const matchesSearch = cl.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLocation && matchesSearch;
  });

  return (
    <Box sx={{ width: 280, minWidth: 280, display: 'flex', flexDirection: 'column', gap: 1, overflow: 'hidden' }}>
      <TextField
        size="small"
        placeholder="Search cell lines..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
        }}
      />

      <ToggleButtonGroup
        size="small"
        value={locationFilter}
        exclusive
        onChange={(_, v) => { if (v) setLocationFilter(v); }}
        sx={{ flexWrap: 'wrap' }}
      >
        {(['all', 'working', 'ready', 'registered'] as const).map(loc => (
          <ToggleButton key={loc} value={loc} sx={{ flex: 1, fontSize: '0.7rem', textTransform: 'capitalize' }}>
            {loc}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <Button
        size="small"
        startIcon={<AddIcon />}
        variant="outlined"
        onClick={e => {
          setNewCellLineName('');
          setNewCellType('');
          setCreateAnchor(e.currentTarget);
          setTimeout(() => newNameInputRef.current?.focus(), 50);
        }}
      >
        Create cell line
      </Button>

      <Popover
        open={Boolean(createAnchor)}
        anchorEl={createAnchor}
        onClose={() => setCreateAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5, minWidth: 260 }}>
          <Typography variant="body2" fontWeight={500}>New cell line</Typography>
          <TextField
            inputRef={newNameInputRef}
            size="small"
            label="Name"
            value={newCellLineName}
            onChange={e => setNewCellLineName(e.target.value)}
          />
          <ToggleButtonGroup
            size="small"
            exclusive
            value={newCellType}
            onChange={(_, v) => { if (v) setNewCellType(v); }}
          >
            <ToggleButton value="human induced pluripotent stem cell (hiPSC)" sx={{ flex: 1, fontSize: '0.7rem' }}>hiPSC</ToggleButton>
            <ToggleButton value="human embryonic stem cell (hESC)" sx={{ flex: 1, fontSize: '0.7rem' }}>hESC</ToggleButton>
          </ToggleButtonGroup>
          <Button
            size="small"
            variant="contained"
            disabled={!newCellLineName.trim() || !newCellType}
            onClick={() => {
              setCreateAnchor(null);
              onCreate(newCellLineName.trim(), newCellType);
            }}
          >
            Create
          </Button>
        </Box>
      </Popover>

      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {filteredCellLines.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ p: 1 }}>
            {cellLines.length === 0 ? 'No cell lines found.' : 'No matches.'}
          </Typography>
        ) : (
          <List dense disablePadding>
            {filteredCellLines.map(cl => (
              <ListItemButton
                key={cl.name}
                selected={selectedCellLine === cl.name}
                onClick={() => onSelect(cl.name)}
                sx={{ borderRadius: 1, py: 0.25, px: 1 }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, minWidth: 0 }}>
                      <Typography variant="body2" noWrap sx={{ flex: 1, fontSize: '0.8rem' }}>
                        {cl.name.replace('.json', '')}
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'text.disabled', flexShrink: 0 }}>
                        {cl.location}
                      </Typography>
                    </Box>
                  }
                  disableTypography
                />
              </ListItemButton>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
});

const parseValidationErrors = (errorData: any): string[] => {
  if (!errorData.detail || !Array.isArray(errorData.detail)) return ['Validation failed'];
  return errorData.detail.map((error: any) => {
    const location = error.loc?.slice(1).join(' → ') || 'Unknown field';
    const message = error.msg || 'Invalid value';
    const input = error.input !== undefined ? ` (got: "${error.input}")` : '';
    return `${location}: ${message}${input}`;
  });
};

export default function EditorPage() {
  const theme = useTheme();

  // Cell line list state
  const [cellLines, setCellLines] = useState<CellLineEntry[]>([]);

  // Editor state
  const [selectedCellLine, setSelectedCellLine] = useState<string | null>(null);
  const [selectedCellLineLocation, setSelectedCellLineLocation] = useState<'working' | 'ready'>('working');
  const [editedMetadata, setEditedMetadata] = useState<Record<string, any> | null>(null);
  const [lastModified, setLastModified] = useState<string | null>(null);
  const [isNewCellLine, setIsNewCellLine] = useState(false);
  const [isLoadingCellLine, setIsLoadingCellLine] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [editorKey, setEditorKey] = useState(0);

  const fetchAllCellLines = async () => {
    try {
      const response = await fetch(getApiUrl('/get-all-cell-lines'));
      if (response.ok) {
        const data = await response.json();
        setCellLines(data.cell_lines || []);
      }
    } catch {}
  };

  useEffect(() => { fetchAllCellLines(); }, []);

  const fetchCellLineData = async (filename: string) => {
    setIsLoadingCellLine(true);
    setFetchError(null);
    try {
      const response = await fetch(getApiUrl(`/cell-line/${filename}`));
      if (response.ok) {
        const result = await response.json();
        setEditedMetadata(result.data);
        setSelectedCellLine(filename);
        setSelectedCellLineLocation((result.location as 'working' | 'ready') || 'working');
        setIsNewCellLine(false);
        setLastModified(result.last_modified || null);
        setEditorKey(k => k + 1);
      } else if (response.status === 404) {
        setFetchError(`Cell line "${filename}" was not found.`);
      } else {
        setFetchError(`Failed to load cell line: ${response.statusText}`);
      }
    } catch {
      setFetchError('Network error — could not reach the backend.');
    } finally {
      setIsLoadingCellLine(false);
    }
  };

  const handleStatusChange = async (newLocation: 'working' | 'ready') => {
    if (!selectedCellLine) return;
    const endpoint = newLocation === 'ready' ? 'move-to-ready' : 'move-to-working';
    try {
      const response = await fetch(getApiUrl(`/cell-line/${selectedCellLine}/${endpoint}`), { method: 'POST' });
      if (response.ok) {
        setSelectedCellLineLocation(newLocation);
        fetchAllCellLines();
      }
    } catch {}
  };

  const saveCellLine = async (data: Record<string, any[] | Record<string, any>>) => {
    if (!selectedCellLine) return;
    try {
      setValidationErrors([]);
      const response = isNewCellLine
        ? await fetch(getApiUrl('/working/cell-line'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          })
        : await fetch(getApiUrl(`/working/cell-line/${selectedCellLine}`), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });

      if (response.ok) {
        const result = await response.json();
        setEditedMetadata(data);
        setLastModified(new Date().toISOString());
        if (isNewCellLine) {
          setIsNewCellLine(false);
          setSelectedCellLine(result.filename);
          fetchAllCellLines();
        }
      } else if (response.status === 409) {
        const error = await response.json();
        setValidationErrors([error.detail || 'Cannot save: conflict with existing cell line']);
      } else if (response.status === 422) {
        setValidationErrors(parseValidationErrors(await response.json()));
      } else {
        setValidationErrors([`Failed to save: ${response.statusText}`]);
      }
    } catch {
      setValidationErrors(['An unexpected error occurred while saving']);
    }
  };

  const createNewCellLine = async (name: string, cellType: string) => {
    const extractBase = (fn: string) => fn.includes('_v') ? fn.split('_v')[0] : fn;
    if (cellLines.find(cl => extractBase(cl.name) === name && cl.location === 'working')) {
      setFetchError(`A working copy of "${name}" already exists.`);
      return;
    }
    if (cellLines.find(cl => extractBase(cl.name) === name && cl.location === 'ready')) {
      setFetchError(`Cannot create "${name}": a ready copy exists.`);
      return;
    }
    setIsNewCellLine(true);
    setIsLoadingCellLine(true);
    setSelectedCellLine(name);
    try {
      const params = new URLSearchParams({ hpscreg_name: name, cell_type: cellType });
      const response = await fetch(getApiUrl(`/get-empty-form?${params.toString()}`));
      if (!response.ok) {
        setFetchError('Failed to fetch empty form structure');
        setSelectedCellLine(null);
        setIsNewCellLine(false);
        return;
      }
      setEditedMetadata(await response.json());
      setLastModified(null);
      setEditorKey(k => k + 1);
    } catch {
      setFetchError('Error creating new cell line');
      setSelectedCellLine(null);
      setIsNewCellLine(false);
    } finally {
      setIsLoadingCellLine(false);
    }
  };

  const handleSelect = useCallback((filename: string) => fetchCellLineData(filename), []);
  const handleCreate = useCallback((name: string, cellType: string) => createNewCellLine(name, cellType), [cellLines]);

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 4rem - 16px)', gap: 2, overflow: 'hidden', pr: 2, pb: 2 }}>

      <CellLinePanel
        cellLines={cellLines}
        selectedCellLine={selectedCellLine}
        onSelect={handleSelect}
        onCreate={handleCreate}
      />

      {/* Right panel — editor */}
      <Box sx={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {fetchError && (
          <Alert severity="warning" onClose={() => setFetchError(null)} sx={{ mb: 1 }}>
            {fetchError}
          </Alert>
        )}

        {isLoadingCellLine ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
            {[...Array(6)].map((_, i) => <Skeleton key={i} height={40} />)}
          </Box>
        ) : selectedCellLine && editedMetadata ? (
          <CellLineEditor
            key={editorKey}
            data={editedMetadata}
            cellLineName={selectedCellLine.replace('.json', '').replace(/_v\d+$/, '')}
            filename={selectedCellLine}
            lastModified={lastModified}
            location={selectedCellLineLocation}
            onSave={saveCellLine}
            onCreate={createNewCellLine}
            onDiscard={() => {
              setSelectedCellLine(null);
              setEditedMetadata(null);
              setIsNewCellLine(false);
              setValidationErrors([]);
            }}
            onStatusChange={handleStatusChange}
            validationErrors={validationErrors}
            onClearErrors={() => setValidationErrors([])}
          />
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <Typography color="text.secondary">Select a cell line to edit, or create a new one.</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
