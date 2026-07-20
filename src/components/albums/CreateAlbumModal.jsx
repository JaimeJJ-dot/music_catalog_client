import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Select, InputLabel, FormControl, Alert } from '@mui/material';
import { createAlbum } from '../../services/albumService';
import { getArtists } from '../../services/artistService';
import ImageUploader from '../common/ImageUploader';

const CreateAlbumModal = ({ open, onClose, onSuccess }) => {
    const [title, setTitle] = useState('');
    const [artistId, setArtistId] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [cover, setCover] = useState('');
    const [artistsList, setArtistsList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Cargar artistas al abrir el modal para llenar el select relacional
    useEffect(() => {
        if (open) {
            getArtists()
                .then(res => setArtistsList(res.data))
                .catch(() => setError("Error al cargar la lista de artistas para el selector."));
        }
    }, [open]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const payload = {
                title,
                artist: parseInt(artistId, 10), // Llave foránea esperada por Django
                release_date: releaseDate || null,
                cover
            };
            const response = await createAlbum(payload);
            onSuccess(response.data);
            handleClose();
        } catch (err) {
            console.error("Error creando álbum:", err);
            setError("No se pudo guardar el álbum. Revisa la consola para más detalles.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setTitle('');
        setArtistId('');
        setReleaseDate('');
        setCover('');
        setError(null);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle fontWeight="bold">Registrar Nuevo Álbum</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent dividers>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <FormControl fullWidth margin="normal" required>
                        <InputLabel id="artist-select-label">Artista / Banda</InputLabel>
                        <Select
                            labelId="artist-select-label"
                            value={artistId}
                            label="Artista / Banda *"
                            onChange={(e) => setArtistId(e.target.value)}
                        >
                            {artistsList.map((art) => (
                                <MenuItem key={art.id} value={art.id}>
                                    {art.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Título del Álbum *"
                        fullWidth
                        margin="normal"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <TextField
                        label="Fecha de Lanzamiento"
                        type="date"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        value={releaseDate}
                        onChange={(e) => setReleaseDate(e.target.value)}
                    />
                    <ImageUploader label="Portada del Disco (Base64)" value={cover} onChange={setCover} />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleClose} color="inherit">Cancelar</Button>
                    <Button type="submit" variant="contained" color="primary" disabled={loading}>
                        {loading ? "Guardando..." : "Guardar Álbum"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default CreateAlbumModal;