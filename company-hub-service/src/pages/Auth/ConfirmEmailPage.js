import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Button, Container, Alert, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { API_URL } from '../../config/apiConfig';
import { useAuth } from '../../contexts/AuthContext';

const ConfirmEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  const { user, token } = useAuth();

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const userId = searchParams.get('userId');
        const token = searchParams.get('token');
        
        console.log('userId:', userId);
        console.log('token:', token);
        if (!userId || !token) {
          setStatus('error');
          setMessage('Invalid confirmation link. Missing userId or token.');
          return;
        }

        const response = await axios.post(`${API_URL}/api/Account/ConfirmEmail`, {
          userId,
          token
        }, {
          headers: { "Content-Type": "application/json" }
        });

        if (response.status === 200) {
          setStatus('success');
          setMessage('Your email has been successfully confirmed!');
          
          // Create a custom event that other components can listen for
          const verificationEvent = new CustomEvent('emailVerified', { 
            detail: { verified: true }
          });
          window.dispatchEvent(verificationEvent);
          
          // Simple redirect logic - if logged in, go to home; otherwise go to login
          if (user && token) {
            setTimeout(() => {
              navigate('/home');
            }, 2000);
          } else {
            setTimeout(() => {
              navigate('/login');
            }, 3000);
          }
        } else {
          setStatus('error');
          setMessage('Failed to confirm email. Please try again or contact support.');
        }
      } catch (error) {
        console.error('Email confirmation failed:', error);
        setStatus('error');
        setMessage(error.response?.data?.message || 'An error occurred while confirming your email.');
      }
    };

    confirmEmail();
  }, [searchParams, navigate, user, token]);

  const handleNavigateHome = () => {
    if (user && token) {
      navigate('/home');
    } else {
      navigate('/login');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Email Confirmation
        </Typography>

        <Box sx={{ mt: 4, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {status === 'loading' && (
            <>
              <CircularProgress size={60} sx={{ mb: 3 }} />
              <Typography variant="body1">
                Confirming your email address...
              </Typography>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 3 }} />
              <Alert severity="success" sx={{ mb: 3, width: '100%' }}>
                {message}
              </Alert>
              <Typography variant="body2" sx={{ mb: 3 }}>
                {user && token 
                  ? "You'll be redirected to the homepage in a few seconds..." 
                  : "You will be redirected to the login page in a few seconds..."}
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleNavigateHome}
                sx={{ mt: 2, height: '48px', textTransform: 'none' }}
              >
                {user && token ? "Go to Homepage Now" : "Go to Login Now"}
              </Button>
            </>
          )}

          {status === 'error' && (
            <>
              <ErrorIcon color="error" sx={{ fontSize: 60, mb: 3 }} />
              <Alert severity="error" sx={{ mb: 3, width: '100%' }}>
                {message}
              </Alert>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => navigate('/')}
                sx={{ mt: 2, height: '48px', textTransform: 'none' }}
              >
                Return to Homepage
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default ConfirmEmailPage;