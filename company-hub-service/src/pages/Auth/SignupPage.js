// src/pages/Auth/SignupPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Alert,
  Stack,
  Link as MuiLink
} from '@mui/material';

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
      setEmail(location.state.email);
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

      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Sign Up
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              required
              variant="outlined"
            />

            <TextField
              fullWidth
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              required
              variant="outlined"
            />

            <TextField
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
              variant="outlined"
            />

            <TextField
              fullWidth
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              variant="outlined"
            />

            <TextField
              fullWidth
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              variant="outlined"
            />

            <TextField
              fullWidth
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
              required
              variant="outlined"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="success"
              sx={{ 
                mt: 2, 
                height: '48px',
                textTransform: 'none'
              }}
            >
              Sign Up
            </Button>
          </Stack>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <MuiLink 
              component={Link} 
              to="/login"
              underline="hover"
              sx={{ color: 'primary.main' }}
            >
              Already have an account?
            </MuiLink>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default SignupPage;