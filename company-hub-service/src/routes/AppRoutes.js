
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
import CreateCompanyPage from '../pages/Topbar/CreateCompanyPage';
import CreateProjectPage from '../pages/Topbar/CreateProjectPage';
import PremiumPage from '../pages/Topbar/PremiumPage';
import SupportPage from '../pages/Topbar/SupportPage';
import CompanyPeoplePage from '../pages/Sidebar/CompanyPeoplePage';  
import RootLayout from '../layouts/RootLayout';
import AdminRoute from './AdminRoute';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import SearchResultsPage from '../pages/SearchResultsPage';
import ProjectsPage from '../pages/Sidebar/ProjectsPage';
import Project from '../pages/Sidebar/Projects/Project';
import ProjectRequestsPage from '../pages/Sidebar/Projects/ProjectRequestsPage';
import EditProjectPage from '../pages/Sidebar/Projects/EditProjectPage';
import { useAuth } from '../contexts/AuthContext';


const AppRoutes = () => {

  const {token} = useAuth();

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
        <Route path="/create-company" element={<CreateCompanyPage />} />
        <Route path="/create-project" element={<CreateProjectPage />} />
        <Route path="/premium" element={<PremiumPage />} />
        <Route path="/support" element={<SupportPage />} />

        {/* Company routes */}
        <Route path="/company/:companyName" element={<CompanyPage />} />
        <Route path="/company/people/:companyName" element={<CompanyPeoplePage />} />

        {/* Project routes */}
        <Route path="/company/projects/:companyName" element={<ProjectsPage />} />
        <Route path="/company/projects/:companyName/:projectId" element={<Project />} />
        {/* <Route path="/company/projects/project-requests/:companyName" element={<Project />} /> */}
        <Route path="/company/projects/project-requests" element={<ProjectRequestsPage />} />
        {/* <Route path="/company/projects/edit-project/:projectId" element={<EditProjectPage />} /> */}
        <Route path="/company/projects/edit-project" element={<EditProjectPage />} />

        {/* Admin Routes */}
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