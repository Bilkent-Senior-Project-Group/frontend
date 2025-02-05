import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from '../pages/Auth/MainPage';
import HomePage from '../pages/Sidebar/HomePage';
import LoginPage from '../pages/Auth/LoginPage';
import SignupPage from '../pages/Auth/SignupPage';
import ForgotPasswordPage from '../pages/Auth/ForgotPasswordPage';
import PrivateRoute from './PrivateRoute'; // For authenticated routes

import DiscoverPage from '../pages/Sidebar/DiscoverPage';
import SettingsPage from '../pages/Sidebar/SettingsPage';
import CompanyPage from '../pages/Sidebar/CompanyPage';
import ProfilePage from '../pages/Topbar/ProfilePage';

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
        <Route path="/discover" element={<PrivateRoute> <DiscoverPage/> </PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute> <SettingsPage/> </PrivateRoute>} />
        <Route path="/company" element={<PrivateRoute> <CompanyPage/> </PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute> <ProfilePage/> </PrivateRoute>} />
        
      </Routes>
    </Router>
  );
};

export default AppRoutes;
