import { Box, Skeleton } from '@mui/material';

export default function ImportLoading() {
  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 800 }}>
      <Skeleton variant="text" width={200} height={40} />
      <Skeleton variant="rectangular" width="100%" height={180} sx={{ borderRadius: 2 }} />
      <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 2 }} />
    </Box>
  );
}
