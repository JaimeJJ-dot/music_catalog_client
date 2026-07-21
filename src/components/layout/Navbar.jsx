// src/components/layout/Navbar.jsx
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../common/Logo';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem('access_token'));

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    navigate('/');
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