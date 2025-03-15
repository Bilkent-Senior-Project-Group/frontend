// AdminRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function AdminRoute({ children }) {
    const { user } = useAuth();
    
    return children;
}

export default AdminRoute;