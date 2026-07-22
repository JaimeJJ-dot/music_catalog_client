// src/components/artists/EditArtistModal.jsx
import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Alert } from '@mui/material';
import { updateArtist } from '../../services/artistService';
import ImageUploader from '../common/ImageUploader';
import './EditArtistModal.css';

const EditArtistModal = ({ open, onClose, onSuccess, artist }) => {
    const [name, setName] = useState('');
    const [genre, setGenre] = useState('');
    const [bio, setBio] = useState('');
    const [photo, setPhoto] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 1. Usamos una frontera asíncrona para cargar los datos sin disparar alertas de renders en cascada
    useEffect(() => {
        let isMounted = true;

        const initForm = async () => {
            await Promise.resolve(); // Microtarea para separar el ciclo de renderizado síncrono
            if (isMounted && artist && open) {
                setName(artist.name || '');
                setGenre(artist.genre || '');
                setBio(artist.bio || '');
                setPhoto(artist.photo || '');
                setError(null);
            }
        };

        initForm();

        return () => {
            isMounted = false;
        };
    }, [artist, open]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const payload = { name, genre: genre || null, bio: bio || null, photo };
            const response = await updateArtist(artist.id, payload);
            onSuccess(response.data); // Mandamos el artista actualizado a la página
            onClose();
        } catch (err) {
            console.error("Error al actualizar artista:", err);
            setError("No se pudo actualizar el registro. Verifica los datos o tu sesión.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle className="edit-artist-title">
                Editar Artista: {artist?.name}
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent dividers className="edit-artist-content">
                    {error && <Alert severity="error" className="edit-artist-alert">{error}</Alert>}
                    <TextField
                        label="Nombre del Artista *"
                        fullWidth margin="normal" required
                        value={name} onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        label="Género Musical"
                        fullWidth margin="normal"
                        value={genre} onChange={(e) => setGenre(e.target.value)}
                    />
                    <TextField
                        label="Biografía"
                        fullWidth multiline rows={3} margin="normal"
                        value={bio} onChange={(e) => setBio(e.target.value)}
                    />
                    <ImageUploader label="Cambiar Foto (Base64)" value={photo} onChange={setPhoto} />
                </DialogContent>
                <DialogActions className="edit-artist-actions">
                    <Button onClick={onClose} className="btn-cancel">Cancelar</Button>
                    <Button type="submit" variant="contained" disabled={loading} className="btn-save">
                        {loading ? "Guardando..." : "Guardar Cambios"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default EditArtistModal;