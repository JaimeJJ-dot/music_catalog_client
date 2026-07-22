// src/pages/SearchPage.jsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Typography, Box, Grid } from '@mui/material';
import { getArtists } from '../services/artistService';
import { getAlbums } from '../services/albumService';
import ArtistCard from '../components/artists/ArtistCard';
import AlbumCard from '../components/albums/AlbumCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import './SearchPage.css';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [allArtists, setAllArtists] = useState([]);
  const [allAlbums, setAllAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [artistsRes, albumsRes] = await Promise.all([
        getArtists(),
        getAlbums(),
      ]);
      setAllArtists(artistsRes.data);
      setAllAlbums(albumsRes.data);
    } catch (err) {
      console.error("Error al buscar:", err);
      setError("No pudimos completar la búsqueda. Verifica tu conexión.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Buscando en tu catálogo..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchData} />;
  }

  const normalizedQuery = query.toLowerCase().trim();
  const hasQuery = normalizedQuery.length > 0;

  const matchedArtists = hasQuery
    ? allArtists.filter((a) => a.name?.toLowerCase().includes(normalizedQuery))
    : [];

  const matchedAlbums = hasQuery
    ? allAlbums.filter(
        (a) =>
          a.title?.toLowerCase().includes(normalizedQuery) ||
          a.artist_name?.toLowerCase().includes(normalizedQuery)
      )
    : [];

  const hasResults = matchedArtists.length > 0 || matchedAlbums.length > 0;

  return (
    <Container maxWidth="lg" className="search-page-container">
      {hasQuery && (
        <Typography variant="h4" className="search-page-title">
          Resultados para "{query}"
        </Typography>
      )}

      {!hasQuery ? (
        <EmptyState message="Busca tu artista o álbum favorito para empezar." />
      ) : !hasResults ? (
        <EmptyState message={`No encontramos nada para "${query}". Prueba con otro nombre.`} />
      ) : (
        <>
          {matchedArtists.length > 0 && (
            <Box className="search-section">
              <Typography variant="h5" className="search-section-title">
                Artistas
              </Typography>
              <Grid container spacing={3}>
                {matchedArtists.map((artist) => (
                  <Grid item xs={12} sm={6} md={4} key={artist.id}>
                    <ArtistCard artist={artist} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {matchedAlbums.length > 0 && (
            <Box className="search-section">
              <Typography variant="h5" className="search-section-title">
                Álbumes
              </Typography>
              <Grid container spacing={3}>
                {matchedAlbums.map((album) => (
                  <Grid item xs={12} sm={6} md={4} key={album.id}>
                    <AlbumCard album={album} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default SearchPage;