// src/App.js
import React from 'react';
import { Box } from '@mui/material';
import AppRoutes from './routes/AppRoutes';
import AuthProvider from './contexts/AuthContext';
import RootLayout from './layouts/RootLayout';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;