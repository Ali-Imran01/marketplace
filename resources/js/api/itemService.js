import api from './axios';

export const itemService = {
    getAll: (params) => api.get('/items', { params }),
    getMyItems: () => api.get('/my-items'),
    getById: (id) => api.get(`/items/${id}`),
    create: (data) => api.post('/items', data),
    update: (id, data) => api.put(`/items/${id}`, data),
    delete: (id) => api.delete(`/items/${id}`),
};
