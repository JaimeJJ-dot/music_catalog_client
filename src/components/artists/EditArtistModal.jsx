// src/components/artists/EditArtistModal.jsx
import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Alert } from '@mui/material';
import { updateArtist } from '../../services/artistService';
import ImageUploader from '../common/ImageUploader';

const EditArtistModal = ({ open, onClose, onSuccess, artist }) => {
    const [name, setName] = useState('');
    const [genre, setGenre] = useState('');
    const [biography, setBiography] = useState('');
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
                setBiography(artist.biography || '');
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
            const payload = { name, genre, biography, photo };
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
            <DialogTitle fontWeight="bold" sx={{ backgroundColor: '#181818', color: '#ffffff' }}>
                Editar Artista: {artist?.name}
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent dividers sx={{ backgroundColor: '#121212', color: '#ffffff' }}>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <TextField
                        label="Nombre del Artista *"
                        fullWidth margin="normal" required
                        value={name} onChange={(e) => setName(e.target.value)}
                        InputLabelProps={{ style: { color: '#b3b3b3' } }}
                        InputProps={{ style: { color: '#ffffff', borderColor: '#282828' } }}
                    />
                    <TextField
                        label="Género Musical"
                        fullWidth margin="normal"
                        value={genre} onChange={(e) => setGenre(e.target.value)}
                        InputLabelProps={{ style: { color: '#b3b3b3' } }}
                        InputProps={{ style: { color: '#ffffff' } }}
                    />
                    <TextField
                        label="Biografía"
                        fullWidth multiline rows={3} margin="normal"
                        value={biography} onChange={(e) => setBiography(e.target.value)}
                        InputLabelProps={{ style: { color: '#b3b3b3' } }}
                        InputProps={{ style: { color: '#ffffff' } }}
                    />
                    <ImageUploader label="Cambiar Foto (Base64)" value={photo} onChange={setPhoto} />
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

export default EditArtistModal;