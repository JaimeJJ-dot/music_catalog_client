// src/pages/SearchPage.jsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material';
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

  // Carga inicial al montar la página
  useEffect(() => {
    let isMounted = true;

    const fetchInitialData = async () => {
      try {
        const [artistsRes, albumsRes] = await Promise.all([
          getArtists(),
          getAlbums(),
        ]);
        if (isMounted) {
          setAllArtists(artistsRes.data);
          setAllAlbums(albumsRes.data);
          setError(null);
        }
      } catch (err) {
        console.error("Error al buscar:", err);
        if (isMounted) {
          setError("No pudimos completar la búsqueda. Verifica tu conexión.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchInitialData();

    return () => {
      isMounted = false; // Limpieza si el usuario navega rápido a otra vista
    };
  }, []);

  // Función exclusiva para la acción de reintentar en pantalla de error
  const handleRetry = async () => {
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
      console.error("Error al reintentar búsqueda:", err);
      setError("No pudimos completar la búsqueda. Verifica tu conexión.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Buscando en tu catálogo..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={handleRetry} />;
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
              <Box className="search-grid">
                {matchedArtists.map((artist) => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </Box>
            </Box>
          )}

          {matchedAlbums.length > 0 && (
            <Box className="search-section">
              <Typography variant="h5" className="search-section-title">
                Álbumes
              </Typography>
              <Box className="search-grid">
                {matchedAlbums.map((album) => (
                  <AlbumCard key={album.id} album={album} />
                ))}
              </Box>
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default SearchPage;