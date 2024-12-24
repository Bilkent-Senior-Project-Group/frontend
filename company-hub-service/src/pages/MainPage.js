import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import './MainPage.css'; // Add the CSS file import

const MainPage = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await AuthService.checkEmailExistence(email);

      if (response.data.exists) {
        // If email exists, redirect to login page with email pre-filled
        navigate('/login', { state: { email } });
      } else {
        // If email does not exist, redirect to signup page with email pre-filled
        navigate('/signup', { state: { email } });
      }
    } catch (error) {
      console.error('Error checking email existence:', error);
    }
  };

  const h1style = {
    marginBottom: '10px',
    fontSize: '24px',
  };

  const pStyle = {
    fontSize: '16px',
    color: '#555',
    marginBottom: '30px',
  };

  const inputStyle = {
    width: '108%', // Adjusted width to ensure it fits properly
    padding: '10px',
    marginBottom: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    fontSize: '16px',
  };

  const buttonStyle = {
    width: '114%', // Adjusted width to ensure it fits properly
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
  };

  const buttonHoverStyle = {
    backgroundColor: '#0056b3',
  };

  return (
    <div className="main-container">
      <p style={h1style}>Welcome to COMPEDIA</p>
      <p style={pStyle}>We suggest using the email address that you use at work.</p>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <input
            style={inputStyle}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          <button
            type="submit"
            style={buttonStyle}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor)}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
          >
            Enter with Email
          </button>
        </form>
        <div className="separator">
          <span>OR</span>
        </div>
        <button className="google-button">Enter with Google</button>
        <button className="linkedin-button">Enter with LinkedIn</button>
      </div>
    </div>
  );
};

export default MainPage;
