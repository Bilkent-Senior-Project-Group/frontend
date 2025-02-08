import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import RootLayout from '../layouts/RootLayout';

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();  // Assume AuthContext provides this

  // return currentUser ? <Sidebar>{children}</Sidebar> : <Navigate to="/" />;  //düzeltilecekk
  return <RootLayout>{children}</RootLayout>;
};

export default PrivateRoute;
