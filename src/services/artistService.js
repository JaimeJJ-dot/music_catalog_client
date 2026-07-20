// src/services/artistService.js
import api from './api';

export const getArtists = () => api.get('/api/artists/');
export const getArtistById = (id) => api.get(`/api/artists/${id}/`);
export const createArtist = (data) => api.post('/api/artists/', data);
export const updateArtist = (id, data) => api.put(`/api/artists/${id}/`, data);
export const deleteArtist = (id) => api.delete(`/api/artists/${id}/`);