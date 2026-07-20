import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Paper, Alert } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { loginWithOAuth } from '../services/authService';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // NOTA: En un proyecto real de producción, estos valores vendrían de variables
    // de entorno (.env). Para el desarrollo local, usamos las de tu app OAuth.
    const CLIENT_ID = import.meta.env.VITE_OAUTH_CLIENT_ID || "TU_CLIENT_ID_AQUI";
    const CLIENT_SECRET = import.meta.env.VITE_OAUTH_CLIENT_SECRET || "TU_CLIENT_SECRET_AQUI";

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const data = await loginWithOAuth(username, password, CLIENT_ID, CLIENT_SECRET);
            // Guardamos el token en memoria para que el interceptor de Axios lo tome
            localStorage.setItem('access_token', data.access_token);
            // Si todo sale bien, redirigimos al módulo de artistas
            navigate('/artists');
        } catch (err) {
            console.error("Error en login:", err);
            setError("Credenciales incorrectas o error en el servidor OAuth 2.0");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className="login-container">
            <Paper elevation={3} className="login-paper">
                <Box className="login-header">
                    <LockOutlinedIcon color="primary" sx={{ fontSize: 40 }} />
                    <Typography component="h1" variant="h5">
                        Iniciar Sesión - Music API
                    </Typography>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <form onSubmit={handleLogin}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Usuario de Django"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Contraseña"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={loading}
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