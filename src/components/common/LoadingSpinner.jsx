// src/components/common/LoadingSpinner.jsx
import { Box, CircularProgress, Typography } from '@mui/material';
import './LoadingSpinner.css';

const LoadingSpinner = ({ message = 'Cargando...' }) => {
  return (
    <Box className="loading-spinner-container">
      <CircularProgress className="loading-spinner-circle" />
      <Typography variant="body2" className="loading-spinner-text">
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;