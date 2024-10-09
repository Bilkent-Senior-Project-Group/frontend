import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();  // Assume AuthContext provides this

  return currentUser ? <Sidebar>{children}</Sidebar> : <Navigate to="/" />;
};

export default PrivateRoute;
