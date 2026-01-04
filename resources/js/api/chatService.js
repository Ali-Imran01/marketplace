import api from './axios';

const chatService = {
    getConversations: () => api.get('/chat'),
    getMessages: (transactionId) => api.get(`/chat/${transactionId}`),
    sendMessage: (data) => api.post('/chat', data),
    markAsRead: (messageId) => api.put(`/chat/${messageId}/read`),
};

export default chatService;
