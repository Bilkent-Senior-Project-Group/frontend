import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthService from '../services/AuthService';
import './SignupPage.css';

const SignupPage = () => {
  const location = useLocation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email); // Pre-fill email from state
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await AuthService.signup({ 
        firstName, 
        lastName, 
        email,
        password,
        phone,
        username
      });
  
      if (!response.status || response.status !== 200) {
        setError(response);
        return;
      }
  
      navigate('/login'); // Redirect to login page on successful signup
    } catch (err) {
      setError(err.message);
    }
  };

  const h1Style = {
    marginTop: '100px',
    marginBottom: '20px',
    fontSize: '24px',
    color: '#333',
  };

  return (
    <div className="signup-container">
      <p style={h1Style}>Sign Up</p>
      <form className="signup-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
          required
        />
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
          required
        />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
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
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone Number"
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      {error && <p className="signup-error">{error}</p>}

      {/* Additional link for "Already have an account?" */}
      <div className="additional-links">
        <a href="/login">Already have an account?</a>
      </div>
    </div>
  );
};

export default SignupPage;
