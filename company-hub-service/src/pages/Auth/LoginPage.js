import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Box, Typography, TextField, Button, Container, Alert, Stack, Link as MuiLink } from '@mui/material';

// Video Background Component - reusing from HomePage
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

const LoginPage = () => {
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);

    if (!result.success) {
      setError(result.message);
    } else {
      navigate('/homepage');
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
              Login to COMPEDIA
            </Typography>
            <Typography variant="body1" align="center" color="text.secondary" mb={4}>
              Enter your credentials to access your account
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

                <TextField
                  fullWidth
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  label="Password"
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
                  Login
                </Button>
              </Stack>

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Stack spacing={2}>
                  <Typography variant="body2" color="text.secondary">
                    <MuiLink 
                      component={Link} 
                      to="/forgot-password" 
                      underline="hover" 
                      sx={{ color: 'primary.main', fontWeight: 'medium' }}
                    >
                      Forgot Password?
                    </MuiLink>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Don't have an account?{' '}
                    <MuiLink 
                      component={Link} 
                      to="/signup" 
                      underline="hover" 
                      sx={{ color: 'primary.main', fontWeight: 'medium' }}
                    >
                      Sign up here
                    </MuiLink>
                  </Typography>
                </Stack>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;
