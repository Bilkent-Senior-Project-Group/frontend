import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Box, Typography, TextField, Button, Container, Alert, Stack, Link as MuiLink } from '@mui/material';

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
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Login to COMPEDIA
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
          <Stack spacing={2}>
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

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, height: '48px', textTransform: 'none' }}>
              Login
            </Button>
          </Stack>

          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Stack spacing={1}>
              <MuiLink component={Link} to="/forgot-password" underline="hover" sx={{ color: 'primary.main' }}>
                Forgot Password?
              </MuiLink>
              <MuiLink component={Link} to="/signup" underline="hover" sx={{ color: 'primary.main' }}>
                Sign Up
              </MuiLink>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
