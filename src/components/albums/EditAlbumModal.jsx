// src/components/albums/EditAlbumModal.jsx
import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Select, InputLabel, FormControl, Alert } from '@mui/material';
import { updateAlbum } from '../../services/albumService';
import { getArtists } from '../../services/artistService';
import ImageUploader from '../common/ImageUploader';
import './EditAlbumModal.css';

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

                await Promise.resolve();
                if (isMounted && album) {
                    setTitle(album.title || '');
                    setArtistId(album.artist || '');
                    
                    // CORRECCIÓN DE FECHA: Aseguramos el formato YYYY-MM-DD para el input type="date"
                    const formattedDate = album.release_date ? album.release_date.split('T')[0] : '';
                    setReleaseDate(formattedDate);
                    
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
            // CORRECCIÓN DE PAYLOAD: Estructuramos los datos con los tipos exactos que exige Django
            const payload = {
                title,
                artist: parseInt(artistId, 10),
                // Si la fecha está vacía enviamos null para que DRF no rechace el formato
                release_date: releaseDate ? releaseDate : null
            };

            // CORRECCIÓN DE IMAGEN: Solo enviamos 'cover' si es un Base64 nuevo o si el usuario quitó la foto
            if (cover && cover.startsWith('data:image')) {
                payload.cover = cover;
            } else if (!cover) {
                payload.cover = null; // Para permitir borrar la portada si el modelo lo permite
            }

            const response = await updateAlbum(album.id, payload);
            onSuccess(response.data);
            onClose();
        } catch (err) {
            console.error("Error al actualizar álbum:", err);
            const backendMsg = err.response?.data ? JSON.stringify(err.response.data) : null;
            setError(backendMsg || "No se pudo guardar el álbum modificado. Revisa tu conexión o sesión.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle className="edit-modal-title">
                Editar Álbum: {album?.title}
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent dividers className="edit-modal-content">
                    {error && <Alert severity="error" className="edit-modal-alert">{error}</Alert>}

                    <FormControl fullWidth margin="normal" required>
                        <InputLabel id="edit-artist-label">Artista / Banda</InputLabel>
                        <Select
                            labelId="edit-artist-label"
                            value={artistId}
                            label="Artista / Banda *"
                            onChange={(e) => setArtistId(e.target.value)}
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
                    />
                    <TextField
                        label="Fecha de Lanzamiento"
                        type="date"
                        fullWidth margin="normal"
                        InputLabelProps={{ shrink: true }}
                        value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)}
                    />
                    <ImageUploader label="Cambiar Portada (Base64)" value={cover} onChange={setCover} />
                </DialogContent>
                <DialogActions className="edit-modal-actions">
                    <Button onClick={onClose} className="btn-cancel">Cancelar</Button>
                    <Button type="submit" variant="contained" disabled={loading} className="btn-save">
                        {loading ? "Guardando..." : "Guardar Cambios"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default EditAlbumModal;