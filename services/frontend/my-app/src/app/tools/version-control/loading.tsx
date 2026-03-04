import { Box, Skeleton } from '@mui/material';

export default function VersionControlLoading() {
  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Skeleton variant="text" width={240} height={40} />
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Skeleton variant="rectangular" width="50%" height={56} sx={{ borderRadius: 1 }} />
        <Skeleton variant="rectangular" width="50%" height={56} sx={{ borderRadius: 1 }} />
      </Box>
      <Skeleton variant="rectangular" width="100%" height={400} sx={{ borderRadius: 1 }} />
    </Box>
  );
}
