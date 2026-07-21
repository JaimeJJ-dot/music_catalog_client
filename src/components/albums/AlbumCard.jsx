import { Card, CardContent, CardMedia, Typography, Box, Button } from '@mui/material';
import { DeleteOutlined as DeleteIcon, EditOutlined as EditIcon } from '@mui/icons-material';
import './AlbumCard.css';

const AlbumCard = ({ album, onDelete, onEdit, canEdit }) => {
  // URL de respaldo (portada genérica musical en alta calidad)
  const fallbackCover = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80";

  // Función blindada para construir la URL web real hacia el backend de Django
  const getValidImageSource = (cover) => {
    if (!cover) return fallbackCover;
    
    // Si ya es un enlace web completo (http...) o una imagen en Base64 cruda, la usamos directo
    if (cover.startsWith('http://') || cover.startsWith('https://') || cover.startsWith('data:image')) {
      return cover;
    }
    
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
    
    // Aseguramos que la ruta empiece con una diagonal '/'
    let cleanPath = cover.startsWith('/') ? cover : `/${cover}`;
    
    // Si Django nos devolvió solo el nombre del archivo (ej: "/album_cover_xxx.jpeg"), le anteponemos "/media"
    if (!cleanPath.startsWith('/media/') && !cleanPath.startsWith('/static/')) {
      cleanPath = `/media${cleanPath}`;
    }
    
    return `${baseUrl}${cleanPath}`;
  };

  const imageSource = getValidImageSource(album.cover);

  return (
    <Card className="album-card" elevation={2} sx={{ backgroundColor: '#181818', color: '#ffffff', border: '1px solid #282828' }}>
      <CardMedia
        component="img"
        height="220"
        image={imageSource}
        alt={album.title}
        className="album-image"
        // Si la URL falla al cargar, cambiamos silenciosamente a la imagen de respaldo
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
          Lanzamiento: <strong style={{ color: '#ffffff' }}>{album.release_date || 'No registrado'}</strong>
        </Typography>

        {/* Agrupamos ambos botones ordenadamente y los protegemos con canEdit si es necesario */}
        <Box className="album-actions" sx={{ borderTop: '1px solid #282828', pt: 1, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          {canEdit && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<EditIcon />}
            onClick={() => onEdit(album)}
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
            onClick={() => onDelete(album.id)}
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

export default AlbumCard;