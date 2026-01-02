import api from './axios';

export const transactionService = {
    getAll: () => api.get('/transactions'),
    getById: (id) => api.get(`/transactions/${id}`),
    create: (data) => api.post('/transactions', data),
    update: (id, status) => api.put(`/transactions/${id}`, { status }),
};
