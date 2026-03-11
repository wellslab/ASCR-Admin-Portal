'use client';

import { Typography, Box, List, ListItem, ListItemIcon, ListItemText, IconButton, LinearProgress, Skeleton, Popover, TextField, Checkbox, FormControlLabel, InputAdornment, Collapse, Tooltip, Alert, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { Button } from '@mui/material';
import BlurOnOutlinedIcon from '@mui/icons-material/BlurOnOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useTheme } from '@mui/material/styles';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import AddIcon from '@mui/icons-material/Add';
import Card from '@/app/components/Card';
import CellLineEditor from '@/app/components/CellLineEditor';
import { getApiUrl } from '@/lib/api-config';

// Utility function to convert File to Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the "data:application/pdf;base64," prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

// Compact per-cell-line pipeline card (curating / normalizing stages)
const CellLinePipelineCard = ({ cl, theme }: { cl: any; theme: any }) => {
  const pipelineStages = [
    { key: 'curating', label: 'Cur' },
    { key: 'normalizing', label: 'Nor' },
  ];

  const getStageIcon = (status: string) => {
    if (status === 'completed') return <CheckCircleIcon sx={{ fontSize: 11, color: theme.palette.text.secondary }} />;
    if (status === 'failed') return <ErrorIcon sx={{ fontSize: 11, color: theme.palette.error.main }} />;
    if (status === 'processing') return <BlurOnOutlinedIcon sx={{ fontSize: 11, color: theme.palette.text.secondary }} />;
    return <Box sx={{ width: 11, height: 11, borderRadius: '50%', border: `1px solid ${theme.palette.grey[300]}` }} />;
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.2 }}>
      <Typography variant="caption" sx={{ flex: 1, fontSize: '0.72rem', color: theme.palette.text.secondary }}>
        {cl.name}
      </Typography>
      {pipelineStages.map(({ key, label }) => (
        <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
          {getStageIcon(cl[key] || 'pending')}
          <Typography variant="caption" sx={{ fontSize: '0.65rem', color: theme.palette.text.disabled }}>
            {label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

// Stage status component for detailed progress
const StageItem = ({ stage, theme }: { stage: any; theme: any }) => {
  const isParallelProcessing = stage.stage === 'processing' && Array.isArray(stage.data?.cell_lines)
    && stage.data.cell_lines.some((cl: any) => 'curating' in cl || 'normalizing' in cl);

  const getStageIcon = () => {
    if (stage.status === 'completed') {
      return <CheckCircleIcon sx={{ fontSize: 18, color: theme.palette.text.secondary }} />;
    } else if (stage.status === 'failed') {
      return <ErrorIcon sx={{ fontSize: 18, color: theme.palette.text.secondary }} />;
    } else if (stage.status === 'processing') {
      return <BlurOnOutlinedIcon sx={{ fontSize: 18, color: theme.palette.text.secondary }} />;
    } else {
      return <Box sx={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${theme.palette.grey[300]}` }} />;
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1, py: 0.5 }}>
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
          {stage.message}
        </Typography>
        {isParallelProcessing ? (
          <Box sx={{ pl: 1, mt: 0.5 }}>
            {stage.data.cell_lines.map((cl: any, idx: number) => (
              <CellLinePipelineCard key={idx} cl={cl} theme={theme} />
            ))}
          </Box>
        ) : stage.data?.cell_lines && Array.isArray(stage.data.cell_lines) && (
          <Box sx={{ pl: 2, mt: 0.5 }}>
            {stage.data.cell_lines.map((cl: any, idx: number) => (
              <Box key={idx} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 0.5, py: 0.25 }}>
                <Typography variant="caption" sx={{ fontSize: '0.75rem', color: theme.palette.text.secondary }}>
                  {cl.name}
                </Typography>
                {cl.status === 'completed' && <CheckCircleIcon sx={{ fontSize: 14, color: theme.palette.text.secondary }} />}
                {cl.status === 'processing' && <BlurOnOutlinedIcon sx={{ fontSize: 14, color: theme.palette.text.secondary }} />}
                {cl.status === 'pending' && <Box sx={{ width: 14, height: 14, borderRadius: '50%', border: `1px solid ${theme.palette.grey[300]}` }} />}
              </Box>
            ))}
          </Box>
        )}
      </Box>
      {getStageIcon()}
    </Box>
  );
};

// Animated progress bar component with expandable details
const TaskProgressBar = ({ task, onRetry, onClear }: { task: any; onRetry: (taskId: string) => void; onClear: (taskId: string) => void }) => {
  const theme = useTheme();
  // Auto-expand tasks that are processing or queued to show live progress
  const [expanded, setExpanded] = useState(task.status === 'processing' || task.status === 'queued');
  const [retrying, setRetrying] = useState(false);

  // Auto-expand when task starts processing
  useEffect(() => {
    if (task.status === 'processing' || task.status === 'queued') {
      setExpanded(true);
    }
  }, [task.status]);

  const getMainIcon = () => {
    if (task.status === 'completed') {
      return <CheckCircleIcon sx={{ fontSize: 18, color: theme.palette.text.secondary }} />;
    } else if (task.status === 'failed') {
      return <ErrorIcon sx={{ fontSize: 18, color: theme.palette.text.secondary }} />;
    } else {
      return <BlurOnOutlinedIcon sx={{ fontSize: 18, color: theme.palette.text.secondary }} />;
    }
  };

  const getStatusText = () => {
    if (task.status === 'completed') return 'Complete';
    if (task.status === 'failed') return 'Failed';
    if (task.status === 'processing') return 'Processing...';
    return 'Queued';
  };

  const handleRetry = async () => {
    setRetrying(true);
    try {
      await onRetry(task.task_id);
    } finally {
      setRetrying(false);
    }
  };

  return (
    <ListItem
      sx={{
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 1,
        py: 1,
        borderBottom: `1px solid ${theme.palette.grey[200]}`,
      }}
    >
      {/* Main task header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
        <ListItemText
          primary={task.filename}
          secondary={getStatusText()}
          primaryTypographyProps={{ fontSize: '0.85rem' }}
          secondaryTypographyProps={{ fontSize: '0.75rem' }}
          sx={{ flex: 1 }}
        />
        {/* Expand/collapse button - always show for active tasks */}
        {(task.status === 'processing' || task.status === 'queued' || (task.stages && task.stages.length > 0)) && (
          <IconButton
            size="small"
            onClick={() => setExpanded(!expanded)}
            sx={{ p: 0.5 }}
          >
            {expanded ? <ExpandLessIcon sx={{ fontSize: 18 }} /> : <ExpandMoreIcon sx={{ fontSize: 18 }} />}
          </IconButton>
        )}
        {/* Retry button for failed tasks */}
        {task.status === 'failed' && (
          <Tooltip title="Retry task">
            <IconButton
              size="small"
              onClick={handleRetry}
              disabled={retrying}
              sx={{ p: 0.5 }}
            >
              <RefreshIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        )}
        {/* Clear button */}
        <Tooltip title="Clear task">
          <IconButton
            size="small"
            onClick={() => onClear(task.task_id)}
            sx={{ p: 0.5 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </IconButton>
        </Tooltip>
        {/* Status icon on the right */}
        {getMainIcon()}
      </Box>

      {/* Progress bar - only show for processing tasks */}
      {task.status === 'processing' && (
        <LinearProgress
          sx={{
            width: '100%',
            height: 6,
            borderRadius: 3,
            '& .MuiLinearProgress-bar': {
              borderRadius: 3,
            }
          }}
        />
      )}

      {/* Expandable stage details */}
      <Collapse in={expanded} sx={{ width: '100%' }}>
        <Box sx={{ pl: 1, pt: 1 }}>
          {task.stages && task.stages.length > 0 ? (
            task.stages.map((stage: any, idx: number) => (
              <StageItem key={idx} stage={stage} theme={theme} />
            ))
          ) : (
            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              Waiting for task to start...
            </Typography>
          )}
        </Box>
      </Collapse>
    </ListItem>
  );
};

export default function CurationNewPage() {
  const theme = useTheme();
  const searchParams = useSearchParams();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [taskResults, setTaskResults] = useState<any[]>([]);
  const [activeTasks, setActiveTasks] = useState<Array<{
    task_id: string;
    filename: string;
    status: 'queued' | 'processing' | 'completed' | 'failed';
    stages?: any[];
    created_at?: string;
    updated_at?: string;
    result?: any;
  }>>([]);
  const [cellLines, setCellLines] = useState<Array<{ name: string; location: string }>>([]);
  const [selectedCellLine, setSelectedCellLine] = useState<string | null>(null);
  const [editedMetadata, setEditedMetadata] = useState<Record<string, any[] | Record<string, any>>>({});
  const [lastModified, setLastModified] = useState<string | null>(null);
  const [isLoadingCellLine, setIsLoadingCellLine] = useState(false);
  const [editorKey, setEditorKey] = useState(0);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isNewCellLine, setIsNewCellLine] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [createAnchor, setCreateAnchor] = useState<HTMLButtonElement | null>(null);
  const [newCellType, setNewCellType] = useState<string>('');
  const [filterAnchor, setFilterAnchor] = useState<HTMLButtonElement | null>(null);
  const [filterWorking, setFilterWorking] = useState(true);
  const [filterReady, setFilterReady] = useState(true);
  const [filterRegistered, setFilterRegistered] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedForDownload, setSelectedForDownload] = useState<Set<string>>(new Set());
  const [deleteAnchorEl, setDeleteAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [pendingDeleteName, setPendingDeleteName] = useState<string | null>(null);
  const newNameInputRef = useRef<HTMLInputElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Fetch task history from backend
  const fetchTaskHistory = async () => {
    try {
      const response = await fetch(getApiUrl('/tasks?limit=50'));
      if (response.ok) {
        const data = await response.json();
        setActiveTasks(data.tasks || []);
      }
    } catch (error) {
      console.error('Error fetching task history:', error);
    }
  };

  // Fetch all cell lines from backend (both working and ready)
  const fetchAllCellLines = async () => {
    try {
      const response = await fetch(getApiUrl('/get-all-cell-lines'));
      if (response.ok) {
        const data = await response.json();
        setCellLines(data.cell_lines || []);
      }
    } catch (error) {
      console.error('Error fetching cell lines:', error);
    }
  };

  // Fetch specific cell line data
  const fetchCellLineData = async (filename: string) => {
    setIsLoadingCellLine(true);
    setFetchError(null);
    try {
      const response = await fetch(getApiUrl(`/cell-line/${filename}`));
      if (response.ok) {
        const result = await response.json();
        // Backend returns { data: {...}, location: "...", filename: "...", last_modified: "..." }
        setEditedMetadata(result.data);
        setSelectedCellLine(filename);
        setIsNewCellLine(false);
        setLastModified(result.last_modified || null);
        setEditorKey(k => k + 1); // Force remount so uncontrolled inputs reset to new defaultValues
      } else if (response.status === 404) {
        setFetchError(`Cell line "${filename.replace('.json', '')}" was not found. It may have been deleted or moved.`);
      } else {
        setFetchError(`Failed to load cell line: ${response.statusText}`);
      }
    } catch (error) {
      setFetchError('Network error — could not reach the backend.');
    } finally {
      setIsLoadingCellLine(false);
    }
  };

  // Save cell line data to backend
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
          // First save: update to the versioned filename assigned by the backend
          setIsNewCellLine(false);
          setSelectedCellLine(result.filename);
          fetchAllCellLines();
        }
      } else if (response.status === 409) {
        const error = await response.json();
        setValidationErrors([error.detail || 'Cannot save: conflict with existing cell line']);
      } else if (response.status === 422) {
        const errorData = await response.json();
        const errors = parseValidationErrors(errorData);
        setValidationErrors(errors);
      } else {
        setValidationErrors([`Failed to save: ${response.statusText}`]);
      }
    } catch (error) {
      setValidationErrors(['An unexpected error occurred while saving']);
    }
  };

  // Parse Pydantic validation errors into user-friendly messages
  const parseValidationErrors = (errorData: any): string[] => {
    if (!errorData.detail || !Array.isArray(errorData.detail)) {
      return ['Validation failed'];
    }

    return errorData.detail.map((error: any) => {
      const location = error.loc?.slice(1).join(' → ') || 'Unknown field';
      const message = error.msg || 'Invalid value';
      const input = error.input !== undefined ? ` (got: "${error.input}")` : '';
      return `${location}: ${message}${input}`;
    });
  };

  // Create new cell line with initial name and cell type
  const createNewCellLine = async (name: string, cellType: string) => {
    // Check for conflicts against the already-loaded cell line list
    const extractBase = (fn: string) => fn.includes('_v') ? fn.split('_v')[0] : fn;
    const workingConflict = cellLines.find(cl => extractBase(cl.name) === name && cl.location === 'working');
    const readyConflict = cellLines.find(cl => extractBase(cl.name) === name && cl.location === 'ready');

    if (workingConflict) {
      setFetchError(`A working copy of "${name}" already exists. Select it from the list to edit it.`);
      return;
    }
    if (readyConflict) {
      setFetchError(`Cannot create "${name}": a ready copy exists. Finalise this cell line before creating a new version.`);
      return;
    }

    setIsNewCellLine(true);
    setIsLoadingCellLine(true);
    setSelectedCellLine(name); // Set so skeleton shows while loading
    try {
      const params = new URLSearchParams({ hpscreg_name: name, cell_type: cellType });
      const response = await fetch(getApiUrl(`/get-empty-form?${params.toString()}`));
      if (!response.ok) {
        setFetchError('Failed to fetch empty form structure');
        setSelectedCellLine(null);
        setIsNewCellLine(false);
        return;
      }
      const emptyData = await response.json();
      setEditedMetadata(emptyData);
      setLastModified(null);
      setEditorKey(k => k + 1);
    } catch (error) {
      setFetchError('Error creating new cell line');
      setSelectedCellLine(null);
      setIsNewCellLine(false);
    } finally {
      setIsLoadingCellLine(false);
    }
  };

  // Download cell line as JSON
  const downloadCellLine = async (filename: string, e?: React.MouseEvent) => {
    e?.stopPropagation(); // Prevent selecting the cell line
    try {
      const response = await fetch(getApiUrl(`/cell-line/${filename}`));
      if (response.ok) {
        const result = await response.json();
        const dataStr = JSON.stringify(result.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        console.error('Failed to download cell line:', response.statusText);
      }
    } catch (error) {
      console.error('Error downloading cell line:', error);
    }
  };

  // Delete a working cell line
  const deleteCellLine = async (filename: string) => {
    try {
      const response = await fetch(getApiUrl('/working/cell-line'), {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename }),
      });
      if (response.ok) {
        setCellLines(prev => prev.filter(cl => cl.name !== filename));
        if (selectedCellLine === filename) {
          setSelectedCellLine(null);
          setEditedMetadata({});
        }
        setSelectedForDownload(prev => { const next = new Set(prev); next.delete(filename); return next; });
      } else {
        const err = await response.json();
        console.error('Failed to delete cell line:', err.detail);
      }
    } catch (error) {
      console.error('Error deleting cell line:', error);
    }
  };

  // Toggle selection for batch download
  const toggleSelection = (filename: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedForDownload(prev => {
      const newSet = new Set(prev);
      if (newSet.has(filename)) {
        newSet.delete(filename);
      } else {
        newSet.add(filename);
      }
      return newSet;
    });
  };

  // Batch download selected cell lines
  const batchDownload = async () => {
    for (const filename of selectedForDownload) {
      await downloadCellLine(filename);
      // Small delay between downloads to avoid browser issues
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    setSelectedForDownload(new Set()); // Clear selection after download
  };

  // Retry a failed task
  const retryTask = async (taskId: string) => {
    try {
      const response = await fetch(getApiUrl(`/tasks/${taskId}/retry`), {
        method: 'POST',
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Task retried:', result);

        // Add the new task to active tasks
        const newTask = {
          task_id: result.new_task_id,
          filename: result.filename,
          status: 'queued' as const,
          stages: [],
        };
        setActiveTasks(prev => [newTask, ...prev]);
      } else {
        const error = await response.json();
        console.error('Failed to retry task:', error);
        alert(error.detail || 'Failed to retry task');
      }
    } catch (error) {
      console.error('Error retrying task:', error);
      alert('Failed to retry task. Please try again.');
    }
  };

  // Clear a task from the list and backend
  const clearTask = async (taskId: string) => {
    try {
      const response = await fetch(getApiUrl(`/tasks/${taskId}`), {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove from local state
        setActiveTasks(prev => prev.filter(task => task.task_id !== taskId));
        console.log('Task deleted successfully');
      } else {
        const error = await response.json();
        console.error('Failed to delete task:', error);
        alert(error.detail || 'Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task. Please try again.');
    }
  };

  // Toggle select all for filtered cell lines
  const toggleSelectAll = (filteredCellLines: Array<{ name: string; location: string }>) => {
    const filteredNames = filteredCellLines.map(cl => cl.name);
    const allSelected = filteredNames.every(name => selectedForDownload.has(name));

    if (allSelected) {
      // Deselect all filtered items
      setSelectedForDownload(prev => {
        const newSet = new Set(prev);
        filteredNames.forEach(name => newSet.delete(name));
        return newSet;
      });
    } else {
      // Select all filtered items
      setSelectedForDownload(prev => {
        const newSet = new Set(prev);
        filteredNames.forEach(name => newSet.add(name));
        return newSet;
      });
    }
  };

  // Fetch task history and cell lines on mount
  useEffect(() => {
    fetchTaskHistory();
    fetchAllCellLines();
    const interval = setInterval(fetchAllCellLines, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Load cell line from URL query parameter
  useEffect(() => {
    const cellLineParam = searchParams.get('cellLine');
    if (cellLineParam && cellLineParam !== selectedCellLine) {
      fetchCellLineData(cellLineParam);
    }
  }, [searchParams]);

  // WebSocket connection effect
  useEffect(() => {
    let reconnectTimeout: NodeJS.Timeout;

    const connectWebSocket = () => {
      try {
        // Connect to WebSocket for real-time task updates
        wsRef.current = new WebSocket('ws://localhost:8001/ws/task-updates');

        wsRef.current.onopen = () => {
          console.log('WebSocket connected for task updates');
        };

        wsRef.current.onmessage = (event) => {
          const message = JSON.parse(event.data);
          console.log('WebSocket message:', message);

          // Handle different message types
          if (message.type === 'task_progress') {
            // Update task progress stages
            setActiveTasks(prev =>
              prev.map(task =>
                task.task_id === message.task_id
                  ? {
                      ...task,
                      stages: updateTaskStages(task.stages || [], message.stage, message.status, message.message, message.data),
                      updated_at: message.timestamp
                    }
                  : task
              )
            );
          } else if (message.type === 'task_completed') {
            // Handle legacy task completion
            setTaskResults(prev => [...prev, message]);

            setActiveTasks(prev =>
              prev.map(task =>
                task.task_id === message.task_id
                  ? {
                      ...task,
                      status: message.result?.status === 'error' ? 'failed' : 'completed',
                      result: message.result,
                      updated_at: message.timestamp
                    }
                  : task
              )
            );

            // Refresh cell lines list when a task completes successfully
            if (message.result?.status === 'success') {
              fetchAllCellLines();
            }
          }
        };

        wsRef.current.onerror = () => {
          // Silently handle WebSocket errors - real-time updates are optional
          // The page will still function normally without WebSocket connection
        };

        wsRef.current.onclose = () => {
          console.log('WebSocket connection closed');
          // Attempt to reconnect after 5 seconds
          reconnectTimeout = setTimeout(() => {
            console.log('Attempting to reconnect WebSocket...');
            connectWebSocket();
          }, 5000);
        };
      } catch (error) {
        // Silently handle connection failures - WebSocket is optional
        console.log('WebSocket unavailable - real-time updates disabled');
      }
    };

    connectWebSocket();

    // Cleanup on component unmount
    return () => {
      clearTimeout(reconnectTimeout);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Helper function to update task stages
  const updateTaskStages = (currentStages: any[], stage: string, status: string, message: string, data: any) => {
    const existingStageIndex = currentStages.findIndex(s => s.stage === stage);

    if (existingStageIndex >= 0) {
      // Update existing stage
      const updatedStages = [...currentStages];
      updatedStages[existingStageIndex] = {
        stage,
        status,
        message,
        data: data || {},
        timestamp: new Date().toISOString()
      };
      return updatedStages;
    } else {
      // Add new stage
      return [
        ...currentStages,
        {
          stage,
          status,
          message,
          data: data || {},
          timestamp: new Date().toISOString()
        }
      ];
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return '/icons/pdf.png';
      case 'docx':
        return '/icons/docx-file.png';
      case 'txt':
        return '/icons/txt.png';
      case 'json':
      case 'jsonc':
        return '/icons/json.png';
      default:
        return '/icons/txt.png';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(file => file.name !== fileName));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        height: 'calc(92vh - 24px)',
        backgroundColor: 'background.primary',
        borderRadius: 3,
        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.06)',
      }}
    >
      {/* Left quarter */}
      <Box
        id="left-quarter"
        sx={{
          flex: 1,
          backgroundColor: 'background.primary',
          overflow: 'auto',
          maxHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {/* Upload card */}
        <Card width="100%" height="40%" marginBottom={2} header="Upload Sources" headerBgColor={theme.palette.action.selected} headerTextColor={theme.palette.text.primary}>
          <Box id="upload-card-content" sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Drag-and-drop zone */}
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
                '&:hover': {
                  borderColor: theme.palette.secondary.main,
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <FileUploadOutlinedIcon
                sx={{
                  fontSize: 48,
                  color: isDragging ? theme.palette.secondary.dark : theme.palette.grey[400],
                  mb: 1,
                }}
              />
              <Typography variant="body2" fontWeight={500} color="text.primary">
                Drop files here or click to browse
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                PDF, DOCX, TXT, JSON files supported
              </Typography>
              <input
                type="file"
                hidden
                multiple
                accept=".pdf,.doc,.docx,.txt,.json,.jsonc"
                onChange={handleFileSelect}
              />
            </Box>

            {/* Uploaded files list */}
            {uploadedFiles.length > 0 && (
              <Box
                sx={{
                  flex: 1,
                  px: 2,
                  pb: 1,
                  overflow: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '6px',
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: 'transparent',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: theme.palette.grey[300],
                    borderRadius: '3px',
                  },
                }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', fontWeight: 500 }}>
                  {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''} ready
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                  {uploadedFiles.map((file, index) => (
                    <Box
                      key={`${file.name}-${index}`}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        p: 1,
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.grey[200]}`,
                        borderRadius: 1,
                        '&:hover': {
                          borderColor: theme.palette.grey[300],
                          backgroundColor: theme.palette.grey[50],
                        },
                      }}
                    >
                      <Box sx={{ width: 20, height: 20, flexShrink: 0 }}>
                        <img
                          src={getFileIcon(file.name)}
                          alt={`${file.name} icon`}
                          style={{ width: '100%', height: '100%' }}
                        />
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          flex: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          fontSize: '0.85rem',
                        }}
                      >
                        {file.name}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => removeFile(file.name)}
                        sx={{
                          p: 0.5,
                          '&:hover': {
                            backgroundColor: theme.palette.error.light,
                            color: theme.palette.error.dark,
                          },
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* Start AI Curation Button */}
            <Button
              id="start-ai-curation-button"
              variant="contained"
              color="primary"
              disabled={uploadedFiles.length === 0}
              onClick={async () => {
                console.log('Starting AI curation for files:', uploadedFiles);

                try {
                  // Convert files to Base64
                  const filesWithBase64 = await Promise.all(
                    uploadedFiles.map(async (file) => ({
                      filename: file.name,
                      file_data: await fileToBase64(file)
                    }))
                  );

                  // Call the API
                  const response = await fetch(getApiUrl('/start-ai-curation'), {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ files: filesWithBase64 })
                  });

                  if (response.ok) {
                    const result = await response.json();
                    console.log('Curation tasks queued:', result);

                    // Add tasks to active tasks list for progress tracking
                    const newTasks = result.tasks.map((task: any) => ({
                      task_id: task.task_id,
                      filename: task.filename,
                      status: 'queued' as const,
                      stages: [],
                      created_at: new Date().toISOString(),
                    }));
                    setActiveTasks(prev => [...prev, ...newTasks]);
                  } else {
                    const error = await response.json();
                    console.error('Curation failed:', error);
                    // Show error message to user
                    alert(error.detail || 'Failed to start curation. Please try again.');
                  }
                } catch (error) {
                  console.error('Error starting curation:', error);
                  // TODO: Show error message
                }
              }}
              sx={{
                backgroundColor: theme.palette.action.selected,
                width: '100%',
                height: '48px',
                borderRadius: '0 0 8px 8px',
                border: `1px solid ${theme.palette.action.selected}`,
                borderTop: 'none',
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                  boxShadow: 'none',
                },
                '&:disabled': {
                  backgroundColor: theme.palette.grey[300],
                  borderColor: theme.palette.grey[300],
                },
                color: theme.palette.text.primary,
                boxShadow: 'none',
                fontWeight: 600,
              }}
            >
              <BlurOnOutlinedIcon sx={{ mr: 1 }} />
              Start AI Curation
            </Button>
          </Box>
        </Card>

        {/* Task Progress */}
        <Card width="100%" flex={1} header={`Task History (${activeTasks.filter(t => t.status === 'completed').length}/${activeTasks.length})`}>
          <Box sx={{
            flex: 1,
            overflow: 'auto',
            maxHeight: '100%',
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: theme.palette.grey[300],
              borderRadius: '3px',
            },
          }}>
            {activeTasks.length === 0 ? (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No active tasks. Upload files and start AI curation to see progress here.
                </Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {activeTasks
                  .sort((a, b) => {
                    // Sort by created_at in descending order (most recent first)
                    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
                    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
                    return dateB - dateA;
                  })
                  .map((task) => (
                    <TaskProgressBar key={task.task_id} task={task} onRetry={retryTask} onClear={clearTask} />
                  ))}
              </List>
            )}
          </Box>
        </Card>
      </Box>

      {/* Middle half (two quarters merged) */}
      <Card flex={2} header='Cell Line Editor'>
        {fetchError && (
          <Alert severity="warning" onClose={() => setFetchError(null)} sx={{ mx: 2, mt: 1 }}>
            {fetchError}
          </Alert>
        )}
        {isLoadingCellLine ? (
          <Box sx={{ display: 'flex', height: '100%', '& .MuiSkeleton-wave::after': { animationDuration: '0.7s' } }}>
            <Box sx={{ flex: 1, p: 2 }}>
              {/* Section skeleton */}
              {[1, 2, 3].map((i) => (
                <Box key={i} sx={{ mb: 2 }}>
                  <Skeleton animation="wave" variant="rounded" height={44} sx={{ mb: 1 }} />
                  <Box sx={{ pl: 1 }}>
                    {[1, 2, 3].map((j) => (
                      <Box key={j} sx={{ display: 'flex', gap: 2, mb: 1 }}>
                        <Skeleton animation="wave" variant="text" width={150} />
                        <Skeleton animation="wave" variant="rounded" height={36} sx={{ flex: 1 }} />
                      </Box>
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
            {/* TOC skeleton */}
            <Box sx={{ width: 200, borderLeft: '1px solid', borderColor: 'grey.200', p: 2 }}>
              <Skeleton animation="wave" variant="text" width={60} sx={{ mb: 1 }} />
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton animation="wave" key={i} variant="text" width={120} sx={{ mb: 0.5 }} />
              ))}
            </Box>
          </Box>
        ) : selectedCellLine ? (
          <CellLineEditor
            key={editorKey}
            data={editedMetadata}
            cellLineName={selectedCellLine.replace('.json', '')}
            filename={selectedCellLine}
            lastModified={lastModified}
            onSave={saveCellLine}
            onCreate={createNewCellLine}
            onDiscard={async () => {
              await fetchCellLineData(selectedCellLine);
              setEditorKey(k => k + 1);
              setValidationErrors([]);
            }}
            validationErrors={validationErrors}
            onClearErrors={() => setValidationErrors([])}
          />
        ) : (
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Select a cell line from the right panel, or create a new one.
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              onClick={(e) => setCreateAnchor(e.currentTarget)}
              sx={{
                borderColor: theme.palette.secondary.dark,
                color: theme.palette.secondary.dark,
                '&:hover': {
                  borderColor: theme.palette.secondary.main,
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              Create cell line
            </Button>
            <Popover
              open={Boolean(createAnchor)}
              anchorEl={createAnchor}
              onClose={() => { setCreateAnchor(null); setNewCellType(''); }}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              transformOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5, minWidth: 280 }}>
                <Typography variant="body2" fontWeight={500}>
                  Enter a name for the new cell line
                </Typography>
                <TextField
                  size="small"
                  placeholder="e.g. AIBNi001-A"
                  inputRef={newNameInputRef}
                  autoFocus
                />
                <Typography variant="body2" fontWeight={500}>
                  Cell line type
                </Typography>
                <ToggleButtonGroup
                  value={newCellType}
                  exclusive
                  onChange={(_, val) => { if (val) setNewCellType(val); }}
                  size="small"
                  fullWidth
                >
                  <ToggleButton value="human induced pluripotent stem cell (hiPSC)" sx={{ fontSize: '0.75rem' }}>
                    iPSC
                  </ToggleButton>
                  <ToggleButton value="human embryonic stem cell (hESC)" sx={{ fontSize: '0.75rem' }}>
                    ESC
                  </ToggleButton>
                </ToggleButtonGroup>
                <Button
                  variant="contained"
                  size="small"
                  disabled={!newCellType}
                  onClick={() => {
                    const value = newNameInputRef.current?.value.trim();
                    if (value && newCellType) {
                      createNewCellLine(value, newCellType);
                      setCreateAnchor(null);
                      setNewCellType('');
                    }
                  }}
                  sx={{
                    backgroundColor: theme.palette.secondary.dark,
                    '&:hover': { backgroundColor: theme.palette.secondary.main },
                  }}
                >
                  Create
                </Button>
              </Box>
            </Popover>
            </Box>
          </Box>
        )}
      </Card>

      {/* Right quarter - Cell Lines List */}
      <Card flex={1} header={`Cell Lines`}>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Search and Filter section */}
          <Box sx={{ px: 1.5, py: 1, borderBottom: `1px solid ${theme.palette.grey[200]}`, display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 18, color: theme.palette.text.secondary }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: theme.palette.background.paper,
                  fontSize: '0.875rem',
                  '& input': {
                    py: 0.75,
                  },
                },
              }}
            />
            <Button
              size="small"
              startIcon={<FilterListIcon />}
              onClick={(e) => setFilterAnchor(e.currentTarget)}
              sx={{
                textTransform: 'none',
                color: theme.palette.text.secondary,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              Filter by
            </Button>
            <Popover
              open={Boolean(filterAnchor)}
              anchorEl={filterAnchor}
              onClose={() => setFilterAnchor(null)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
              <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                  Filter by status
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filterWorking}
                      onChange={(e) => setFilterWorking(e.target.checked)}
                      size="small"
                    />
                  }
                  label="Working"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filterReady}
                      onChange={(e) => setFilterReady(e.target.checked)}
                      size="small"
                    />
                  }
                  label="Ready"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filterRegistered}
                      onChange={(e) => setFilterRegistered(e.target.checked)}
                      size="small"
                    />
                  }
                  label="Registered"
                />
              </Box>
            </Popover>
          </Box>

          <Box sx={{ flex: 1, overflow: 'auto' }}>
            {(() => {
              const filteredCellLines = cellLines.filter(cl => {
                // Filter by location
                const locationMatch = (filterWorking && cl.location === 'working') ||
                                     (filterReady && cl.location === 'ready') ||
                                     (filterRegistered && cl.location === 'registered');
                // Filter by search query
                const searchMatch = cl.name.toLowerCase().includes(searchQuery.toLowerCase());
                return locationMatch && searchMatch;
              });

              const allFilteredSelected = filteredCellLines.length > 0 &&
                filteredCellLines.every(cl => selectedForDownload.has(cl.name));

              return (
                <>
                  {filteredCellLines.length > 0 && (
                    <Box sx={{ px: 1.5, py: 0.75, borderBottom: `1px solid ${theme.palette.grey[200]}`, display: 'flex', alignItems: 'center' }}>
                      <Checkbox
                        checked={allFilteredSelected}
                        indeterminate={
                          !allFilteredSelected &&
                          filteredCellLines.some(cl => selectedForDownload.has(cl.name))
                        }
                        onChange={() => toggleSelectAll(filteredCellLines)}
                        size="small"
                        sx={{ p: 0, mr: 1 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        Select all
                      </Typography>
                    </Box>
                  )}
                  {filteredCellLines.length === 0 ? (
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        {cellLines.length === 0
                          ? 'No cell lines found. Complete curation tasks to see cell lines here.'
                          : 'No cell lines match the current filter.'}
                      </Typography>
                    </Box>
                  ) : (
                    <List sx={{ p: 0 }}>
                      {filteredCellLines.map((cellLine) => (
                        <ListItem
                          key={cellLine.name}
                          component="div"
                          onClick={() => fetchCellLineData(cellLine.name)}
                          secondaryAction={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {cellLine.location === 'working' && (
                                <IconButton
                                  size="small"
                                  onClick={(e) => { e.stopPropagation(); setPendingDeleteName(cellLine.name); setDeleteAnchorEl(e.currentTarget); }}
                                  sx={{ '&:hover': { color: 'error.main' } }}
                                >
                                  <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                                </IconButton>
                              )}
                              <IconButton
                                edge="end"
                                size="small"
                                onClick={(e) => downloadCellLine(cellLine.name, e)}
                                sx={{ '&:hover': { backgroundColor: theme.palette.action.hover } }}
                              >
                                <DownloadIcon sx={{ fontSize: 18 }} />
                              </IconButton>
                            </Box>
                          }
                          sx={{
                            cursor: 'pointer',
                            py: 0.75,
                            px: 1.5,
                            borderBottom: `1px solid ${theme.palette.grey[200]}`,
                            backgroundColor: selectedCellLine === cellLine.name ? theme.palette.action.selected : 'transparent',
                            '&:hover': {
                              backgroundColor: theme.palette.action.hover,
                            }
                          }}
                        >
                          <Checkbox
                            checked={selectedForDownload.has(cellLine.name)}
                            onClick={(e) => toggleSelection(cellLine.name, e)}
                            size="small"
                            sx={{ p: 0, mr: 1 }}
                          />
                          <ListItemText
                            primary={cellLine.name.replace('.json', '')}
                            secondary={cellLine.location === 'working' ? 'Working' : 'Ready'}
                            primaryTypographyProps={{ fontSize: '0.875rem' }}
                            secondaryTypographyProps={{ fontSize: '0.75rem' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </>
              );
            })()}
          </Box>

          {/* Delete confirmation popover */}
          <Popover
            open={Boolean(deleteAnchorEl)}
            anchorEl={deleteAnchorEl}
            onClose={() => { setDeleteAnchorEl(null); setPendingDeleteName(null); }}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1, minWidth: 200 }}>
              <Typography variant="body2" fontWeight={500}>
                Delete {pendingDeleteName?.replace('.json', '')}?
              </Typography>
              <Typography variant="caption" color="text.secondary">
                This cannot be undone.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button size="small" onClick={() => { setDeleteAnchorEl(null); setPendingDeleteName(null); }}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  color="error"
                  onClick={() => { if (pendingDeleteName) deleteCellLine(pendingDeleteName); setDeleteAnchorEl(null); setPendingDeleteName(null); }}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          </Popover>

          {/* Download Button at bottom */}
          <Button
            variant="contained"
            color="primary"
            disabled={selectedForDownload.size === 0}
            onClick={batchDownload}
            sx={{
              backgroundColor: theme.palette.action.selected,
              width: '100%',
              height: '48px',
              borderRadius: '0 0 8px 8px',
              border: `1px solid ${theme.palette.action.selected}`,
              borderTop: 'none',
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                boxShadow: 'none',
              },
              '&:disabled': {
                backgroundColor: theme.palette.grey[300],
                borderColor: theme.palette.grey[300],
              },
              color: theme.palette.text.primary,
              boxShadow: 'none',
              fontWeight: 600,
            }}
          >
            <DownloadIcon sx={{ mr: 1 }} />
            Download Selected ({selectedForDownload.size})
          </Button>
        </Box>
      </Card>

    </Box>
  );
}
