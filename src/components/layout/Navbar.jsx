// src/components/layout/Navbar.jsx
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <AppBar position="static" className="navbar-root">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          🎵 SoundCatalog API
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/">Artistas</Button>
          <Button color="inherit" component={Link} to="/albums">Álbumes</Button>
          <Button color="inherit" component={Link} to="/login" variant="outlined" sx={{ ml: 2, borderColor: 'white' }}>
            Token OAuth
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
