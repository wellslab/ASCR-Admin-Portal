import { Box, Skeleton } from '@mui/material';

export default function EditorLoading() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 4rem)', overflow: 'hidden' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', gap: 1 }}>
        <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: 1 }} />
        <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: 1 }} />
      </Box>
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Box sx={{ width: 280, borderRight: '1px solid', borderColor: 'divider', p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} variant="rectangular" width="100%" height={40} sx={{ borderRadius: 1 }} />
          ))}
        </Box>
        <Box sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Skeleton variant="text" width={200} height={32} />
          {[1, 2, 3, 4].map((i) => (
            <Box key={i}>
              <Skeleton variant="text" width="30%" height={20} sx={{ mb: 0.5 }} />
              <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 1 }} />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
