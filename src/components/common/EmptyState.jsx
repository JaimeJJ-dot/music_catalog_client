// src/components/common/EmptyState.jsx
import { Box, Typography } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import './EmptyState.css';

const EmptyState = ({ message = 'No hay registros todavía.' }) => {
  return (
    <Box className="empty-state-container">
      <InboxIcon className="empty-state-icon" />
      <Typography variant="body1" className="empty-state-text">
        {message}
      </Typography>
    </Box>
  );
};

export default EmptyState;