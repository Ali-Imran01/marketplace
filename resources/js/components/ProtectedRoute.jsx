import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isVerified, user } = useAuth();
    const location = useLocation();

    // List of routes that REQUIRE verification
    const highPrivilegeRoutes = [
        '/items/create',
        '/items/edit',
        '/transactions',
        '/listings',
        '/chat',
        '/admin',
        '/settings',
        '/reviews'
    ];

    const isHighPrivilege = highPrivilegeRoutes.some(path => location.pathname.startsWith(path));

    // 1. If not logged in (no token), ALWAYS go to login for ANY protected route
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 2. If logged in but attempting a high-privilege route while UNVERIFIED
    if (!isVerified && isHighPrivilege) {
        return <Navigate to="/verify-email" replace />;
    }

    // 3. Special case for /verify-email:
    // Only unverified users should be here. Verified users go home.
    if (location.pathname === '/verify-email' && isVerified) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
