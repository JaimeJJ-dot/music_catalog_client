import { Card, CardContent, CardMedia, Typography, Box, Button } from '@mui/material';
import { DeleteOutlined as DeleteOutlineIcon } from '@mui/icons-material';
import './ArtistCard.css';

const ArtistCard = ({ artist, onDelete, canEdit }) => {
  const imageSource = artist.photo || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop";

  return (
    <Card className="artist-card" elevation={2}>
      <CardMedia
        component="img"
        height="180"
        image={imageSource}
        alt={artist.name}
        className="artist-image"
      />
      <CardContent className="artist-content">
        <Typography variant="h6" component="div" gutterBottom>
          {artist.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" className="artist-genre">
          Género: <strong>{artist.genre || 'No especificado'}</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
          {artist.biography ? `${artist.biography.substring(0, 80)}...` : 'Sin biografía registrada.'}
        </Typography>

        {canEdit && (
          <Box className="artist-actions">
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<DeleteOutlineIcon />}
              onClick={() => onDelete(artist.id)}
            >
              Eliminar
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ArtistCard;