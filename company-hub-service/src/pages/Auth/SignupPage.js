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
  // Add these state variables after your existing useState declarations
  const [validationErrors, setValidationErrors] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    phone: ''
  });

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  const validatePassword = (password) => {
    // At least 6 characters, 1 uppercase, 1 lowercase, 1 symbol
    const minLength = password.length >= 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
    return minLength && hasUpperCase && hasLowerCase && hasSymbol;
  };
  
  const validatePhone = (phone) => {
    const regex = /^\+?[1-9]\d{9,11}$/;
    return regex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset validation errors
    setValidationErrors({
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      phone: ''
    });
    setError(null);
  
    // Validate inputs
    let hasErrors = false;
    const newValidationErrors = {};
  
    if (firstName.length < 2) {
      newValidationErrors.firstName = 'First name must be at least 2 characters';
      hasErrors = true;
    }
  
    if (lastName.length < 2) {
      newValidationErrors.lastName = 'Last name must be at least 2 characters';
      hasErrors = true;
    }
  
    if (username.length < 3) {
      newValidationErrors.username = 'Username must be at least 3 characters';
      hasErrors = true;
    }
  
    if (!validateEmail(email)) {
      newValidationErrors.email = 'Please enter a valid email address';
      hasErrors = true;
    }
  
    if (!validatePassword(password)) {
      newValidationErrors.password = 'Password must be at least 6 characters with 1 uppercase, 1 lowercase, and 1 symbol';
      hasErrors = true;
    }
  
    if (!validatePhone(phone)) {
      newValidationErrors.phone = 'Please enter a valid phone number';
      hasErrors = true;
    }
  
    if (hasErrors) {
      setValidationErrors(newValidationErrors);
      return;
    }
  
    try {
      const response = await AuthService.signup({
        firstName,
        lastName,
        email,
        password,
        phone,
        username
      });
      
      if (response.status === 200) {
        navigate('/login', { 
          state: { 
            message: 'Registration successful! Please login.' 
          }
        });
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        // Handle validation errors from backend
        const backendErrors = err.response.data.errors;
        const formattedErrors = {};
        Object.keys(backendErrors).forEach(key => {
          formattedErrors[key.toLowerCase()] = backendErrors[key][0];
        });
        setValidationErrors(formattedErrors);
      } else {
        setError(err.message || 'An error occurred during registration');
      }
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
            error={!!validationErrors.firstName}
            helperText={validationErrors.firstName}
          />

          <TextField
            fullWidth
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            required
            variant="outlined"
            error={!!validationErrors.lastName}
            helperText={validationErrors.lastName}
          />

          <TextField
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
            variant="outlined"
            error={!!validationErrors.username}
            helperText={validationErrors.username}
          />

          <TextField
            fullWidth
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            variant="outlined"
            error={!!validationErrors.email}
            helperText={validationErrors.email}
          />

          <TextField
            fullWidth
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            variant="outlined"
            error={!!validationErrors.password}
            helperText={validationErrors.password}
          />

          <TextField
            fullWidth
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone Number"
            required
            variant="outlined"
            error={!!validationErrors.phone}
            helperText={validationErrors.phone}
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