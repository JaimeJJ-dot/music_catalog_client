import { Card, CardContent, CardMedia, Typography, Box, Button } from '@mui/material';
import { DeleteOutlined as DeleteOutlineIcon } from '@mui/icons-material';
import './AlbumCard.css';

const AlbumCard = ({ album, onDelete }) => {
  const imageSource = album.cover || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop";

  return (
    <Card className="album-card" elevation={2}>
      <CardMedia
        component="img"
        height="220"
        image={imageSource}
        alt={album.title}
        className="album-image"
      />
      <CardContent className="album-content">
        <Typography variant="h6" component="div" fontWeight="bold">
          {album.title}
        </Typography>
        <Typography variant="subtitle1" color="primary" fontWeight="600" gutterBottom>
          {album.artist_name || 'Artista Desconocido'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Lanzamiento: <strong>{album.release_date || 'No registrado'}</strong>
        </Typography>

        <Box className="album-actions">
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<DeleteOutlineIcon />}
            onClick={() => onDelete(album.id)}
          >
            Eliminar
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AlbumCard;