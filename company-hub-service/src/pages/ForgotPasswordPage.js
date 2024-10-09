import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import './ForgotPasswordPage.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await AuthService.forgotPassword(email); // Assuming AuthService has a method for this
      setMessage('Password reset link sent to your email.'); // Set success message
      setTimeout(() => {
        navigate('/login'); // Redirect to login page after a delay
      }, 3000); // Redirect after 3 seconds
    } catch (err) {
      setError('Error sending password reset link. Please try again.');
    }
  };

  const h1Style = {
    marginTop: '100px',
    marginBottom: '20px',
    fontSize: '24px',
    color: '#333',
  };

  return (
    <div className="forgot-password-container">
      <h1 style={h1Style}>Forgot Password</h1>
      <form className="forgot-password-form" onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <button type="submit">Send Reset Link</button>
      </form>

      {/* Display messages */}
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ForgotPasswordPage;
