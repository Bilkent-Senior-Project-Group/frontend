
// src/routes/AppRoutes.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainPage from '../pages/Auth/MainPage';
import HomePage from '../pages/Sidebar/HomePage';
import LoginPage from '../pages/Auth/LoginPage';
import SignupPage from '../pages/Auth/SignupPage';
import ForgotPasswordPage from '../pages/Auth/ForgotPasswordPage';
import PrivateRoute from './PrivateRoute';
import DiscoverPage from '../pages/Sidebar/DiscoverPage';
import SettingsPage from '../pages/Sidebar/SettingsPage';
import CompanyPage from '../pages/Sidebar/CompanyPage';
import AddCompanyPage from '../pages/Topbar/AddCompanyPage';
import AddProjectPage from '../pages/Topbar/AddProjectPage';
import PremiumPage from '../pages/Topbar/PremiumPage';
import SupportPage from '../pages/Topbar/SupportPage';
import CompanyPeoplePage from '../pages/Sidebar/CompanyPeoplePage';  
import RootLayout from '../layouts/RootLayout';
import AdminRoute from './AdminRoute';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import SearchResultsPage from '../pages/SearchResultsPage';


const AppRoutes = () => {

  const token = localStorage.getItem("token");

  return (
    <Routes>
      {/* Public routes */}
      {/* <Route path="/" element={<MainPage />} /> */}
      <Route path="/" element={token ? <Navigate to="/home" replace /> : <MainPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected routes with sidebar */}
      <Route element={<PrivateRoute><RootLayout /></PrivateRoute>}>
        {/* <Route index element={<Navigate to="/home" replace />} /> */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/search-results" element={<SearchResultsPage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/add-company" element={<AddCompanyPage />} />
        <Route path="/add-project" element={<AddProjectPage />} />
        <Route path="/premium" element={<PremiumPage />} />
        <Route path="/support" element={<SupportPage />} />
        {/* Company routes */}
        <Route path="/company/:id/profile" element={<CompanyPage />} />
        <Route path="/company/:id/people" element={<CompanyPeoplePage />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

      </Route>

      {/* Redirect root to home */}
      {/* <Route path="/" element={<Navigate to="/home" replace />} /> */}
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};

export default AppRoutes;