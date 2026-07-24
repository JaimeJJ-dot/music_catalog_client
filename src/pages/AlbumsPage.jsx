import { useState, useEffect } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
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

  const handleAlbumCreated = (newAlbum) => {
    setAlbums((prev) => [newAlbum, ...prev]);
  };

  const handleEditClick = (album) => {
    setEditingAlbum(album);
    setOpenEditModal(true);
  };

  const handleAlbumUpdated = (updatedAlbum) => {
    setAlbums((prev) => prev.map((alb) => (alb.id === updatedAlbum.id ? updatedAlbum : alb)));
  };

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
        <Typography variant="h4" component="h1" fontWeight="bold" className="albums-page-title">
          Discografía y Álbumes
        </Typography>
        {canEdit && (
          <Button 
            variant="contained" 
            startIcon={<AddOutlineIcon />} 
            onClick={() => setOpenModal(true)}
            className="btn-new-album"
          >
            Nuevo Álbum
          </Button>
        )}
      </Box>

      {artistIdFilter && (
        <Box className="filter-banner">
          <Typography variant="body1" className="filter-banner-text">
            ⚡ Mostrando únicamente la discografía del artista seleccionado
          </Typography>
          <Button 
            variant="outlined" 
            size="small" 
            startIcon={<FilterOffIcon />}
            onClick={() => setSearchParams({})}
            className="btn-clear-filter"
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
        /* Reemplazado MUI Grid por el contenedor CSS Grid uniforme */
        <Box className="albums-grid">
          {displayedAlbums.map((album) => (
            <AlbumCard 
              key={album.id}
              album={album} 
              onDelete={handleDelete} 
              onEdit={handleEditClick} 
              canEdit={canEdit} 
            />
          ))}
        </Box>
      )}

      {canEdit && (
        <CreateAlbumModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          onSuccess={handleAlbumCreated}
        />
      )}

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