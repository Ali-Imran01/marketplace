import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });

    const login = async (credentials) => {
        const res = await api.post('/login', credentials);
        const { access_token, user: userData } = res.data;
        setUser(userData);
        if (access_token) {
            localStorage.setItem('token', access_token);
        }
        localStorage.setItem('user', JSON.stringify(userData));
        return res.data;
    };

    const register = async (userData) => {
        const res = await api.post('/register', userData);
        const { access_token, user: newUserData } = res.data;
        setUser(newUserData);
        if (access_token) {
            localStorage.setItem('token', access_token);
        }
        localStorage.setItem('user', JSON.stringify(newUserData));
        return res.data;
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } catch (e) {
            console.error("Logout error", e);
        } finally {
            setUser(null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    };

    const isAuthenticated = !!localStorage.getItem('token');
    const isVerified = user?.email_verified_at !== null && user?.email_verified_at !== undefined;
    const isAdmin = () => user?.role === 'admin';

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            login,
            register,
            logout,
            isAdmin,
            isAuthenticated,
            isVerified
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
