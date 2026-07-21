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
    // Limpiamos absolutamente todas las llaves de la sesión en el navegador
    localStorage.removeItem('token');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    localStorage.clear(); // Por seguridad, limpia cualquier rastro residual
    // Usamos window.location.href en vez de navigate()
    // Esto obliga al navegador a limpiar toda la memoria caché de React, 
    // recalcular el isLoggedIn() a false en todos los componentes y mandarte al inicio limpio.
    window.location.href = '/';
  };

  return (
    <AppBar position="static" className="navbar-root">
      <Toolbar>
        <Box component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none' }}>
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
              color="primary"
              className="navbar-cta"
              onClick={handleLogout}
              sx={{ ml: 2 }}
            >
              Cerrar sesión
            </Button>
          ) : (
            <Button
              component={Link}
              to="/login"
              variant="contained"
              color="primary"
              className="navbar-cta"
              sx={{ ml: 2 }}
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