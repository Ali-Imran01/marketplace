import api from './axios';

export const userService = {
    updateProfile: (data) => api.put('/profile', data),
    getProfile: (id) => api.get(`/users/${id}`),
};
