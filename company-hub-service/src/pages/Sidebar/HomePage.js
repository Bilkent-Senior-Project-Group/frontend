import React, {useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import { Search } from 'lucide-react';
import { colors } from '../../theme/theme';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  //will be commented out
  // Log user info when the homepage loads
  useEffect(() => {
    const user = localStorage.getItem("user"); // Retrieve user data from localStorage
    if (user) {
      console.log("User Info:", JSON.parse(user)); // Parse and log it
    } else {
      console.log("No user found in localStorage");
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search logic
    if (searchQuery.trim()) {
      navigate(`/search-results?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{ 
          background: `linear-gradient(45deg, ${colors.primary[700]} 30%, ${colors.primary[500]} 90%)`,
          color: 'white',
          py: 8,
          mb: 6
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ maxWidth: 800, mx: 'auto', textAlign: 'center' }}>
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                mb: 3,
                color: 'white'
              }}
            >
              Find Companies by searching the description that you want
            </Typography>
            
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 4,
                color: colors.neutral[100],
                fontWeight: 400
              }}
            >
              Enter skills, projects, company name etc.
            </Typography>

            <Paper
              component="form"
              onSubmit={handleSearch}
              elevation={3}
              sx={{
                p: '4px',
                display: 'flex',
                alignItems: 'center',
                maxWidth: 600,
                mx: 'auto',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
              }}
            >
              <TextField
                fullWidth
                placeholder="What are you looking for?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { border: 'none' },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color={colors.neutral[400]} />
                    </InputAdornment>
                  ),
                }}
              />
              <Button 
                variant="contained" 
                size="large"
                type="submit"
                sx={{
                  px: 4,
                  py: 1.5,
                }}
              >
                Search
              </Button>
            </Paper>

            <Typography 
              variant="body1" 
              sx={{ 
                mt: 2,
                color: colors.neutral[200]
              }}
            >
              You can enter a plain text, the results will be inferred from the text.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Featured Companies Section */}
      <Container maxWidth="lg">
        <Typography 
          variant="h4" 
          sx={{ 
            mb: 4,
            fontWeight: 600,
            color: colors.neutral[800]
          }}
        >
          Featured Companies
        </Typography>
        
        <Grid container spacing={3}>
          {[1, 2, 3].map((company) => (
            <Grid item xs={12} md={4} key={company}>
              <Card 
                elevation={1}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    borderColor: colors.primary[200],
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: 2,
                        backgroundColor: colors.neutral[100],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2
                      }}
                    >
                      Logo
                    </Box>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Company {company}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Location • Size
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Brief description of the company and what they do...
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip label="Technology" size="small" />
                    <Chip label="AI" size="small" />
                    <Chip label="Software" size="small" />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;