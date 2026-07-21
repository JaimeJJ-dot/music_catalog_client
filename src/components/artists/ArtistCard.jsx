import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Box, Button } from '@mui/material';
import { DeleteOutlined as DeleteIcon, AlbumOutlined as AlbumIcon, EditOutlined as EditIcon } from '@mui/icons-material';
import './ArtistCard.css';

const ArtistCard = ({ artist, onDelete, onEdit, canEdit }) => {
  const navigate = useNavigate();

  const fallbackPhoto = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80";

  // Función blindada para resolver la ruta web real de la foto hacia el backend de Django
  const getValidImageSource = (photo) => {
    if (!photo) return fallbackPhoto;

    // Si ya es un enlace web completo (http...) o una imagen en Base64 cruda, la usamos directo
    if (photo.startsWith('http://') || photo.startsWith('https://') || photo.startsWith('data:image')) {
      return photo;
    }

    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

    // Aseguramos que la ruta empiece con una diagonal '/'
    let cleanPath = photo.startsWith('/') ? photo : `/${photo}`;

    // Si Django devolvió solo el nombre del archivo (ej: "/artist_photo_xxx.jpeg"), le anteponemos "/media"
    if (!cleanPath.startsWith('/media/') && !cleanPath.startsWith('/static/')) {
      cleanPath = `/media${cleanPath}`;
    }

    return `${baseUrl}${cleanPath}`;
  };

  const imageSource = getValidImageSource(artist.photo);

  return (
    <Card className="artist-card" elevation={2}>
      <CardMedia
        component="img"
        height="220"
        image={imageSource}
        alt={artist.name}
        className="artist-image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = fallbackPhoto;
        }}
      />
      <CardContent className="artist-content">
        <Typography variant="h6" component="div" fontWeight="bold" sx={{ color: '#ffffff' }}>
          {artist.name}
        </Typography>
        <Typography variant="subtitle2" sx={{ color: '#1db954', fontWeight: '600', mb: 1 }}>
          Género: {artist.genre || 'No especificado'}
        </Typography>
        <Typography variant="body2" sx={{ color: '#b3b3b3', mb: 2 }}>
          {artist.bio ? `${artist.bio.substring(0, 80)}...` : 'Sin biografía registrada.'}
        </Typography>

        {/* Contenedor de botones optimizado para el tema Vynlo */}
        <Box className="artist-actions" sx={{ display: 'flex', gap: 1, justifyContent: 'space-between', mt: 'auto', pt: 2, borderTop: '1px solid #282828', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="small"
            startIcon={<AlbumIcon />}
            onClick={() => navigate(`/albums?artistId=${artist.id}`)}
            sx={{
              backgroundColor: '#1db954',
              color: '#000000',
              fontWeight: 'bold',
              borderRadius: '20px',
              textTransform: 'none',
              '&:hover': { backgroundColor: '#1ed760' }
            }}
          >
            Ver discografía
          </Button>
          
          {canEdit && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<EditIcon />}
            onClick={() => onEdit(artist)}
            sx={{
              color: '#ffffff',
              borderColor: '#535353',
              borderRadius: '20px',
              textTransform: 'none',
              '&:hover': { borderColor: '#ffffff', backgroundColor: 'rgba(255,255,255,0.05)' }
            }}
          >
            Editar
          </Button>
          )}

          {canEdit && (
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<DeleteIcon />}
            onClick={() => onDelete(artist.id)}
            sx={{ borderRadius: '20px', textTransform: 'none' }}
          >
            Eliminar
          </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ArtistCard;