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
import CountryCodeSelector from '../../components/CountryCodeSelector';
import { validatePhoneNumber } from '../../utils/phoneUtils';
import { useAuth } from '../../contexts/AuthContext';
import featureImage from '../../assets/images/feature2.jpg';

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

const SignupPage = () => {
  const location = useLocation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [isInvited, setIsInvited] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    phone: ''
  });
  const { signup } = useAuth();

  // Handle URL search params for email and companyId
  const [companyId, setCompanyId] = useState(null);

  useEffect(() => {
    // Get query parameters from URL
    const queryParams = new URLSearchParams(location.search);
    const emailParam = queryParams.get('email');
    const companyIdParam = queryParams.get('companyId');
    
    // Set email if it exists in query params
    if (emailParam) {
      setEmail(emailParam);
    }
    
    // Set companyId if it exists in query params
    if (companyIdParam) {
      setCompanyId(companyIdParam);
      setIsInvited(true);
    }
  }, [location.search]);

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
    const minLength = password.length >= 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
    return minLength && hasUpperCase && hasLowerCase && hasSymbol;
  };
  
  const validatePhone = (phone) => {
    return validatePhoneNumber(phone);
  };

  const validateEnglishCharactersOnly = (text) => {
    // Regex to match only English letters, numbers, and common symbols
    const englishOnlyRegex = /^[a-zA-Z0-9_.-]*$/;
    return englishOnlyRegex.test(text);
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    
    // Clear previous username validation error when user types
    setValidationErrors(prev => ({
      ...prev,
      username: ''
    }));
    
    // Show validation error immediately if non-English characters are typed
    if (value && !validateEnglishCharactersOnly(value)) {
      setValidationErrors(prev => ({
        ...prev,
        username: 'Username must contain only English characters, numbers, and symbols (_, ., -)'
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setValidationErrors({
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      phone: ''
    });
    setError(null);
    setIsSubmitting(true);
  
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
    
    if (!validateEnglishCharactersOnly(username)) {
      newValidationErrors.username = 'Username must contain only English characters, numbers, and symbols (_, ., -)';
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
      setIsSubmitting(false);
      return;
    }
  
    try {
      const response = await signup({
        firstName,
        lastName,
        email,
        password,
        phone,
        username,
        companyId: companyId ?? null
      });
      
      if (response.success) {
        setSuccess(true);
        setIsSubmitting(false);
        navigate('/waiting-confirm-email');
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        const backendErrors = err.response.data.errors;
        const formattedErrors = {};
        Object.keys(backendErrors).forEach(key => {
          formattedErrors[key.toLowerCase()] = backendErrors[key][0];
        });
        setValidationErrors(formattedErrors);
      } else {
        setError(err.message || 'An error occurred during registration');
      }
      setIsSubmitting(false);
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
              Create your account
            </Typography>
            <Typography variant="body1" align="center" color="text.secondary" mb={4}>
              Fill in the form below to get started
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <Stack spacing={2.5}>
                <TextField
                  fullWidth
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  label="First Name"
                  required
                  variant="outlined"
                  error={!!validationErrors.firstName}
                  helperText={validationErrors.firstName}
                />

                <TextField
                  fullWidth
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  label="Last Name"
                  required
                  variant="outlined"
                  error={!!validationErrors.lastName}
                  helperText={validationErrors.lastName}
                />

                <TextField
                  fullWidth
                  value={username}
                  onChange={handleUsernameChange}
                  label="Username"
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
                  label="Work Email"
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
                  label="Password"
                  required
                  variant="outlined"
                  error={!!validationErrors.password}
                  helperText={validationErrors.password}
                />

                <CountryCodeSelector
                  value={phone}
                  onChange={(value) => setPhone(value)}
                  label="Phone Number"
                  required
                  error={!!validationErrors.phone}
                  helperText={validationErrors.phone}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  sx={{ 
                    mt: 2, 
                    height: '48px',
                    textTransform: 'none',
                    fontWeight: 'bold',
                    fontSize: '1rem'
                  }}
                >
                  {isSubmitting ? 'Creating account...' : 'Sign Up'}
                </Button>
              </Stack>

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <MuiLink 
                    component={Link} 
                    to="/login"
                    underline="hover"
                    sx={{ color: 'primary.main', fontWeight: 'medium' }}
                  >
                    Log in here
                  </MuiLink>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default SignupPage;