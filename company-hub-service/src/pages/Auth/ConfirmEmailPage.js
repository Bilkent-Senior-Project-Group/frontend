import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Button, Container, Alert, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { API_URL } from '../../config/apiConfig';
import { useAuth } from '../../contexts/AuthContext';

// Video Background Component - reusing from LoginPage
const VideoBackground = React.memo(({ videoUrl }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        overflow: 'hidden',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark overlay with 40% opacity
          zIndex: 1,
        }
      }}
    >
      <Box
        component="video"
        autoPlay
        muted
        loop
        sx={{
          objectFit: 'cover',
          width: '100%',
          height: '100%',
          position: 'absolute',
        }}
      >
        <source src="/videos/bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </Box>
    </Box>
  );
});

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
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1,
        py: { xs: 6, md: 8 }
      }}
    >
      {/* Video Background */}
      <VideoBackground videoUrl="/videos/bg.mp4" />
      
      {/* Content container */}
      <Container 
        maxWidth="lg" 
        sx={{ 
          position: 'relative', 
          zIndex: 2,
          py: { xs: 4, md: 6 }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            my: { xs: 3, md: 4 }
          }}
        >
          {/* Content card */}
          <Box
            sx={{
              width: { xs: '100%', md: '500px' },
              bgcolor: 'white',
              borderRadius: 2,
              p: 4,
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
              my: { xs: 2, md: 3 },
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              textAlign: 'center'
            }}
          >
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
                    sx={{ mt: 2, height: '48px', textTransform: 'none', width: '100%' }}
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
                    sx={{ mt: 2, height: '48px', textTransform: 'none', width: '100%' }}
                  >
                    Return to Homepage
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ConfirmEmailPage;