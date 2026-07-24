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

    if (photo.startsWith('http://') || photo.startsWith('https://') || photo.startsWith('data:image')) {
      return photo;
    }

    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
    let cleanPath = photo.startsWith('/') ? photo : `/${photo}`;

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
        {/* Usamos clases en lugar de sx para tipografía y colores */}
        <Typography variant="h6" component="div" className="artist-name">
          {artist.name}
        </Typography>
        <Typography variant="subtitle2" className="artist-genre">
          Género: {artist.genre || 'No especificado'}
        </Typography>
        <Typography variant="body2" className="artist-bio">
          {artist.bio ? `${artist.bio.substring(0, 80)}...` : 'Sin biografía registrada.'}
        </Typography>

        {/* Contenedor de botones manejado 100% por CSS */}
        <Box className="artist-actions">
          <Button
            variant="contained"
            size="small"
            startIcon={<AlbumIcon />}
            onClick={() => navigate(`/artists/${artist.id}`)}
            className="btn-discography"
          >
            Ver discografía
          </Button>
          
          {canEdit && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<EditIcon />}
              onClick={() => onEdit(artist)}
              className="btn-edit"
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
              className="btn-delete"
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