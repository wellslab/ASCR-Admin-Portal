'use client';

import { Typography, Box, List, ListItem, ListItemText, IconButton, LinearProgress, Collapse, Tooltip, Button } from '@mui/material';
import BlurOnOutlinedIcon from '@mui/icons-material/BlurOnOutlined';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useTheme } from '@mui/material/styles';
import { useState, useEffect, useRef } from 'react';
import Card from '@/app/components/Card';
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
  const [expanded, setExpanded] = useState(task.status === 'processing' || task.status === 'queued');
  const [retrying, setRetrying] = useState(false);

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
        {(task.status === 'processing' || task.status === 'queued' || (task.stages && task.stages.length > 0)) && (
          <IconButton size="small" onClick={() => setExpanded(!expanded)} sx={{ p: 0.5 }}>
            {expanded ? <ExpandLessIcon sx={{ fontSize: 18 }} /> : <ExpandMoreIcon sx={{ fontSize: 18 }} />}
          </IconButton>
        )}
        {task.status === 'failed' && (
          <Tooltip title="Retry task">
            <IconButton size="small" onClick={handleRetry} disabled={retrying} sx={{ p: 0.5 }}>
              <RefreshIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="Clear task">
          <IconButton size="small" onClick={() => onClear(task.task_id)} sx={{ p: 0.5 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </IconButton>
        </Tooltip>
        {getMainIcon()}
      </Box>

      {task.status === 'processing' && (
        <LinearProgress
          sx={{
            width: '100%',
            height: 6,
            borderRadius: 3,
            '& .MuiLinearProgress-bar': { borderRadius: 3 },
          }}
        />
      )}

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

export default function CurationPage() {
  const theme = useTheme();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTasks, setActiveTasks] = useState<Array<{
    task_id: string;
    filename: string;
    status: 'queued' | 'processing' | 'completed' | 'failed';
    stages?: any[];
    created_at?: string;
    updated_at?: string;
    result?: any;
  }>>([]);
  const wsRef = useRef<WebSocket | null>(null);

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

  const retryTask = async (taskId: string) => {
    try {
      const response = await fetch(getApiUrl(`/tasks/${taskId}/retry`), { method: 'POST' });
      if (response.ok) {
        const result = await response.json();
        const newTask = {
          task_id: result.new_task_id,
          filename: result.filename,
          status: 'queued' as const,
          stages: [],
        };
        setActiveTasks(prev => [newTask, ...prev]);
      } else {
        const error = await response.json();
        alert(error.detail || 'Failed to retry task');
      }
    } catch (error) {
      alert('Failed to retry task. Please try again.');
    }
  };

  const clearTask = async (taskId: string) => {
    try {
      const response = await fetch(getApiUrl(`/tasks/${taskId}`), { method: 'DELETE' });
      if (response.ok) {
        setActiveTasks(prev => prev.filter(task => task.task_id !== taskId));
      } else {
        const error = await response.json();
        alert(error.detail || 'Failed to delete task');
      }
    } catch (error) {
      alert('Failed to delete task. Please try again.');
    }
  };

  // Helper function to update task stages
  const updateTaskStages = (currentStages: any[], stage: string, status: string, message: string, data: any) => {
    const existingStageIndex = currentStages.findIndex(s => s.stage === stage);
    if (existingStageIndex >= 0) {
      const updatedStages = [...currentStages];
      updatedStages[existingStageIndex] = { stage, status, message, data: data || {}, timestamp: new Date().toISOString() };
      return updatedStages;
    }
    return [...currentStages, { stage, status, message, data: data || {}, timestamp: new Date().toISOString() }];
  };

  useEffect(() => {
    fetchTaskHistory();
  }, []);

  // WebSocket connection for real-time task updates
  useEffect(() => {
    let reconnectTimeout: NodeJS.Timeout;

    const connectWebSocket = () => {
      try {
        wsRef.current = new WebSocket('ws://localhost:8001/ws/task-updates');

        wsRef.current.onmessage = (event) => {
          const message = JSON.parse(event.data);

          if (message.type === 'task_progress') {
            setActiveTasks(prev =>
              prev.map(task =>
                task.task_id === message.task_id
                  ? {
                      ...task,
                      stages: updateTaskStages(task.stages || [], message.stage, message.status, message.message, message.data),
                      updated_at: message.timestamp,
                    }
                  : task
              )
            );
          } else if (message.type === 'task_completed') {
            setActiveTasks(prev =>
              prev.map(task =>
                task.task_id === message.task_id
                  ? {
                      ...task,
                      status: message.result?.status === 'error' ? 'failed' : 'completed',
                      result: message.result,
                      updated_at: message.timestamp,
                    }
                  : task
              )
            );
          }
        };

        wsRef.current.onerror = () => {};

        wsRef.current.onclose = () => {
          reconnectTimeout = setTimeout(connectWebSocket, 5000);
        };
      } catch (error) {
        // WebSocket is optional — page functions normally without it
      }
    };

    connectWebSocket();

    return () => {
      clearTimeout(reconnectTimeout);
      wsRef.current?.close();
    };
  }, []);

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return '/icons/pdf.png';
      case 'docx': return '/icons/docx-file.png';
      case 'txt': return '/icons/txt.png';
      case 'json':
      case 'jsonc': return '/icons/json.png';
      default: return '/icons/txt.png';
    }
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setUploadedFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadedFiles(prev => [...prev, ...Array.from(e.target.files || [])]);
  };
  const removeFile = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(file => file.name !== fileName));
  };

  const handleStartCuration = async () => {
    try {
      const filesWithBase64 = await Promise.all(
        uploadedFiles.map(async (file) => ({
          filename: file.name,
          file_data: await fileToBase64(file),
        }))
      );

      const response = await fetch(getApiUrl('/start-ai-curation'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files: filesWithBase64 }),
      });

      if (response.ok) {
        const result = await response.json();
        const newTasks = result.tasks.map((task: any) => ({
          task_id: task.task_id,
          filename: task.filename,
          status: 'queued' as const,
          stages: [],
          created_at: new Date().toISOString(),
        }));
        setActiveTasks(prev => [...newTasks, ...prev]);
        setUploadedFiles([]);
      } else {
        const error = await response.json();
        alert(error.detail || 'Failed to start curation. Please try again.');
      }
    } catch (error) {
      alert('Error starting curation. Please try again.');
    }
  };

  return (
    <Box sx={{ p: 3, height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        <ManageSearchIcon sx={{ fontSize: 28, color: 'primary.main', mr: 2 }} />
        <Typography variant="h5" component="h1">AI Curation</Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, flex: 1, minHeight: 0 }}>

        {/* Upload panel */}
        <Card width="380px" header="Upload Sources" headerBgColor={theme.palette.background.paper} headerTextColor={theme.palette.text.primary}>
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
              <Typography variant="body2" fontWeight={500} color="text.primary">Drop files here or click to browse</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>PDF, DOCX, TXT, JSON files supported</Typography>
              <input type="file" hidden multiple accept=".pdf,.doc,.docx,.txt,.json,.jsonc" onChange={handleFileSelect} />
            </Box>

            {/* Queued file list */}
            {uploadedFiles.length > 0 && (
              <Box sx={{ px: 2, pb: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''} queued
                </Typography>
                {uploadedFiles.map((file, index) => (
                  <Box
                    key={`${file.name}-${index}`}
                    sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 0.75, backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.grey[200]}`, borderRadius: 1 }}
                  >
                    <Box sx={{ width: 16, height: 16, flexShrink: 0 }}>
                      <img src={getFileIcon(file.name)} alt="" style={{ width: '100%', height: '100%' }} />
                    </Box>
                    <Typography variant="body2" sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.8rem' }}>
                      {file.name}
                    </Typography>
                    <Tooltip title="Remove">
                      <IconButton size="small" onClick={() => removeFile(file.name)} sx={{ p: 0.25 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                      </IconButton>
                    </Tooltip>
                  </Box>
                ))}
              </Box>
            )}

            {/* Start curation button */}
            <Button
              variant="contained"
              disabled={uploadedFiles.length === 0}
              onClick={handleStartCuration}
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
              <ManageSearchIcon sx={{ mr: 1 }} />
              Start AI Curation
            </Button>
          </Box>
        </Card>

        {/* Task history panel */}
        <Card
          flex={1}
          header="Results"
          headerBgColor={theme.palette.background.paper}
          headerTextColor={theme.palette.text.primary}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ px: 2, pt: 1.5, pb: 1, borderBottom: `1px solid ${theme.palette.grey[200]}` }}>
              <Typography variant="body2" color="text.secondary">
                Each uploaded article is processed as a separate task. Expand a task to see its pipeline stages.
              </Typography>
            </Box>
            {activeTasks.length === 0 ? (
              <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No tasks yet. Upload files and start AI curation to see progress here.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ flex: 1, overflow: 'auto' }}>
                <List sx={{ p: 0 }}>
                  {activeTasks
                    .sort((a, b) => {
                      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
                      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
                      return dateB - dateA;
                    })
                    .map((task) => (
                      <TaskProgressBar key={task.task_id} task={task} onRetry={retryTask} onClear={clearTask} />
                    ))}
                </List>
              </Box>
            )}
          </Box>
        </Card>

      </Box>
    </Box>
  );
}
