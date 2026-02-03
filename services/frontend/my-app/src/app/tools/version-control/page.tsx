'use client';

import {
  Box,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Autocomplete,
  TextField,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { useState, useEffect } from 'react';
import { CellLineDiffViewer } from '../editor/components/CellLineDiffViewer';

interface Version {
  filename: string;
  version: number;
  location: 'working' | 'ready' | 'registered';
}

interface CellLineOption {
  baseName: string;
  versions: Version[];
}

export default function VersionControlPage() {
  const [cellLineOptions, setCellLineOptions] = useState<CellLineOption[]>([]);
  const [showDifferencesOnly, setShowDifferencesOnly] = useState(false);

  // Left side selections
  const [leftCellLine, setLeftCellLine] = useState<string>('');
  const [leftVersion, setLeftVersion] = useState<string>('');
  const [leftData, setLeftData] = useState<any>(null);

  // Right side selections
  const [rightCellLine, setRightCellLine] = useState<string>('');
  const [rightVersion, setRightVersion] = useState<string>('');
  const [rightData, setRightData] = useState<any>(null);

  const [isLoadingLeft, setIsLoadingLeft] = useState(false);
  const [isLoadingRight, setIsLoadingRight] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all cell lines and group by base name
  useEffect(() => {
    const fetchCellLines = async () => {
      try {
        const response = await fetch('http://localhost:8001/get-all-cell-lines');
        if (!response.ok) throw new Error('Failed to fetch cell lines');
        const data = await response.json();

        // Group files by base name (extract base name from versioned filenames)
        const grouped: Record<string, Version[]> = {};

        data.cell_lines.forEach((cl: { name: string; location: 'working' | 'ready' | 'registered' }) => {
          // Extract base name (remove _vX suffix)
          const baseName = cl.name.split('_v')[0];
          // Extract version number
          const versionMatch = cl.name.match(/_v(\d+)$/);
          const version = versionMatch ? parseInt(versionMatch[1]) : 0;

          if (!grouped[baseName]) {
            grouped[baseName] = [];
          }

          grouped[baseName].push({
            filename: cl.name,
            version,
            location: cl.location
          });
        });

        // Convert to array and sort versions
        const options = Object.entries(grouped).map(([baseName, versions]) => ({
          baseName,
          versions: versions.sort((a, b) => b.version - a.version) // Most recent first
        }));

        setCellLineOptions(options);
      } catch (err) {
        console.error('Error fetching cell lines:', err);
        setError('Failed to load cell lines');
      }
    };

    fetchCellLines();
  }, []);

  // Fetch left version data when selection changes
  useEffect(() => {
    const fetchLeftData = async () => {
      if (!leftVersion) {
        setLeftData(null);
        return;
      }

      setIsLoadingLeft(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:8001/cell-line/${leftVersion}`);
        if (!response.ok) throw new Error('Failed to fetch left version');
        const result = await response.json();
        setLeftData(result.data);
      } catch (err) {
        console.error('Error fetching left version data:', err);
        setError('Failed to load left version data');
      } finally {
        setIsLoadingLeft(false);
      }
    };

    fetchLeftData();
  }, [leftVersion]);

  // Fetch right version data when selection changes
  useEffect(() => {
    const fetchRightData = async () => {
      if (!rightVersion) {
        setRightData(null);
        return;
      }

      setIsLoadingRight(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:8001/cell-line/${rightVersion}`);
        if (!response.ok) throw new Error('Failed to fetch right version');
        const result = await response.json();
        setRightData(result.data);
      } catch (err) {
        console.error('Error fetching right version data:', err);
        setError('Failed to load right version data');
      } finally {
        setIsLoadingRight(false);
      }
    };

    fetchRightData();
  }, [rightVersion]);

  const leftVersions = cellLineOptions.find(opt => opt.baseName === leftCellLine)?.versions || [];
  const rightVersions = cellLineOptions.find(opt => opt.baseName === rightCellLine)?.versions || [];

  const getLocationColor = (location: string) => {
    switch (location) {
      case 'working':
        return 'info';
      case 'ready':
        return 'warning';
      case 'registered':
        return 'success';
      default:
        return 'default';
    }
  };

  const getLocationLabel = (location: string) => {
    return location.charAt(0).toUpperCase() + location.slice(1);
  };

  const isLoading = isLoadingLeft || isLoadingRight;

  return (
    <Box sx={{ p: 3, height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CompareArrowsIcon sx={{ fontSize: 28, color: 'primary.main' }} />
          <Typography variant="h5" component="h1">
            Version Control
          </Typography>
        </Box>
        <ToggleButtonGroup
          value={showDifferencesOnly ? 'differences' : 'all'}
          exclusive
          onChange={(e, newValue) => {
            if (newValue !== null) {
              setShowDifferencesOnly(newValue === 'differences');
            }
          }}
          size="small"
        >
          <ToggleButton value="all">
            Show All
          </ToggleButton>
          <ToggleButton
            value="differences"
            sx={{
              backgroundColor: '#fef9e7',
              '&:hover': {
                backgroundColor: '#fdf3d0',
              },
              '&.Mui-selected': {
                backgroundColor: '#fef9e7',
                '&:hover': {
                  backgroundColor: '#fdf3d0',
                }
              }
            }}
          >
            Show Differences
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Main Container */}
      <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Sticky Combined Controls & Headers */}
        <Box
            sx={{
              position: 'sticky',
              top: 0,
              bgcolor: 'background.paper',
              zIndex: 10,
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            {/* Selection Controls */}
            <Box sx={{ display: 'flex', gap: 2, p: 2, pb: 1.5 }}>
              {/* Left Side Controls */}
              <Box sx={{ display: 'flex', gap: 1.5, flex: 1 }}>
                <Autocomplete
                  size="small"
                  sx={{ flex: 1 }}
                  value={cellLineOptions.find(opt => opt.baseName === leftCellLine) || null}
                  onChange={(event, newValue) => {
                    setLeftCellLine(newValue?.baseName || '');
                    setLeftVersion('');
                  }}
                  options={cellLineOptions}
                  getOptionLabel={(option) => `${option.baseName} (${option.versions.length} versions)`}
                  renderInput={(params) => (
                    <TextField {...params} label="Cell Line" placeholder="Search cell line..." />
                  )}
                  renderOption={(props, option) => (
                    <li {...props} key={option.baseName}>
                      {option.baseName} ({option.versions.length} versions)
                    </li>
                  )}
                />

                <FormControl size="small" sx={{ flex: 1 }} disabled={!leftCellLine}>
                  <InputLabel>Version</InputLabel>
                  <Select
                    value={leftVersion}
                    label="Version"
                    onChange={(e) => setLeftVersion(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>Select version</em>
                    </MenuItem>
                    {leftVersions.map(v => (
                      <MenuItem key={v.filename} value={v.filename}>
                        <Typography>v{v.version}</Typography>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Divider */}
              <Divider orientation="vertical" flexItem />

              {/* Right Side Controls */}
              <Box sx={{ display: 'flex', gap: 1.5, flex: 1 }}>
                <Autocomplete
                  size="small"
                  sx={{ flex: 1 }}
                  value={cellLineOptions.find(opt => opt.baseName === rightCellLine) || null}
                  onChange={(event, newValue) => {
                    setRightCellLine(newValue?.baseName || '');
                    setRightVersion('');
                  }}
                  options={cellLineOptions}
                  getOptionLabel={(option) => `${option.baseName} (${option.versions.length} versions)`}
                  renderInput={(params) => (
                    <TextField {...params} label="Cell Line" placeholder="Search cell line..." />
                  )}
                  renderOption={(props, option) => (
                    <li {...props} key={option.baseName}>
                      {option.baseName} ({option.versions.length} versions)
                    </li>
                  )}
                />

                <FormControl size="small" sx={{ flex: 1 }} disabled={!rightCellLine}>
                  <InputLabel>Version</InputLabel>
                  <Select
                    value={rightVersion}
                    label="Version"
                    onChange={(e) => setRightVersion(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>Select version</em>
                    </MenuItem>
                    {rightVersions.map(v => (
                      <MenuItem key={v.filename} value={v.filename}>
                        <Typography>v{v.version}</Typography>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* Headers - only show when both selections are made */}
            {leftCellLine && leftVersion && rightCellLine && rightVersion && (
              <Box sx={{ display: 'flex', px: 2, pb: 1.5 }}>
                {/* Left Header */}
                <Box sx={{ flex: 1, pr: 2, borderRight: 1, borderColor: 'divider' }}>
                  <Typography variant="body1" fontWeight={600}>
                    {leftCellLine}{' '}
                    <Typography component="span" variant="body2" color="text.secondary">
                      v{leftVersions.find(v => v.filename === leftVersion)?.version}
                    </Typography>
                  </Typography>
                </Box>

                {/* Right Header */}
                <Box sx={{ flex: 1, pl: 2 }}>
                  <Typography variant="body1" fontWeight={600}>
                    {rightCellLine}{' '}
                    <Typography component="span" variant="body2" color="text.secondary">
                      v{rightVersions.find(v => v.filename === rightVersion)?.version}
                    </Typography>
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>

        {/* Content Area */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {/* Loading State */}
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          )}

          {/* Diff Viewer */}
          {!isLoading && leftData && rightData && (
            <Box sx={{ p: 3 }}>
              <CellLineDiffViewer
                originalValue={JSON.stringify(leftData, null, 2)}
                modifiedValue={JSON.stringify(rightData, null, 2)}
                originalTitle=""
                modifiedTitle=""
                showDifferencesOnly={showDifferencesOnly}
              />
            </Box>
          )}

          {/* Empty State */}
          {!isLoading && (!leftData || !rightData) && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', p: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <CompareArrowsIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Select two cell lines to compare
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Choose cell lines and versions on both sides to see their differences
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
