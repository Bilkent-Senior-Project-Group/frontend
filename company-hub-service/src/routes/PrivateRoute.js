import React from 'react';
import { Navigate } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const {token, loading} = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a proper loading component
  }

  return token ? <RootLayout>{children}</RootLayout> : <Navigate to="/" />;
};

export default PrivateRoute;
