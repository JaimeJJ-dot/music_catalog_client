// src/components/common/ErrorState.jsx
import { Box, Typography, Button } from '@mui/material';
import { ErrorOutlined as ErrorOutlineIcon } from '@mui/icons-material';

const ErrorState = ({ message = 'Ocurrió un error al cargar los datos.', onRetry }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      py={6}
    >
      <ErrorOutlineIcon color="error" sx={{ fontSize: 48, mb: 1 }} />
      <Typography variant="body1" color="error" sx={{ mb: 2 }}>
        {message}
      </Typography>
      {onRetry && (
        <Button variant="outlined" color="error" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </Box>
  );
};

export default ErrorState;