// src/pages/Auth/MainPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Divider,
  Stack
} from '@mui/material';

const MainPage = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await AuthService.checkEmailExistence(email);

      if (response.data.exists) {
        navigate('/login', { state: { email } });
      } else {
        navigate('/signup', { state: { email } });
      }
    } catch (error) {
      console.error('Error checking email existence:', error);
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
          Welcome to COMPEDIA
        </Typography>
        
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          We suggest using the email address that you use at work.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
          <TextField
            fullWidth
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            variant="outlined"
            sx={{ mb: 2 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ 
              mb: 3,
              height: '48px',
              textTransform: 'none'
            }}
          >
            Enter with Email
          </Button>

        </Box>
      </Box>
    </Container>
  );
};

export default MainPage;