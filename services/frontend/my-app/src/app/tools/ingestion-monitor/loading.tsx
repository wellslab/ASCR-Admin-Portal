import { Box, Skeleton } from '@mui/material';

export default function IngestionMonitorLoading() {
  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 4rem)', overflow: 'hidden', gap: 2, p: 2 }}>
      <Box sx={{ width: 280, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} variant="rectangular" width="100%" height={40} sx={{ borderRadius: 1 }} />
        ))}
      </Box>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
        <Skeleton variant="text" width={200} height={32} />
        {[1, 2, 3, 4].map(i => (
          <Box key={i}>
            <Skeleton variant="text" width="30%" height={20} sx={{ mb: 0.5 }} />
            <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 1 }} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
