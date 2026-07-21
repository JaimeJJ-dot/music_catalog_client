// src/components/albums/EditAlbumModal.jsx
import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Select, InputLabel, FormControl, Alert } from '@mui/material';
import { updateAlbum } from '../../services/albumService';
import { getArtists } from '../../services/artistService';
import ImageUploader from '../common/ImageUploader';

const EditAlbumModal = ({ open, onClose, onSuccess, album }) => {
    const [title, setTitle] = useState('');
    const [artistId, setArtistId] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [cover, setCover] = useState('');
    const [artistsList, setArtistsList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Carga asíncrona segura: consultamos los artistas para el select y precargamos los datos del disco
    useEffect(() => {
        let isMounted = true;

        const initModal = async () => {
            if (open) {
                try {
                    const res = await getArtists();
                    if (isMounted) {
                        setArtistsList(res.data);
                    }
                } catch (err) {
                    console.error("Error cargando lista de artistas:", err);
                }

                // Frontera de microtarea para aislar la actualización de estados y cumplir con ESLint
                await Promise.resolve();
                if (isMounted && album) {
                    setTitle(album.title || '');
                    setArtistId(album.artist || '');
                    setReleaseDate(album.release_date || '');
                    setCover(album.cover || '');
                    setError(null);
                }
            }
        };

        initModal();

        return () => {
            isMounted = false;
        };
    }, [album, open]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const payload = {
                title,
                artist: parseInt(artistId, 10), // Convertimos a entero para cumplir con la llave foránea de Django
                release_date: releaseDate || null,
                cover
            };
            const response = await updateAlbum(album.id, payload);
            onSuccess(response.data); // Notificamos a AlbumsPage para reemplazar el disco en la grilla
            onClose();
        } catch (err) {
            console.error("Error al actualizar álbum:", err);
            setError("No se pudo guardar el álbum modificado. Revisa tu conexión o sesión.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle fontWeight="bold" sx={{ backgroundColor: '#181818', color: '#ffffff' }}>
                Editar Álbum: {album?.title}
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent dividers sx={{ backgroundColor: '#121212', color: '#ffffff' }}>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <FormControl fullWidth margin="normal" required>
                        <InputLabel id="edit-artist-label" sx={{ color: '#b3b3b3' }}>Artista / Banda</InputLabel>
                        <Select
                            labelId="edit-artist-label"
                            value={artistId}
                            label="Artista / Banda *"
                            onChange={(e) => setArtistId(e.target.value)}
                            sx={{ color: '#ffffff', '.MuiOutlinedInput-notchedOutline': { borderColor: '#282828' } }}
                        >
                            {artistsList.map((art) => (
                                <MenuItem key={art.id} value={art.id}>{art.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Título del Álbum *"
                        fullWidth margin="normal" required
                        value={title} onChange={(e) => setTitle(e.target.value)}
                        InputLabelProps={{ style: { color: '#b3b3b3' } }}
                        InputProps={{ style: { color: '#ffffff', borderColor: '#282828' } }}
                    />
                    <TextField
                        label="Fecha de Lanzamiento"
                        type="date"
                        fullWidth margin="normal"
                        InputLabelProps={{ shrink: true, style: { color: '#b3b3b3' } }}
                        InputProps={{ style: { color: '#ffffff' } }}
                        value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)}
                    />
                    <ImageUploader label="Cambiar Portada (Base64)" value={cover} onChange={setCover} />
                </DialogContent>
                <DialogActions sx={{ p: 2, backgroundColor: '#181818' }}>
                    <Button onClick={onClose} sx={{ color: '#b3b3b3', textTransform: 'none' }}>Cancelar</Button>
                    <Button type="submit" variant="contained" disabled={loading} sx={{ backgroundColor: '#1db954', color: '#000', fontWeight: 'bold', borderRadius: '20px', '&:hover': { backgroundColor: '#1ed760' } }}>
                        {loading ? "Guardando..." : "Guardar Cambios"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default EditAlbumModal;