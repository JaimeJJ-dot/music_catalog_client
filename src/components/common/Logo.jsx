// src/components/common/Logo.jsx
import { Box, Typography } from '@mui/material';

const VynloIcon = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="19" fill="#181818" stroke="#4A4A4A" strokeWidth="1.2" />
    <circle cx="20" cy="20" r="15.5" fill="none" stroke="#3A3A3A" strokeWidth="0.6" />
    <circle cx="20" cy="20" r="12" fill="none" stroke="#3A3A3A" strokeWidth="0.6" />
    <circle cx="20" cy="20" r="8.5" fill="none" stroke="#3A3A3A" strokeWidth="0.6" />
    <circle cx="20" cy="20" r="6.5" fill="#1DB954" />
    <circle cx="20" cy="20" r="1.4" fill="#000000" />
  </svg>
);

const Logo = ({ size = 32, showText = true, textVariant = 'h6' }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <VynloIcon size={size} />
      {showText && (
        <Typography
          variant={textVariant}
          component="span"
          sx={{
            fontWeight: 900,
            letterSpacing: '-0.5px',
            color: '#FFFFFF',
          }}
        >
          Vynlo
        </Typography>
      )}
    </Box>
  );
};

export default Logo;