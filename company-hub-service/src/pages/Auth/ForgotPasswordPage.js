// src/pages/Auth/ForgotPasswordPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Alert,
  Stack
} from '@mui/material';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await AuthService.forgotPassword(email);
      setMessage('Password reset link sent to your email.');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError('Error sending password reset link. Please try again.');
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
          Forgot Password
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              variant="outlined"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 2, 
                height: '48px',
                textTransform: 'none'
              }}
            >
              Send Reset Link
            </Button>
          </Stack>

          {message && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {message}
            </Alert>
          )}
          
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default ForgotPasswordPage;