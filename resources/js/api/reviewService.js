import api from './axios';

export const reviewService = {
    getAll: (params) => api.get('/reviews', { params }),
    create: (data) => api.post('/reviews', data),
};
