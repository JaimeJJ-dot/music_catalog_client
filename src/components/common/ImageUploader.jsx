// src/components/common/ImageUploader.jsx
import { Box, Button, Typography, Avatar } from '@mui/material';
import { CloudUploadOutlined as CloudUploadOutlineIcon, DeleteOutlined as DeleteOutlineIcon } from '@mui/icons-material';
import { useState } from 'react';

const ImageUploader = ({ label = "Subir Imagen", onChange, value }) => {
    const [preview, setPreview] = useState(value || null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // API nativa del navegador para leer archivos como Base64 (Data URL)
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setPreview(base64String);
                onChange(base64String); // Enviamos el string al formulario padre
            };
            reader.readAsDataURL(file);
        }
    };

    const handleClear = () => {
        setPreview(null);
        onChange('');
    };

    return (
        <Box sx={{ border: '1px dashed #ccc', p: 2, borderRadius: 2, textAlign: 'center', my: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
                {label}
            </Typography>

            {preview ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <Avatar
                        src={preview}
                        alt="Vista previa"
                        variant="rounded"
                        sx={{ width: 120, height: 120, boxShadow: 2 }}
                    />
                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<DeleteOutlineIcon />}
                        onClick={handleClear}
                    >
                        Quitar foto
                    </Button>
                </Box>
            ) : (
                <Button
                    component="label"
                    variant="contained"
                    color="secondary"
                    startIcon={<CloudUploadOutlineIcon />}
                >
                    Seleccionar Archivo
                    <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </Button>
            )}
        </Box>
    );
};

export default ImageUploader;