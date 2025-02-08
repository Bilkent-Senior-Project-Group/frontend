// src/pages/HomePage.jsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  InputAdornment,
  styled
} from '@mui/material';

// Styled components
const SearchButton = styled(Button)(({ theme }) => ({
  height: '100%',
  padding: '12px 24px',
  marginLeft: theme.spacing(1),
  fontSize: '1.1rem',
}));

const HomePage = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Box 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default',
        pt: 8
      }}
    >
      <Container maxWidth="md">
        <Box 
          sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 2
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Find Companies by searching the description that you want.
          </Typography>
          
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Enter skills, projects, company name etc.
          </Typography>

          <Paper 
            elevation={3}
            sx={{ 
              p: 0.5,
              display: 'flex',
              width: '100%',
              maxWidth: 600,
              mt: 3,
              mb: 3
            }}
          >
            <TextField
              fullWidth
              placeholder="What are you looking for?"
              variant="outlined"
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { border: 'none' },
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <SearchButton 
              variant="contained" 
              color="primary"
            >
              Search
            </SearchButton>
          </Paper>

          <Typography variant="body1" color="text.secondary">
            You can enter a plain text, the results will be inferred from the text.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;