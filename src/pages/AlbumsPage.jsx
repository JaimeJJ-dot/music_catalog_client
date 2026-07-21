import { useState, useEffect } from 'react';
import { Container, Grid, Typography, Box, Button } from '@mui/material';
import { AddOutlined as AddOutlineIcon, FilterAltOffOutlined as FilterOffIcon } from '@mui/icons-material';
import { getAlbums, deleteAlbum } from '../services/albumService';
import { isLoggedIn } from '../services/authService';
import AlbumCard from '../components/albums/AlbumCard';
import CreateAlbumModal from '../components/albums/CreateAlbumModal';
import EditAlbumModal from '../components/albums/EditAlbumModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import { useSearchParams } from 'react-router-dom';
import './AlbumsPage.css';

const AlbumsPage = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const canEdit = isLoggedIn();
  const [searchParams, setSearchParams] = useSearchParams();
  const artistIdFilter = searchParams.get('artistId');

  // Uso de (prev) para evitar cierres obsoletos (stale closures)
  const handleAlbumCreated = (newAlbum) => {
    setAlbums((prev) => [newAlbum, ...prev]);
  };

  // Funciones de manejo de edición:
  const handleEditClick = (album) => {
    setEditingAlbum(album);
    setOpenEditModal(true);
  };

  const handleAlbumUpdated = (updatedAlbum) => {
    setAlbums((prev) => prev.map((alb) => (alb.id === updatedAlbum.id ? updatedAlbum : alb)));
  };

  // Consulta aislada dentro del hook con patrón de limpieza (Effect Cleanup Pattern)
  useEffect(() => {
    let isMounted = true;

    const fetchAlbums = async () => {
      try {
        const response = await getAlbums();
        if (isMounted) {
          setAlbums(response.data);
          setError(null);
        }
      } catch (err) {
        console.error("Error al obtener álbumes:", err);
        if (isMounted) {
          setError("No pudimos cargar el catálogo de álbumes. Revisa tu conexión o token OAuth.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAlbums();

    return () => {
      isMounted = false;
    };
  }, []);

  // Estandarizado a async/await
  const handleRetry = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAlbums();
      setAlbums(response.data);
    } catch (err) {
      console.error(err);
      setError("Error de red persistente. Intenta más tarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este álbum del catálogo?")) {
      try {
        await deleteAlbum(id);
        // 1. Uso de (prev) al filtrar álbumes eliminados
        setAlbums((prev) => prev.filter((a) => a.id !== id));
      } catch (err) {
        console.error("Error al eliminar álbum:", err);
        alert("Ocurrió un error al intentar eliminar el disco.");
      }
    }
  };

  if (loading) {
    return <LoadingSpinner message="Consultando discografía en el servidor..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={handleRetry} />;
  }

  const displayedAlbums = artistIdFilter 
    ? albums.filter(album => String(album.artist) === String(artistIdFilter))
    : albums;

  return (
    <Container maxWidth="lg" className="albums-page-container">
      <Box className="albums-page-header">
        <Typography variant="h4" component="h1" fontWeight="bold" sx={{ color: '#ffffff' }}>
          Discografía y Álbumes
        </Typography>
        {canEdit && (
          <Button 
            variant="contained" 
            startIcon={<AddOutlineIcon />} 
            onClick={() => setOpenModal(true)}
            sx={{ 
              backgroundColor: '#1db954', 
              color: '#000000', 
              fontWeight: 'bold',
              borderRadius: '20px',
              textTransform: 'none',
              '&:hover': { backgroundColor: '#1ed760' }
            }}
          >
            Nuevo Álbum
          </Button>
        )}
      </Box>

      {artistIdFilter && (
        <Box sx={{ 
          mb: 3, 
          p: 2, 
          backgroundColor: '#181818', 
          border: '1px solid #282828', 
          borderRadius: '10px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Typography variant="body1" sx={{ color: '#1db954', fontWeight: '500' }}>
            ⚡ Mostrando únicamente la discografía del artista seleccionado
          </Typography>
          <Button 
            variant="outlined" 
            size="small" 
            startIcon={<FilterOffIcon />}
            onClick={() => setSearchParams({})}
            sx={{ 
              color: '#ffffff', 
              borderColor: '#535353', 
              borderRadius: '20px',
              textTransform: 'none',
              '&:hover': { borderColor: '#ffffff', backgroundColor: 'rgba(255,255,255,0.05)' }
            }}
          >
            Ver todos los álbumes
          </Button>
        </Box>
      )}

      {displayedAlbums.length === 0 ? (
        <EmptyState message={
          artistIdFilter 
            ? "Este artista aún no tiene álbumes registrados en el catálogo." 
            : "No hay álbumes registrados en el sistema. ¡Añade el primer disco con el botón superior!"
        } />
      ) : (
        <Grid container spacing={3}>
          {displayedAlbums.map((album) => (
            <Grid item xs={12} sm={6} md={4} key={album.id}>
              <AlbumCard album={album} onDelete={handleDelete} onEdit={handleEditClick} canEdit={canEdit} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Componente Modal de creación */}
      {canEdit && (
        <CreateAlbumModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          onSuccess={handleAlbumCreated}
        />
      )}

      {/* Componente Modal de edición */}
      {canEdit && (
        <EditAlbumModal
          open={openEditModal}
          onClose={() => {
            setOpenEditModal(false);
            setEditingAlbum(null);
          }}
          onSuccess={handleAlbumUpdated}
          album={editingAlbum}
        />
      )}
    </Container>
  );
};

export default AlbumsPage;