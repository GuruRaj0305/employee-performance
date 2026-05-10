import { Box, CircularProgress } from '@mui/material';

function LoadingScreen() {
  return (
    <Box className="center-screen">
      <CircularProgress />
    </Box>
  );
}

export default LoadingScreen;
