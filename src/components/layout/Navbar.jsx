// src/components/layout/Navbar.jsx
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { isLoggedIn as checkAuth } from "../../services/authService";
import Logo from '../common/Logo';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const isLoggedIn = checkAuth();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <AppBar position="static" className="navbar-root">
      <Toolbar>
        <Box component={Link} to="/" className="navbar-logo-link">
          <Logo />
        </Box>
        <Box className="navbar-links">
          <Button
            component={Link}
            to="/artists"
            className={`navbar-link ${location.pathname === '/artists' ? 'active' : ''}`}
          >
            Artistas
          </Button>
          <Button
            component={Link}
            to="/albums"
            className={`navbar-link ${location.pathname === '/albums' ? 'active' : ''}`}
          >
            Álbumes
          </Button>
          {isLoggedIn ? (
            <Button
              variant="contained"
              className="navbar-cta"
              onClick={handleLogout}
            >
              Cerrar sesión
            </Button>
          ) : (
            <Button
              component={Link}
              to="/login"
              variant="contained"
              className="navbar-cta"
            >
              Iniciar sesión
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;