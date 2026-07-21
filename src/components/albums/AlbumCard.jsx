import { Card, CardContent, CardMedia, Typography, Box, Button } from '@mui/material';
import { DeleteOutlined as DeleteIcon } from '@mui/icons-material';
import './AlbumCard.css';

const AlbumCard = ({ album, onDelete }) => {
  // 1. URL de respaldo (portada genérica musical en alta calidad)
  const fallbackCover = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80";

  // 2. Si Django devuelve una ruta relativa (/media/...), le agregamos el host del backend
  const getValidImageSource = (cover) => {
    if (!cover) return fallbackCover;
    if (cover.startsWith('/')) {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
      return `${baseUrl}${cover}`;
    }
    return cover;
  };

  const imageSource = getValidImageSource(album.cover);

  return (
    <Card className="album-card" elevation={2}>
      <CardMedia
        component="img"
        height="220"
        image={imageSource}
        alt={album.title}
        className="album-image"
        // 3. Si la URL falla al cargar, cambiamos silenciosamente a la imagen de respaldo
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = fallbackCover;
        }}
      />
      <CardContent className="album-content">
        <Typography variant="h6" component="div" fontWeight="bold" sx={{ color: '#ffffff' }}>
          {album.title}
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#1db954', fontWeight: '600', mb: 1 }}>
          {album.artist_name || 'Artista Desconocido'}
        </Typography>
        <Typography variant="body2" sx={{ color: '#b3b3b3', mb: 2 }}>
          Lanzamiento: <strong>{album.release_date || 'No registrado'}</strong>
        </Typography>

        <Box className="album-actions">
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<DeleteIcon />}
            onClick={() => onDelete(album.id)}
            sx={{ borderRadius: '20px', textTransform: 'none' }}
          >
            Eliminar
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AlbumCard;