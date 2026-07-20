import api from './api';

export const getAlbums = () => api.get('/api/albums/');
export const getAlbumById = (id) => api.get(`/api/albums/${id}/`);
export const createAlbum = (data) => api.post('/api/albums/', data);
export const updateAlbum = (id, data) => api.put(`/api/albums/${id}/`, data);
export const deleteAlbum = (id) => api.delete(`/api/albums/${id}/`);