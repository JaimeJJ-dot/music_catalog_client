// src/components/common/ImageUploader.jsx
import { Box, Button, Typography, Avatar } from '@mui/material';
import { CloudUploadOutlined as CloudUploadOutlineIcon, DeleteOutlined as DeleteOutlineIcon } from '@mui/icons-material';
import { useState } from 'react';
import './ImageUploader.css';

const ImageUploader = ({ label = "Subir Imagen", onChange, value }) => {
    const [preview, setPreview] = useState(value || null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setPreview(base64String);
                onChange(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleClear = () => {
        setPreview(null);
        onChange('');
    };

    return (
        <Box className="image-uploader-container">
            <Typography variant="body2" className="image-uploader-label" gutterBottom>
                {label}
            </Typography>

            {preview ? (
                <Box className="image-preview-wrapper">
                    <Avatar
                        src={preview}
                        alt="Vista previa"
                        variant="rounded"
                        className="image-preview-avatar"
                    />
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<DeleteOutlineIcon />}
                        onClick={handleClear}
                        className="btn-remove-photo"
                    >
                        Quitar foto
                    </Button>
                </Box>
            ) : (
                <Button
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadOutlineIcon />}
                    className="btn-select-file"
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