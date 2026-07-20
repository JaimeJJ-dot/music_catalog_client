import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = ({ message = 'Cargando...' }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      py={6}
    >
      <CircularProgress />
      <Typography variant="body2" sx={{ mt: 2 }} color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;