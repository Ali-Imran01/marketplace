import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });

    useEffect(() => {
        const syncUser = async () => {
            if (localStorage.getItem('token')) {
                try {
                    const res = await api.get('/me');
                    const userData = res.data.data || res.data;
                    setUser(userData);
                    localStorage.setItem('user', JSON.stringify(userData));
                } catch (err) {
                    if (err.response?.status === 401) {
                        logout();
                    }
                }
            }
        };
        syncUser();
    }, []);

    const login = async (credentials) => {
        const res = await api.post('/login', credentials);
        const { access_token, user: userData } = res.data;
        const finalUser = userData?.data || userData;
        setUser(finalUser);
        if (access_token) {
            localStorage.setItem('token', access_token);
        }
        localStorage.setItem('user', JSON.stringify(finalUser));
        return res.data;
    };

    const register = async (userData) => {
        const res = await api.post('/register', userData);
        const { access_token, user: newUserData } = res.data;
        const finalUser = newUserData?.data || newUserData;
        setUser(finalUser);
        if (access_token) {
            localStorage.setItem('token', access_token);
        }
        localStorage.setItem('user', JSON.stringify(finalUser));
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
    const isVerified = Boolean(user && user.email_verified_at);
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
