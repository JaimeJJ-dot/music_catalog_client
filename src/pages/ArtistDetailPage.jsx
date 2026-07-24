// src/pages/ArtistDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Typography, Box, Grid, Button } from '@mui/material';
import { ArrowBackOutlined as BackIcon, AddOutlined as AddIcon } from '@mui/icons-material';
import { getArtistById } from '../services/artistService';
import { getAlbums, deleteAlbum } from '../services/albumService';
import { isLoggedIn } from '../services/authService';
import AlbumCard from '../components/albums/AlbumCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import './ArtistDetailPage.css';

const fallbackPhoto = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80";

const getValidImageSource = (photo) => {
  if (!photo) return fallbackPhoto;
  if (photo.startsWith('http://') || photo.startsWith('https://') || photo.startsWith('data:image')) {
    return photo;
  }
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
  let cleanPath = photo.startsWith('/') ? photo : `/${photo}`;
  if (!cleanPath.startsWith('/media/') && !cleanPath.startsWith('/static/')) {
    cleanPath = `/media${cleanPath}`;
  }
  return `${baseUrl}${cleanPath}`;
};

const ArtistDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const canEdit = isLoggedIn();

  const [artist, setArtist] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [artistRes, albumsRes] = await Promise.all([
        getArtistById(id),
        getAlbums(),
      ]);
      setArtist(artistRes.data);
      // Filtramos solo los álbumes que pertenecen a este artista
      const filtered = albumsRes.data.filter(
        (album) => album.artist === Number(id) || album.artist_id === Number(id)
      );
      setAlbums(filtered);
    } catch (err) {
      console.error("Error al cargar el artista:", err);
      setError("No pudimos cargar la información de este artista.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [id]);

  const handleDeleteAlbum = async (albumId) => {
    if (window.confirm("¿Estás seguro de eliminar este álbum?")) {
      try {
        await deleteAlbum(albumId);
        setAlbums((prev) => prev.filter((a) => a.id !== albumId));
      } catch (err) {
        console.error("Error eliminando álbum:", err);
        alert("Ocurrió un error al intentar eliminar el álbum.");
      }
    }
  };

  if (loading) {
    return <LoadingSpinner message="Cargando artista..." />;
  }

  if (error || !artist) {
    return <ErrorState message={error || "Artista no encontrado."} onRetry={fetchData} />;
  }

  const bannerSource = getValidImageSource(artist.banner_image || artist.photo);
  const profileSource = getValidImageSource(artist.photo);

  return (
    <Box className="artist-detail-page">
      {/* Hero con foto de fondo difuminada */}
      <Box
        className="artist-detail-hero"
        style={{ backgroundImage: `url(${bannerSource})` }}
      >
        <Box className="artist-detail-hero-overlay">
          <Container maxWidth="lg">
            <Button
            startIcon={<BackIcon />}
            onClick={() => navigate('/')}
            className="artist-detail-back-btn"
            >
            Volver al inicio
            </Button>

            <Box className="artist-detail-info">
              <img
                src={profileSource}
                alt={artist.name}
                className="artist-detail-photo"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = fallbackPhoto;
                }}
              />
              <Box>
                <Typography variant="overline" className="artist-detail-label">
                  Artista
                </Typography>
                <Typography variant="h3" className="artist-detail-name">
                  {artist.name}
                </Typography>
                <Typography variant="body1" className="artist-detail-genre">
                  {artist.genre || 'Género no especificado'} · {albums.length} álbum{albums.length !== 1 ? 'es' : ''}
                </Typography>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>

      <Container maxWidth="lg" className="artist-detail-content">
        {artist.bio && (
        <Box className="artist-detail-bio-section">
            <Typography variant="h6" className="artist-detail-bio-title">
            Sobre el artista
            </Typography>
            <Typography variant="body1" className="artist-detail-bio">
            {artist.bio}
            </Typography>
        </Box>
        )}

        <Box className="artist-detail-albums-header">
          <Typography variant="h5" className="artist-detail-section-title">
            Discografía
          </Typography>
          {canEdit && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              component={Link}
              to="/albums"
            >
              Agregar álbum
            </Button>
          )}
        </Box>

        {albums.length === 0 ? (
          <EmptyState message={`${artist.name} aún no tiene álbumes registrados.`} />
        ) : (
          <Grid container spacing={3}>
            {albums.map((album) => (
              <Grid item xs={12} sm={6} md={4} key={album.id}>
                <AlbumCard album={album} canEdit={canEdit} onDelete={handleDeleteAlbum} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default ArtistDetailPage;