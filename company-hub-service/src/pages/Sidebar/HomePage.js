// src/pages/HomePage.jsx

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa'; // Import search icon
import '../../assets/HomePage.css';

const HomePage = () => {
  const { currentUser, logout } = useAuth(); // Getting current user from AuthContext
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to main page after logging out
  };

  return (
        <div className='homepage-content'>
          <a className='first-p'>Find Companies by searching the description that you want.</a>
          <a className='second-p'>Enter skills, projects, company name etc.</a>
          <div className="search-bar">
                  <input type="text" className='search-bar-text' placeholder="What are you looking for?" />
                  <button className='search-bar-button'><a style={{fontSize:'1.7em'}}>Search</a></button>
          </div>
          <a className='third-p'>You can enter a plain text, the results will be inferred from the text.</a>
          {/* <p>Welcome to the Home Page</p>
          {currentUser ? (
            <div>
              <p>Hello, {`${currentUser.firstName} ${currentUser.lastName}`}!</p>
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div>
              <p>This is due to an error !!!!</p>
            </div>
          )} */}
        </div>
  );
};

export default HomePage;