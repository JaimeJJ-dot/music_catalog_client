// src/components/layout/Navbar.jsx
import { useState } from 'react';
import { AppBar, Toolbar, Button, Box, InputBase, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../common/Logo';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem('access_token'));
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <AppBar position="static" className="navbar-root">
      <Toolbar className="navbar-toolbar">
        <Box component={Link} to="/" sx={{ textDecoration: 'none' }} className="navbar-brand">
          <Logo />
        </Box>

        <Box className="navbar-search-wrapper">
          <IconButton
            component={Link}
            to="/"
            className={`navbar-home-btn ${location.pathname === '/' ? 'active' : ''}`}
          >
            <HomeIcon />
          </IconButton>

          <Box
            component="form"
            onSubmit={handleSearchSubmit}
            className="navbar-search"
          >
            <SearchIcon className="navbar-search-icon" />
            <InputBase
              placeholder="¿Qué artista o álbum buscas?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="navbar-search-input"
              fullWidth
            />
          </Box>
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