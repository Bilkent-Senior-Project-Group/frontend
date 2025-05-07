// src/pages/Auth/MainPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Divider,
  Stack,
  Link as MuiLink
} from '@mui/material';

// Video Background Component - reused from LoginPage
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

const MainPage = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await AuthService.checkEmailExistence(email);
      console.log('Email existence:', response);
      if (response.data.isRegistered) {
        navigate('/login', { state: { email } });
      } else {
        navigate('/signup', { state: { email } });
      }
    } catch (error) {
      console.error('Error checking email existence:', error);
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
        py: { xs: 6, md: 8 } // Add padding top and bottom
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
          py: { xs: 4, md: 6 } // Add padding to container
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center', // Center the form
            width: '100%',
            my: { xs: 3, md: 4 } // Add margin top and bottom
          }}
        >
          {/* Form container */}
          <Box
            sx={{
              width: { xs: '100%', md: '450px' },
              bgcolor: 'white',
              borderRadius: 2,
              p: 4,
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
              my: { xs: 2, md: 3 } // Add margin top and bottom
            }}
          >
            <Typography variant="h4" gutterBottom align="center" fontWeight="bold">
              Welcome to COMPEDIA
            </Typography>
            <Typography variant="body1" align="center" color="text.secondary" mb={4}>
              We suggest using the email address that you use at work.
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <Stack spacing={2.5}>
                <TextField
                  fullWidth
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  label="Email"
                  required
                  variant="outlined"
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ 
                    mt: 2, 
                    height: '48px',
                    textTransform: 'none',
                    fontWeight: 'bold',
                    fontSize: '1rem'
                  }}
                >
                  Enter with Email
                </Button>
              </Stack>

              {/* <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Stack spacing={2}>
                  <Typography variant="body2" color="text.secondary">
                    By continuing, you agree to our{' '}
                    <MuiLink 
                      component={Link} 
                      to="/terms" 
                      underline="hover" 
                      sx={{ color: 'primary.main', fontWeight: 'medium' }}
                    >
                      Terms of Service
                    </MuiLink>
                    {' '}and{' '}
                    <MuiLink 
                      component={Link} 
                      to="/privacy" 
                      underline="hover" 
                      sx={{ color: 'primary.main', fontWeight: 'medium' }}
                    >
                      Privacy Policy
                    </MuiLink>
                  </Typography>
                 
                </Stack>
              </Box> */}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default MainPage;