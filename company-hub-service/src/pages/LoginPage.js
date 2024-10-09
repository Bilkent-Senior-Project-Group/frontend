import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AuthService from '../services/AuthService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email); // Pre-fill email from state
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await AuthService.login(email, password);
      login(response.data.user);  // Assuming the response contains user info
      navigate('/homepage'); // Redirect to protected page
    } catch (error) {
      console.error(error);
    }
  };

  const h1Style = {
    marginTop: '100px',
    marginBottom: '20px',
    fontSize: '24px',
    color: '#333',
  };

  return (
    <div className="login-container">
      <h1 style={h1Style}>Login to Company Hub</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
      <div className="additional-links">
        <a href="/forgot-password">Forgot Password?</a><br />
        <a href="/signup">Sign Up</a>
      </div>
    </div>
  );
};

export default LoginPage;
