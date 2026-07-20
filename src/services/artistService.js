// src/services/artistService.js
import api from './api';

export const getArtists = () => api.get('/api/artistas/');
export const getArtistById = (id) => api.get(`/api/artistas/${id}/`);
export const createArtist = (data) => api.post('/api/artistas/', data);
export const updateArtist = (id, data) => api.put(`/api/artistas/${id}/`, data);
export const deleteArtist = (id) => api.delete(`/api/artistas/${id}/`);