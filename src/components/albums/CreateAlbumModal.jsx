// src/components/albums/CreateAlbumModal.jsx
import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Select, InputLabel, FormControl, Alert } from '@mui/material';
import { createAlbum } from '../../services/albumService';
import { getArtists } from '../../services/artistService';
import ImageUploader from '../common/ImageUploader';
import './CreateAlbumModal.css';

const CreateAlbumModal = ({ open, onClose, onSuccess }) => {
    const [title, setTitle] = useState('');
    const [artistId, setArtistId] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [cover, setCover] = useState('');
    const [artistsList, setArtistsList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
                artist: parseInt(artistId, 10),
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
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth className="create-modal-root">
            <DialogTitle className="create-modal-title">Registrar Nuevo Álbum</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent dividers className="create-modal-content">
                    {error && <Alert severity="error" className="create-modal-alert">{error}</Alert>}

                    <FormControl fullWidth margin="normal" required className="modal-field">
                        <InputLabel id="artist-select-label">Artista / Banda</InputLabel>
                        <Select
                            labelId="artist-select-label"
                            label="Artista / Banda"
                            value={artistId}
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
                        label="Título del Álbum"
                        fullWidth
                        margin="normal"
                        required
                        className="modal-field"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <div className="modal-static-field">
                        <label className="modal-static-label" htmlFor="release-date-input">
                            Fecha de Lanzamiento
                        </label>
                        <TextField
                            id="release-date-input"
                            type="date"
                            fullWidth
                            className="modal-field modal-field--no-label"
                            value={releaseDate}
                            onChange={(e) => setReleaseDate(e.target.value)}
                        />
                    </div>
                    <ImageUploader label="Portada del Disco (Base64)" value={cover} onChange={setCover} />
                </DialogContent>
                <DialogActions 
                    className="create-modal-actions"
                    sx={{ justifyContent: "center" }}
                    >
                    <Button onClick={handleClose} className="btn-cancel">
                        Cancelar
                    </Button>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        disabled={loading} 
                        className="btn-create"
                    >
                        {loading ? "Guardando..." : "Guardar Álbum"}
                    </Button>
                </DialogActions>

            </form>
        </Dialog>
    );
};

export default CreateAlbumModal;