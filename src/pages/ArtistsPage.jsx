import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { getArtists, deleteArtist } from '../services/artistService';
import ArtistCard from '../components/artists/ArtistCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import './ArtistsPage.css';

const ArtistsPage = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArtists = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getArtists();
      setArtists(response.data);
    } catch (err) {
      console.error("Error al obtener artistas:", err);
      setError("No pudimos cargar la lista de artistas. Verifica tu conexión o sesión de OAuth.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este artista?")) {
      try {
        await deleteArtist(id);
        setArtists(artists.filter((a) => a.id !== id));
      } catch (err) {
        alert("Ocurrió un error al intentar eliminar el registro.");
      }
    }
  };

  if (loading) {
    return <LoadingSpinner message="Consultando catálogo de artistas..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchArtists} />;
  }

  return (
    <Container maxWidth="lg" className="artists-page-container">
      <Box className="artists-page-header">
        <Typography variant="h4" component="h1" fontWeight="bold">
          Catálogo de Artistas
        </Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />}>
          Nuevo Artista
        </Button>
      </Box>

      {artists.length === 0 ? (
        <EmptyState message="No hay artistas registrados aún. ¡Añade el primero con el botón superior!" />
      ) : (
        <Grid container spacing={3}>
          {artists.map((artist) => (
            <Grid item xs={12} sm={6} md={4} key={artist.id}>
              <ArtistCard artist={artist} onDelete={handleDelete} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ArtistsPage;