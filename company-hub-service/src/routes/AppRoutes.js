import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from '../pages/MainPage';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import PrivateRoute from './PrivateRoute'; // For authenticated routes

import AnotherPage from '../pages/AnotherPage'; // Example new page under sidebar

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Routes without Sidebar */}
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected routes*/}
        <Route path="/homepage" element={<PrivateRoute> <HomePage /> </PrivateRoute>} />
        <Route path="/another" element={<PrivateRoute> <AnotherPage /> </PrivateRoute>} />    
      </Routes>
    </Router>
  );
};

export default AppRoutes;
