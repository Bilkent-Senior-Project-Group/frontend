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
  Chip,
  CircularProgress,
  Rating,
  Divider
} from '@mui/material';
import { Search, MapPin, Users, Building } from 'lucide-react';
import { colors } from '../../theme/theme';
import { useNavigate } from 'react-router-dom';
import CompanyService from '../../services/CompanyService';
import { useAuth } from "../../contexts/AuthContext";

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredCompanies, setFeaturedCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  //will be commented out
  useEffect(() => {
    console.log("User Info:", user || "No user found");
  }, [user]);

  useEffect(() => {
    // Fetch featured companies when component mounts
    fetchFeaturedCompanies();
  }, []);

  const fetchFeaturedCompanies = async () => {
    try {
      setLoading(true);
      // Use the service method instead of direct fetch
      const companies = await CompanyService.getFeaturedCompanies();
      console.log("Companies fetched:", companies); // Log for debugging
      setFeaturedCompanies(companies);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch featured companies:", err);
      setError(err.message || "Failed to load featured companies. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search logic
    if (searchQuery.trim()) {
      navigate(`/search-results?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Function to display company specialties as chips
  const renderSpecialties = (specialtiesString) => {
    if (!specialtiesString) return null;
    
    // Split the specialties string into an array
    const specialties = specialtiesString.split(',').map(s => s.trim()).filter(s => s);
    
    return (
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
        {specialties.slice(0, 3).map((specialty, index) => (
          <Chip 
            key={index} 
            label={specialty} 
            size="small" 
            sx={{ 
              bgcolor: colors.primary[600],
              color: 'white',
              borderRadius: '16px'
            }} 
          />
        ))}
        {specialties.length > 3 && (
          <Chip 
            label={`+${specialties.length - 3} more`} 
            size="small" 
            variant="outlined" 
            sx={{ borderRadius: '16px' }}
          />
        )}
      </Box>
    );
  };

  // Function to get company size as a readable string
  const getCompanySizeText = (size) => {
    if (!size) return 'Unknown size';
    
    return size;
  };

  // Function to get first two letters for logo placeholder
  const getNameInitials = (name) => {
    if (!name) return '??';
    const words = name.split(' ');
    if (words.length === 1) {
      return name.substring(0, 2).toUpperCase();
    }
    return (words[0].charAt(0) + (words[1] ? words[1].charAt(0) : words[0].charAt(1))).toUpperCase();
  };

  // Generate random rating for demo purposes (remove in production)
  const getRandomRating = () => {
    return (Math.random() * 2 + 3).toFixed(1); // Random rating between 3.0 and 5.0
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
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center">{error}</Typography>
        ) : featuredCompanies.length === 0 ? (
          <Typography align="center" sx={{ py: 4, color: colors.neutral[600] }}>
            No featured companies available at this time.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {featuredCompanies.map((company) => (
              <Grid item xs={12} md={4} key={company.CompanyId}>
                <Card 
                  elevation={2}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                      cursor: 'pointer'
                    },
                  }}
                  onClick={() => navigate(`/company/${company.Name.replace(/\s+/g, '')}`)}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: 2,
                          backgroundColor: colors.primary[100],
                          color: colors.primary[700],
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2,
                          fontWeight: 'bold',
                          fontSize: '1.2rem',
                          flexShrink: 0
                        }}
                      >
                        {getNameInitials(company.Name)}
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" gutterBottom>
                          {company.Name || 'Unnamed Company'}
                        </Typography>
                        
                        {/* Display rating */}
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Rating 
                            value={parseFloat(getRandomRating())} 
                            precision={0.1} 
                            readOnly 
                            size="small" 
                          />
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            {getRandomRating()}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    {/* Location */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <MapPin size={16} color={colors.neutral[500]} />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {company.Location || 'Location not specified'}
                      </Typography>
                    </Box>
                    
                    {/* Company Size */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Users size={16} color={colors.neutral[500]} />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        {getCompanySizeText(company.CompanySize)}
                      </Typography>
                    </Box>
                    
                    {/* Founded Year */}
                    {company.FoundedYear > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Building size={16} color={colors.neutral[500]} />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          Founded: {company.FoundedYear}
                        </Typography>
                      </Box>
                    )}
                    
                    {company.Description && (
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        paragraph
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          minHeight: '40px',
                          mb: 2
                        }}
                      >
                        {company.Description}
                      </Typography>
                    )}

                    {renderSpecialties(company.Specialties)}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default HomePage;