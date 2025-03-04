import React from 'react';
import { Navigate } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  return token ? <RootLayout>{children}</RootLayout> : <Navigate to="/" />;
};

export default PrivateRoute;
