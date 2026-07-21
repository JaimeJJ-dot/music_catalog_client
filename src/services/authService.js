import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

// Función para iniciar sesión e intercambiar credenciales por tokens de OAuth
export const loginWithOAuth = async (username, password, clientId, clientSecret) => {
    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('username', username);
    params.append('password', password);
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);

    const response = await axios.post(`${API_BASE_URL}/o/token/`, params, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    // Al recibir el token, lo guardamos inmediatamente en el almacenamiento local
    if (response.data && response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
        if (response.data.refresh_token) {
            localStorage.setItem('refresh_token', response.data.refresh_token);
        }
    }

    return response.data;
};

// Función síncrona para verificar si el usuario tiene una sesión activa
export const isLoggedIn = () => {
    // Si existe un access_token en el localStorage, devolverá true; de lo contrario, false
    const token = localStorage.getItem('access_token');
    return Boolean(token);
};