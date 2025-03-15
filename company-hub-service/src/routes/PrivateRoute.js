import React from 'react';
import { Navigate } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const {token} = useAuth();

  return token ? <RootLayout>{children}</RootLayout> : <Navigate to="/" />;
};

export default PrivateRoute;
