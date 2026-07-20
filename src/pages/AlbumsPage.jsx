import { useState, useEffect } from 'react';
import { Container, Grid, Typography, Box, Button } from '@mui/material';
import { AddOutlined as AddOutlineIcon } from '@mui/icons-material';
import { getAlbums, deleteAlbum } from '../services/albumService';
import AlbumCard from '../components/albums/AlbumCard';
import CreateAlbumModal from '../components/albums/CreateAlbumModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import './AlbumsPage.css';

const AlbumsPage = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const fetchAlbums = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAlbums();
      setAlbums(response.data);
    } catch (err) {
      console.error("Error al obtener álbumes:", err);
      setError("No pudimos cargar el catálogo de álbumes. Revisa tu conexión o token OAuth.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAlbums();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este álbum del catálogo?")) {
      try {
        await deleteAlbum(id);
        setAlbums(albums.filter((a) => a.id !== id));
      } catch (err) {
        console.error("Error al eliminar álbum:", err);
        alert("Ocurrió un error al intentar eliminar el disco.");
      }
    }
  };

  const handleAlbumCreated = (newAlbum) => {
    setAlbums([newAlbum, ...albums]);
  };

  if (loading) {
    return <LoadingSpinner message="Consultando discografía en el servidor..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchAlbums} />;
  }

  return (
    <Container maxWidth="lg" className="albums-page-container">
      <Box className="albums-page-header">
        <Typography variant="h4" component="h1" fontWeight="bold">
          Discografía y Álbumes
        </Typography>
        <Button variant="contained" color="primary" startIcon={<AddOutlineIcon />} onClick={() => setOpenModal(true)}>
          Nuevo Álbum
        </Button>
      </Box>

      {albums.length === 0 ? (
        <EmptyState message="No hay álbumes registrados en el sistema. ¡Añade el primer disco con el botón superior!" />
      ) : (
        <Grid container spacing={3}>
          {albums.map((album) => (
            <Grid item xs={12} sm={6} md={4} key={album.id}>
              <AlbumCard album={album} onDelete={handleDelete} />
            </Grid>
          ))}
        </Grid>
      )}

      <CreateAlbumModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={handleAlbumCreated}
      />
    </Container>
  );
};

export default AlbumsPage;