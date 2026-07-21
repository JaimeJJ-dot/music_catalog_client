import { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Grid } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { getArtists, deleteArtist } from '../services/artistService';
import { getAlbums, deleteAlbum } from '../services/albumService';
import { isLoggedIn } from '../utils/auth';
import ArtistCard from '../components/artists/ArtistCard';
import AlbumCard from '../components/albums/AlbumCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import EditArtistModal from '../components/artists/EditArtistModal';
import EditAlbumModal from '../components/albums/EditAlbumModal';
import './Home.css';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
};

// Función auxiliar para formatear la URL de las miniaturas de acceso rápido
const getValidImageUrl = (path) => {
  const fallback = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&auto=format&fit=crop";
  if (!path) return fallback;
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:image')) {
    return path;
  }
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
  let cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (!cleanPath.startsWith('/media/') && !cleanPath.startsWith('/static/')) {
    cleanPath = `/media${cleanPath}`;
  }
  return `${baseUrl}${cleanPath}`;
};

const Home = () => {
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('todo');
  const navigate = useNavigate();
  const canEdit = isLoggedIn();
  const username = localStorage.getItem('username');
  
  // Estados para modales de edición
  const [editingArtist, setEditingArtist] = useState(null);
  const [openEditArtist, setOpenEditArtist] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [openEditAlbum, setOpenEditAlbum] = useState(false);

  // Aislamos la consulta dentro del efecto sin disparar estados síncronos innecesarios al montar
  useEffect(() => {
    let isMounted = true;

    const fetchInitialData = async () => {
      try {
        const [artistsRes, albumsRes] = await Promise.all([
          getArtists(),
          getAlbums(),
        ]);
        if (isMounted) {
          setArtists(artistsRes.data);
          setAlbums(albumsRes.data);
          setError(null);
        }
      } catch (err) {
        console.error("Error al cargar la página de inicio:", err);
        if (isMounted) {
          setError("No pudimos cargar el inicio. Verifica tu conexión o sesión de OAuth.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchInitialData();

    return () => {
      isMounted = false; // Patrón de limpieza para evitar fugas de memoria si cambias de página rápido
    };
  }, []);

  // Función independiente exclusiva para cuando el usuario presiona "Reintentar" en la pantalla de error
  const handleRetry = async () => {
    setLoading(true);
    setError(null);
    try {
      const [artistsRes, albumsRes] = await Promise.all([
        getArtists(),
        getAlbums(),
      ]);
      setArtists(artistsRes.data);
      setAlbums(albumsRes.data);
    } catch (err) {
      console.error("Error al reintentar carga:", err);
      setError("No pudimos cargar el inicio. Verifica tu conexión o sesión de OAuth.");
    } finally {
      setLoading(false);
    }
  };

  // Funciones de manejo de edición y eliminación para Artistas
  const handleEditArtistClick = (artist) => {
    setEditingArtist(artist);
    setOpenEditArtist(true);
  };

  const handleDeleteArtistClick = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este artista?")) {
      try {
        await deleteArtist(id);
        setArtists((prev) => prev.filter((a) => a.id !== id));
      } catch (err) {
        console.error("Error eliminando artista:", err);
        alert("Ocurrió un error al intentar eliminar el artista.");
      }
    }
  };

  const handleArtistUpdated = (updatedArtist) => {
    setArtists((prev) => prev.map((art) => (art.id === updatedArtist.id ? updatedArtist : art)));
  };

  // Funciones de manejo de edición y eliminación para Álbumes
  const handleEditAlbumClick = (album) => {
    setEditingAlbum(album);
    setOpenEditAlbum(true);
  };

  const handleDeleteAlbumClick = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este álbum?")) {
      try {
        await deleteAlbum(id);
        setAlbums((prev) => prev.filter((a) => a.id !== id));
      } catch (err) {
        console.error("Error eliminando álbum:", err);
        alert("Ocurrió un error al intentar eliminar el álbum.");
      }
    }
  };

  const handleAlbumUpdated = (updatedAlbum) => {
    setAlbums((prev) => prev.map((alb) => (alb.id === updatedAlbum.id ? updatedAlbum : alb)));
  };

  if (loading) {
    return <LoadingSpinner message="Preparando tu inicio..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={handleRetry} />;
  }

  // Mezcla de artistas + álbumes para el "acceso rápido", máximo 6 tarjetas
  const quickAccessItems = [
    ...artists.slice(0, 3).map((a) => ({ type: 'artist', id: `artist-${a.id}`, name: a.name, image: a.photo, to: '/artists' })),
    ...albums.slice(0, 3).map((a) => ({ type: 'album', id: `album-${a.id}`, name: a.title, image: a.cover, to: '/albums' })),
  ];

  const isEmpty = artists.length === 0 && albums.length === 0;
  const showArtists = filter === 'todo' || filter === 'artistas';
  const showAlbums = filter === 'todo' || filter === 'albumes';
  const displayName = canEdit && username ? username.charAt(0).toUpperCase() + username.slice(1) : '';

  return (
    <Box className="home-page">
      {/* Hero / saludo estilo Spotify */}
      <Box className="home-hero">
        <Container maxWidth="lg">
          <Box className="home-greeting-row">
            <Box className="home-avatar">
              {canEdit && username ? username[0].toUpperCase() : '?'}
            </Box>
            <Box>
              <Typography variant="h4" className="home-greeting">
                {getGreeting()}{displayName ? ` - ${displayName}` : ''}
              </Typography>
              <Typography variant="body2" className="home-subgreeting">
                {isEmpty
                  ? 'Tu catálogo está vacío por ahora'
                  : `${artists.length} artista${artists.length !== 1 ? 's' : ''} · ${albums.length} álbum${albums.length !== 1 ? 'es' : ''} en tu catálogo`}
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" className="home-content">
        {/* Chips de filtro */}
        <Box className="filter-pills">
          <Button
            className={`filter-pill ${filter === 'todo' ? 'active' : ''}`}
            onClick={() => setFilter('todo')}
          >
            Todo
          </Button>
          <Button
            className={`filter-pill ${filter === 'artistas' ? 'active' : ''}`}
            onClick={() => setFilter('artistas')}
          >
            Artistas
          </Button>
          <Button
            className={`filter-pill ${filter === 'albumes' ? 'active' : ''}`}
            onClick={() => setFilter('albumes')}
          >
            Álbumes
          </Button>
        </Box>

        {/* Acceso rápido: grilla mixta de artistas + álbumes */}
        {filter === 'todo' && !isEmpty && quickAccessItems.length > 0 && (
          <Box className="home-section">
            <Grid container spacing={1.5}>
              {quickAccessItems.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <Link to={item.to} className="quick-access-card">
                    <Box
                      className="quick-access-image"
                      sx={{
                        backgroundImage: `url(${getValidImageUrl(item.image)})`,
                      }}
                    />
                    <Typography className="quick-access-name">{item.name}</Typography>
                  </Link>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Sección: Artistas destacados */}
        {showArtists && (
          <Box className="home-section">
            <Box className="home-section-header">
              <Typography variant="h5" className="home-section-title">
                Artistas destacados
              </Typography>
              {artists.length > 0 && (
                <Button component={Link} to="/artists" className="home-see-all">
                  Ver todos
                </Button>
              )}
            </Box>

            {artists.length === 0 ? (
              <EmptyState
                message="Aún no hay artistas registrados."
                actionLabel={canEdit ? 'Agregar artista' : undefined}
                onAction={canEdit ? () => navigate('/artists') : undefined}
              />
            ) : (
              <Box className="home-scroll-row">
                {artists.slice(0, 6).map((artist) => (
                  <Box className="home-scroll-item" key={artist.id}>
                    <ArtistCard 
                      artist={artist} 
                      canEdit={canEdit}
                      onEdit={handleEditArtistClick}
                      onDelete={handleDeleteArtistClick}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        )}

        {/* Sección: Álbumes recientes */}
        {showAlbums && (
          <Box className="home-section">
            <Box className="home-section-header">
              <Typography variant="h5" className="home-section-title">
                Álbumes recientes
              </Typography>
              {albums.length > 0 && (
                <Button component={Link} to="/albums" className="home-see-all">
                  Ver todos
                </Button>
              )}
            </Box>

            {albums.length === 0 ? (
              <EmptyState
                message="Aún no hay álbumes registrados."
                actionLabel={canEdit ? 'Agregar álbum' : undefined}
                onAction={canEdit ? () => navigate('/albums') : undefined}
              />
            ) : (
              <Box className="home-scroll-row">
                {albums.slice(0, 6).map((album) => (
                  <Box className="home-scroll-item" key={album.id}>
                    <AlbumCard 
                      album={album} 
                      canEdit={canEdit}
                      onEdit={handleEditAlbumClick}
                      onDelete={handleDeleteAlbumClick}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        )}

        {/* Modales de edición */}
        {canEdit && (
          <>
            <EditArtistModal
              open={openEditArtist}
              onClose={() => {
                setOpenEditArtist(false);
                setEditingArtist(null);
              }}
              artist={editingArtist}
              onSuccess={handleArtistUpdated}
            />
            <EditAlbumModal
              open={openEditAlbum}
              onClose={() => {
                setOpenEditAlbum(false);
                setEditingAlbum(null);
              }}
              album={editingAlbum}
              onSuccess={handleAlbumUpdated}
            />
          </>
        )}
      </Container>
    </Box>
  );
};

export default Home;