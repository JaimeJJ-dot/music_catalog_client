import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Alert } from '@mui/material';
import { createArtist } from '../../services/artistService';
import ImageUploader from '../common/ImageUploader';
import { useState } from 'react';

const CreateArtistModal = ({ open, onClose, onSuccess }) => {
    const [name, setName] = useState('');
    const [genre, setGenre] = useState('');
    const [biography, setBiography] = useState('');
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
                genre,
                biography,
                photo // String Base64 generado por ImageUploader
            };
            const response = await createArtist(payload);
            onSuccess(response.data); // Notificamos a ArtistsPage para actualizar la lista en RAM
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
        setBiography('');
        setPhoto('');
        setError(null);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle fontWeight="bold">Registrar Nuevo Artista</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent dividers>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
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
                        value={biography}
                        onChange={(e) => setBiography(e.target.value)}
                    />
                    <ImageUploader label="Foto del Artista (Base64)" value={photo} onChange={setPhoto} />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleClose} color="inherit">Cancelar</Button>
                    <Button type="submit" variant="contained" color="primary" disabled={loading}>
                        {loading ? "Guardando..." : "Guardar Artista"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default CreateArtistModal;