'use client';

import React, { Suspense, useState, useEffect, useRef, memo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Box, Typography, TextField, InputAdornment, List, ListItemButton,
  ListItemText, Skeleton, Alert, Popover, Button, Checkbox, FormControlLabel, IconButton,
  ToggleButtonGroup, ToggleButton, Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material/styles';
import CellLineEditor from '@/app/components/CellLineEditor';
import { getApiUrl } from '@/lib/api-config';
import JSZip from 'jszip';

type Location = 'working' | 'ready' | 'registered';

type CurationMethod = 'LLM' | 'Manual' | 'Human Verified';

interface CellLineVersion {
  filename: string;
  location: Location;
  version: number | null;
  curation_method: CurationMethod | null;
}

interface CellLineGroup {
  base_name: string;
  versions: CellLineVersion[];
}


interface CellLinePanelProps {
  groups: CellLineGroup[];
  selectedCellLine: string | null;
  onSelect: (filename: string) => void;
  onDelete: (filename: string) => void;
  onDeleteSelected: () => void;
  checkedFilenames: Set<string>;
  onToggleCheck: (filename: string) => void;
  onDownloadSelected: () => void;
  onDownloadAll: () => void;
  isDownloading: boolean;
}

const CellLinePanel = memo(({ groups, selectedCellLine, onSelect, onDelete, onDeleteSelected, checkedFilenames, onToggleCheck, onDownloadSelected, onDownloadAll, isDownloading }: CellLinePanelProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState<Set<Location>>(new Set(['working', 'ready', 'registered']));
  const [curationFilter, setCurationFilter] = useState<Set<CurationMethod | 'unset'>>(new Set(['LLM', 'Manual', 'Human Verified', 'unset']));
  const [filterAnchor, setFilterAnchor] = useState<HTMLButtonElement | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const newNameInputRef = useRef<HTMLInputElement>(null);

  const filtered = groups
    .map(g => ({
      ...g,
      versions: g.versions.filter(v =>
        locationFilter.has(v.location) &&
        (v.curation_method ? curationFilter.has(v.curation_method) : curationFilter.has('unset'))
      ),
    }))
    .filter(g => g.versions.length > 0 && g.base_name.toLowerCase().includes(searchQuery.toLowerCase()));

  const toggleLocation = (loc: Location) => {
    setLocationFilter(prev => {
      const next = new Set(prev);
      next.has(loc) ? next.delete(loc) : next.add(loc);
      return next;
    });
  };

  const toggleCuration = (method: CurationMethod | 'unset') => {
    setCurationFilter(prev => {
      const next = new Set(prev);
      next.has(method) ? next.delete(method) : next.add(method);
      return next;
    });
  };

  const isFiltered = locationFilter.size < 3 || curationFilter.size < 4;

  const toggleGroup = (baseName: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      next.has(baseName) ? next.delete(baseName) : next.add(baseName);
      return next;
    });
  };

  return (
    <Box sx={{ width: 280, minWidth: 280, display: 'flex', flexDirection: 'column', gap: 1, overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <TextField
          size="small"
          placeholder="Search cell lines..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          sx={{ flex: 1 }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
          }}
        />
        <IconButton
          size="small"
          onClick={e => setFilterAnchor(e.currentTarget)}
          sx={{ color: isFiltered ? 'primary.main' : 'action.active' }}
        >
          <FilterListIcon fontSize="small" />
        </IconButton>
      </Box>

      <Popover
        open={Boolean(filterAnchor)}
        anchorEl={filterAnchor}
        onClose={() => setFilterAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ px: 2, py: 1.5, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>Location</Typography>
          {(['working', 'ready', 'registered'] as const).map(loc => (
            <FormControlLabel
              key={loc}
              control={<Checkbox size="small" checked={locationFilter.has(loc)} onChange={() => toggleLocation(loc)} />}
              label={<Typography variant="body2" sx={{ textTransform: 'capitalize' }}>{loc}</Typography>}
              sx={{ m: 0 }}
            />
          ))}
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, mb: 0.5 }}>Curation Method</Typography>
          {(['LLM', 'Manual', 'Human Verified', 'unset'] as const).map(method => (
            <FormControlLabel
              key={method}
              control={<Checkbox size="small" checked={curationFilter.has(method)} onChange={() => toggleCuration(method)} />}
              label={<Typography variant="body2">{method === 'unset' ? 'Not set' : method}</Typography>}
              sx={{ m: 0 }}
            />
          ))}
        </Box>
      </Popover>

      <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', px: 1 }}>
        Name
      </Typography>

      <Box sx={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        {filtered.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ p: 1 }}>
            {groups.length === 0 ? 'No cell lines found.' : 'No matches.'}
          </Typography>
        ) : (
          <List dense disablePadding>
            {filtered.map(group => {
              const isExpanded = expandedGroups.has(group.base_name);
              const isGroupSelected = group.versions.some(v => v.filename === selectedCellLine);
              return (
                <React.Fragment key={group.base_name}>
                  {/* Group header */}
                  <ListItemButton
                    disableRipple
                    onClick={() => toggleGroup(group.base_name)}
                    sx={{
                      borderRadius: 1, py: 0.5, px: 1,
                      bgcolor: isGroupSelected ? 'action.selected' : undefined,
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
                          <Typography variant="body2" noWrap sx={{ flex: 1, fontSize: '0.8rem', fontWeight: 500 }}>
                            {group.base_name}
                          </Typography>
                          <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'text.disabled', flexShrink: 0 }}>
                            {group.versions.length}
                          </Typography>
                          <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'text.disabled', flexShrink: 0 }}>
                            {isExpanded ? '▾' : '▸'}
                          </Typography>
                        </Box>
                      }
                      disableTypography
                    />
                  </ListItemButton>

                  {/* Versions */}
                  {isExpanded && group.versions.map(v => (
                    <ListItemButton
                      key={v.filename}
                      selected={selectedCellLine === v.filename}
                      onClick={() => onSelect(v.filename)}
                      sx={{ borderRadius: 1, py: 0.25, pl: 1, pr: 0.5 }}
                    >
                      <Checkbox
                        size="small"
                        disableRipple
                        checked={checkedFilenames.has(v.filename)}
                        onClick={e => { e.stopPropagation(); onToggleCheck(v.filename); }}
                        sx={{ p: 0.25, mr: 0.5 }}
                      />
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minWidth: 0, gap: 0.5 }}>
                            <Typography variant="body2" noWrap sx={{ fontSize: '0.75rem', flex: 1 }}>
                              {v.filename}
                            </Typography>
                            <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'text.disabled', flexShrink: 0 }}>
                              {v.location}
                            </Typography>
                            {v.curation_method && (
                              <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'text.disabled', flexShrink: 0 }}>
                                · {v.curation_method}
                              </Typography>
                            )}
                          </Box>
                        }
                        disableTypography
                      />
                      {v.location === 'working' && (
                        <IconButton
                          size="small"
                          onClick={e => { e.stopPropagation(); onDelete(v.filename); }}
                          sx={{ color: 'text.disabled', '&:hover': { color: 'error.main', bgcolor: 'transparent' }, flexShrink: 0, ml: 0.5 }}
                        >
                          <DeleteIcon sx={{ fontSize: '0.9rem' }} />
                        </IconButton>
                      )}
                    </ListItemButton>
                  ))}
                </React.Fragment>
              );
            })}
          </List>
        )}
      </Box>

      {/* Download / delete buttons */}
      <Box sx={{ display: 'flex', gap: 1, pt: 1 }}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<DownloadIcon />}
          disabled={checkedFilenames.size === 0 || isDownloading}
          onClick={onDownloadSelected}
          sx={{ flex: 1, fontSize: '0.6rem' }}
        >
          Selected ({checkedFilenames.size})
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<DownloadIcon />}
          disabled={isDownloading}
          onClick={onDownloadAll}
          sx={{ flex: 1, fontSize: '0.6rem' }}
        >
          All
        </Button>
        <Button
          size="small"
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          disabled={checkedFilenames.size === 0}
          onClick={onDeleteSelected}
          sx={{ flex: 1, fontSize: '0.6rem' }}
        >
          Delete ({checkedFilenames.size})
        </Button>
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

function EditorPageInner() {
  const theme = useTheme();
  const searchParams = useSearchParams();

  // Cell line list state
  const [groups, setGroups] = useState<CellLineGroup[]>([]);

  // Editor state
  const [selectedCellLine, setSelectedCellLine] = useState<string | null>(null);
  const [selectedCellLineLocation, setSelectedCellLineLocation] = useState<'working' | 'ready' | 'registered'>('working');
  const [curationMethod, setCurationMethod] = useState<string | null>(null);
  const [editedMetadata, setEditedMetadata] = useState<Record<string, any> | null>(null);
  const [lastModified, setLastModified] = useState<string | null>(null);
  const [isNewCellLine, setIsNewCellLine] = useState(false);
  const [isLoadingCellLine, setIsLoadingCellLine] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [editorKey, setEditorKey] = useState(0);

  const fetchAllCellLines = async () => {
    try {
      const response = await fetch(getApiUrl('/cell-lines/grouped'));
      if (response.ok) {
        const data = await response.json();
        setGroups(data.groups || []);
      }
    } catch {}
  };

  useEffect(() => { fetchAllCellLines(); }, []);

  // Auto-select cell line from navbar search
  useEffect(() => {
    const cellLineName = searchParams.get('cellLine');
    if (!cellLineName || groups.length === 0) return;
    // Find matching filename across all groups/versions
    const allVersions = groups.flatMap(g => g.versions);
    const match = allVersions.find(v => v.filename === cellLineName)
      ?? allVersions.find(v => v.filename.startsWith(cellLineName));
    if (match) fetchCellLineData(match.filename);
  }, [groups, searchParams]);

  const fetchCellLineData = async (filename: string) => {
    setIsLoadingCellLine(true);
    setFetchError(null);
    try {
      const response = await fetch(getApiUrl(`/cell-line/${filename}`));
      if (response.ok) {
        const result = await response.json();
        setEditedMetadata(result.data);
        setSelectedCellLine(filename);
        setSelectedCellLineLocation((result.location as 'working' | 'ready' | 'registered') || 'working');
        setIsNewCellLine(false);
        setLastModified(result.last_modified || null);
        setCurationMethod(result.curation_method || null);
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
      const method = curationMethod ? `?curation_method=${encodeURIComponent(curationMethod)}` : '';
      const response = isNewCellLine
        ? await fetch(getApiUrl(`/working/cell-line${method}`), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          })
        : await fetch(getApiUrl(`/working/cell-line/${selectedCellLine}${method}`), {
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
    const group = groups.find(g => g.base_name === name);
    if (group?.versions.some(v => v.location === 'working')) {
      setFetchError(`A working copy of "${name}" already exists.`);
      return;
    }
    if (group?.versions.some(v => v.location === 'ready')) {
      setFetchError(`Cannot create "${name}": a ready copy exists.`);
      return;
    }
    setIsNewCellLine(true);
    setIsLoadingCellLine(true);
    setSelectedCellLine(name);
    setCurationMethod('Manual');
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

  const [createAnchor, setCreateAnchor] = useState<HTMLButtonElement | null>(null);
  const [newCellLineName, setNewCellLineName] = useState('');
  const [newCellType, setNewCellType] = useState('');
  const newNameInputRef = useRef<HTMLInputElement>(null);

  const [checkedFilenames, setCheckedFilenames] = useState<Set<string>>(new Set());
  const [isDownloading, setIsDownloading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleteSelectedConfirm, setDeleteSelectedConfirm] = useState(false);

  const handleDeleteRequest = useCallback((filename: string) => {
    setDeleteConfirm(filename);
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;
    try {
      const response = await fetch(getApiUrl('/working/cell-line'), {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: deleteConfirm }),
      });
      if (response.ok) {
        if (selectedCellLine === deleteConfirm) {
          setSelectedCellLine(null);
          setEditedMetadata(null);
          setIsNewCellLine(false);
        }
        fetchAllCellLines();
      }
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleToggleCheck = useCallback((filename: string) => {
    setCheckedFilenames(prev => {
      const next = new Set(prev);
      next.has(filename) ? next.delete(filename) : next.add(filename);
      return next;
    });
  }, []);

  const downloadRecords = async (filenames: string[]) => {
    setIsDownloading(true);
    try {
      const zip = new JSZip();
      await Promise.all(
        filenames.map(async (filename) => {
          const res = await fetch(getApiUrl(`/cell-line/${filename}`));
          if (!res.ok) return;
          const record = await res.json();
          zip.file(`${filename}.json`, JSON.stringify(record, null, 2));
        })
      );
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cell_lines_${new Date().toISOString().slice(0, 10)}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadSelected = useCallback(() => {
    downloadRecords(Array.from(checkedFilenames));
  }, [checkedFilenames]);

  const handleDeleteSelectedConfirm = async () => {
    // Only delete working-location files
    const workingFilenames = Array.from(checkedFilenames).filter(f =>
      groups.flatMap(g => g.versions).find(v => v.filename === f)?.location === 'working'
    );
    await Promise.all(
      workingFilenames.map(filename =>
        fetch(getApiUrl('/working/cell-line'), {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename }),
        })
      )
    );
    if (selectedCellLine && workingFilenames.includes(selectedCellLine)) {
      setSelectedCellLine(null);
      setEditedMetadata(null);
      setIsNewCellLine(false);
    }
    setCheckedFilenames(prev => {
      const next = new Set(prev);
      workingFilenames.forEach(f => next.delete(f));
      return next;
    });
    setDeleteSelectedConfirm(false);
    fetchAllCellLines();
  };

  const handleDownloadAll = useCallback(() => {
    const all = groups.flatMap(g => g.versions.map(v => v.filename));
    downloadRecords(all);
  }, [groups]);

  const handleSelect = useCallback((filename: string) => fetchCellLineData(filename), []);

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 4rem - 16px)', gap: 2, overflow: 'hidden', pr: 2, pb: 2 }}>

      <CellLinePanel
        groups={groups}
        selectedCellLine={selectedCellLine}
        onSelect={handleSelect}
        onDelete={handleDeleteRequest}
        onDeleteSelected={() => setDeleteSelectedConfirm(true)}
        checkedFilenames={checkedFilenames}
        onToggleCheck={handleToggleCheck}
        onDownloadSelected={handleDownloadSelected}
        onDownloadAll={handleDownloadAll}
        isDownloading={isDownloading}
      />

      <Dialog open={Boolean(deleteConfirm)} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Delete cell line?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">{deleteConfirm}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDeleteConfirm}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteSelectedConfirm} onClose={() => setDeleteSelectedConfirm(false)}>
        <DialogTitle>Delete selected cell lines?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            {checkedFilenames.size} cell line{checkedFilenames.size !== 1 ? 's' : ''} selected. Only working copies will be deleted.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteSelectedConfirm(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDeleteSelectedConfirm}>Delete</Button>
        </DialogActions>
      </Dialog>

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
              curationMethod={curationMethod}
              onCurationMethodChange={setCurationMethod}
            />
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, flex: 1 }}>
              <Typography color="text.secondary">Select a cell line from the list, or create a new one.</Typography>
              <Button
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
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
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
                  <ToggleButtonGroup size="small" exclusive value={newCellType} onChange={(_, v) => { if (v) setNewCellType(v); }}>
                    <ToggleButton value="human induced pluripotent stem cell (hiPSC)" sx={{ flex: 1, fontSize: '0.7rem' }}>hiPSC</ToggleButton>
                    <ToggleButton value="human embryonic stem cell (hESC)" sx={{ flex: 1, fontSize: '0.7rem' }}>hESC</ToggleButton>
                  </ToggleButtonGroup>
                  <Button
                    size="small"
                    variant="contained"
                    disabled={!newCellLineName.trim() || !newCellType}
                    onClick={() => {
                      setCreateAnchor(null);
                      createNewCellLine(newCellLineName.trim(), newCellType);
                    }}
                  >
                    Create
                  </Button>
                </Box>
              </Popover>
            </Box>
          )}
      </Box>
    </Box>
  );
}

export default function EditorPage() {
  return (
    <Suspense>
      <EditorPageInner />
    </Suspense>
  );
}
