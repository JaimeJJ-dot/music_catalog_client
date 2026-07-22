// src/components/common/ErrorState.jsx
import { Box, Typography, Button } from '@mui/material';
import { ErrorOutlined as ErrorOutlineIcon } from '@mui/icons-material';
import './ErrorState.css';

const ErrorState = ({ message = 'Ocurrió un error al cargar los datos.', onRetry }) => {
  return (
    <Box className="error-state-container">
      <ErrorOutlineIcon className="error-state-icon" />
      <Typography variant="body1" className="error-state-text">
        {message}
      </Typography>
      {onRetry && (
        <Button variant="outlined" onClick={onRetry} className="btn-retry">
          Reintentar
        </Button>
      )}
    </Box>
  );
};

export default ErrorState;