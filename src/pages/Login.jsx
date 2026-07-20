import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Paper, Alert } from '@mui/material';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import { loginWithOAuth } from '../services/authService';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
    const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const data = await loginWithOAuth(username, password, CLIENT_ID, CLIENT_SECRET);
            localStorage.setItem('access_token', data.access_token);
            navigate('/');
        } catch (err) {
            console.error("Error en login:", err);
            setError("Credenciales incorrectas o error en el servidor OAuth 2.0");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className="login-container">
            <Paper elevation={0} className="login-paper">
                <Box className="login-header">
                    <LibraryMusicIcon className="login-icon" sx={{ fontSize: 48 }} />
                    <Typography component="h1" variant="h5" className="login-title">
                        Inicia sesión en SoundCatalog
                    </Typography>
                    <Typography variant="body2" className="login-subtitle">
                        Accede con tu cuenta de Django para gestionar el catálogo
                    </Typography>
                </Box>

                {error && <Alert severity="error" className="login-alert" sx={{ mb: 2 }}>{error}</Alert>}

                <form onSubmit={handleLogin}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Usuario de Django"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoFocus
                        className="login-input"
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Contraseña"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="login-input"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        className="login-button"
                        sx={{ mt: 3, mb: 2, py: 1.5 }}
                    >
                        {loading ? "Autenticando..." : "Entrar al Catálogo"}
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default Login;