import api from './axios';

const notificationService = {
    getAll: () => api.get('/notifications'),
    markRead: (id) => api.put(`/notifications/${id}/read`),
    markAllRead: () => api.post('/notifications/read-all'),
    markTransactionRead: (transactionId) => api.put(`/notifications/transaction/${transactionId}/read`),
    delete: (id) => api.delete(`/notifications/${id}`),
};

export default notificationService;
