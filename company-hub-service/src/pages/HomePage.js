// src/pages/HomePage.jsx

import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './HomePage.css'; // Import HomePage styles if needed

const HomePage = () => {
  const { currentUser, logout } = useAuth(); // Getting current user from AuthContext
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to main page after logging out
  };

  return (
        <div className='homepage-content'>
          <h1>Welcome to the Home Page</h1>
          {currentUser ? (
            <div>
              <p>Hello, {`${currentUser.firstName} ${currentUser.lastName}`}!</p>
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div>
              <p>This is due to an error !!!!</p>
            </div>
          )}
        </div>
  );
};

export default HomePage;
