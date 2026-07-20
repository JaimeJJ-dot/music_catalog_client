// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1DB954',
      contrastText: '#000000',
    },
    secondary: {
      main: '#535353',
    },
    background: {
      default: '#121212',
      paper: '#181818',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B3B3B3',
    },
    error: {
      main: '#F15E6C',
    },
    divider: 'rgba(255,255,255,0.1)',
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'sans-serif',
    ].join(','),
    h4: {
      fontWeight: 900,
      letterSpacing: '-1px',
    },
    h5: {
      fontWeight: 800,
      letterSpacing: '-0.5px',
    },
    h6: {
      fontWeight: 700,
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
      letterSpacing: '-0.2px',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '500px',
          paddingLeft: '24px',
          paddingRight: '24px',
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#1ED760',
            transform: 'scale(1.03)',
          },
          transition: 'transform 0.15s ease',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#181818',
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: '#535353 #121212',
          '&::-webkit-scrollbar': {
            width: '12px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#121212',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#535353',
            borderRadius: '20px',
            border: '3px solid #121212',
          },
        },
      },
    },
  },
});

export default theme;