import { useState, useEffect } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { getArtists, deleteArtist } from '../services/artistService';
import { isLoggedIn } from '../services/authService';
import ArtistCard from '../components/artists/ArtistCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import './ArtistsPage.css';
import CreateArtistModal from '../components/artists/CreateArtistModal';
import EditArtistModal from '../components/artists/EditArtistModal';

const ArtistsPage = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [editingArtist, setEditingArtist] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const canEdit = isLoggedIn();

  const handleArtistCreated = (newArtist) => {
    setArtists((prev) => [newArtist, ...prev]);
  };

  const handleEditClick = (artist) => {
    setEditingArtist(artist);
    setOpenEditModal(true);
  };

  const handleArtistUpdated = (updatedArtist) => {
    setArtists((prev) => prev.map((art) => (art.id === updatedArtist.id ? updatedArtist : art)));
  };

  useEffect(() => {
    let isMounted = true;

    const fetchArtists = async () => {
      try {
        const response = await getArtists();
        if (isMounted) {
          setArtists(response.data);
          setError(null);
        }
      } catch (err) {
        console.error("Error al obtener artistas:", err);
        if (isMounted) {
          setError("No pudimos cargar la lista de artistas. Verifica tu conexión o sesión de OAuth.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchArtists();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRetry = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getArtists();
      setArtists(response.data);
    } catch (err) {
      console.error(err);
      setError("Error de red persistente. Intenta más tarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este artista?")) {
      try {
        await deleteArtist(id);
        setArtists((prev) => prev.filter((a) => a.id !== id));
      } catch (err) {
        console.error("Error eliminando registro:", err);
        alert("Ocurrió un error al intentar eliminar el registro.");
      }
    }
  };

  if (loading) {
    return <LoadingSpinner message="Consultando catálogo de artistas..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={handleRetry} />;
  }

  return (
    <Container maxWidth="lg" className="artists-page-container">
      <Box className="artists-page-header">
        <Typography variant="h4" component="h1" fontWeight="bold">
          Catálogo de Artistas
        </Typography>
        {canEdit && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpenModal(true)}
          >
            Nuevo Artista
          </Button>
        )}
      </Box>

      {artists.length === 0 ? (
        <EmptyState message="No hay artistas registrados aún. ¡Añade el primero con el botón superior!" />
      ) : (
        /* Reemplazamos MUI Grid por el contenedor CSS Grid */
        <Box className="artists-grid">
          {artists.map((artist) => (
            <ArtistCard 
              key={artist.id} 
              artist={artist} 
              onDelete={handleDelete} 
              onEdit={handleEditClick} 
              canEdit={canEdit} 
            />
          ))}
        </Box>
      )}

      {/* Modales */}
      {canEdit && (
        <>
          <CreateArtistModal
            open={openModal}
            onClose={() => setOpenModal(false)}
            onSuccess={handleArtistCreated}
          />
          <EditArtistModal
            open={openEditModal}
            onClose={() => {
              setOpenEditModal(false);
              setEditingArtist(null);
            }}
            onSuccess={handleArtistUpdated}
            artist={editingArtist}
          />
        </>
      )}
    </Container>
  );
};

export default ArtistsPage;