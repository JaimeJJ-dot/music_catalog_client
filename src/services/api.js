// src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Peticiones: Inyecta el Token OAuth 2.0 si existe en el Storage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de Respuestas: Manejo centralizado de errores sin expulsar al usuario
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        // Token inválido o expirado: limpiamos la sesión silenciosamente
        // NO redirigimos a '/login' para permitir que los visitantes públicos sigan navegando en modo lectura
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('token');
        localStorage.clear();
      } else if (status === 403) {
        console.error('No tienes permisos para realizar esta acción.');
      } else if (status === 404) {
        console.error('Recurso no encontrado.');
      } else if (status >= 500) {
        console.error('Error del servidor. Intenta más tarde.');
      }
    } else if (error.request) {
      console.error('No se pudo conectar con el servidor.');
    }
    return Promise.reject(error);
  }
);

export default api;