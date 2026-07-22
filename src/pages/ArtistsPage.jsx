import { useState, useEffect } from 'react';
import { Container, Grid, Typography, Box, Button } from '@mui/material';
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

  // Función para insertar el nuevo artista en el estado de React al guardarlo:
  const handleArtistCreated = (newArtist) => {
    setArtists((prev) => [newArtist, ...prev]);
  };

  // Funciones de manejo de edición:
  const handleEditClick = (artist) => {
    setEditingArtist(artist);
    setOpenEditModal(true);
  };

  const handleArtistUpdated = (updatedArtist) => {
    setArtists((prev) => prev.map((art) => (art.id === updatedArtist.id ? updatedArtist : art)));
  };

  // Aislamos la consulta asíncrona dentro del efecto para cumplir las reglas de React Hooks
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
      isMounted = false; // Cleanup de seguridad
    };
  }, []);

  // Función de reintento estandarizada a async/await
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
        <Grid container spacing={3}>
          {artists.map((artist) => (
            /* Homologado a md={3} lg={2.4} para mantener simetría exacta con los álbumes */
            <Grid item xs={12} sm={6} md={3} lg={2.4} key={artist.id}>
              <ArtistCard artist={artist} onDelete={handleDelete} onEdit={handleEditClick} canEdit={canEdit} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Componentes Modales de creación y edición */}
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