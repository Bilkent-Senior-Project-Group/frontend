// AdminRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function AdminRoute({ children }) {
    const { user } = useAuth();

    if (!user || user.email !== 'admin@admin.com') {
        // Redirect non-admin users to home page
        return <Navigate to="/" replace />;
    }
    
    return children;
}

export default AdminRoute;