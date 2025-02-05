import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../layouts/Sidebar';

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();  // Assume AuthContext provides this

  // return currentUser ? <Sidebar>{children}</Sidebar> : <Navigate to="/" />;  //düzeltilecekk
  return <Sidebar>{children}</Sidebar>;
};

export default PrivateRoute;
