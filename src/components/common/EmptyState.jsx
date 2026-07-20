import { Box, Typography } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

const EmptyState = ({ message = 'No hay registros todavía.' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
      }}
    >
      <InboxIcon sx={{ fontSize: 48, mb: 1, color: 'text.disabled' }} />
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};

export default EmptyState;