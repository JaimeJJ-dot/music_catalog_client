// src/components/artists/CreateArtistModal.jsx
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Alert } from '@mui/material';
import { createArtist } from '../../services/artistService';
import ImageUploader from '../common/ImageUploader';
import { useState } from 'react';
import './CreateArtistModal.css';

const CreateArtistModal = ({ open, onClose, onSuccess }) => {
    const [name, setName] = useState('');
    const [genre, setGenre] = useState('');
    const [bio, setBio] = useState('');
    const [photo, setPhoto] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const payload = {
                name,
                genre: genre || null,
                bio: bio || null,
                photo
            };
            const response = await createArtist(payload);
            onSuccess(response.data);
            handleClose();
        } catch (err) {
            console.error("Error creando artista:", err);
            setError("No se pudo crear el artista. Verifica los campos requeridos.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setName('');
        setGenre('');
        setBio('');
        setPhoto('');
        setError(null);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle className="create-artist-title">Registrar Nuevo Artista</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent dividers className="create-artist-content">
                    {error && <Alert severity="error" className="create-artist-alert">{error}</Alert>}
                    <TextField
                        label="Nombre del Artista *"
                        fullWidth
                        margin="normal"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        label="Género Musical"
                        fullWidth
                        margin="normal"
                        placeholder="Ej: Synthpop, Rock Alternativo, Electrónica"
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                    />
                    <TextField
                        label="Biografía"
                        fullWidth
                        multiline
                        rows={3}
                        margin="normal"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />
                    <ImageUploader label="Foto del Artista (Base64)" value={photo} onChange={setPhoto} />
                </DialogContent>
                <DialogActions className="create-artist-actions">
                    <Button onClick={handleClose} className="btn-cancel">Cancelar</Button>
                    <Button type="submit" variant="contained" disabled={loading} className="btn-create">
                        {loading ? "Guardando..." : "Guardar Artista"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default CreateArtistModal;