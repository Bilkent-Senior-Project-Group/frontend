import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Chip,
  TextField,
  InputAdornment,
  Button,
  Paper,
  Divider,
  Rating,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { Search } from 'lucide-react';
import { colors } from '../theme/theme';
import { useLocation, useNavigate } from 'react-router-dom';

// Mock data for company results
const mockCompanies = [
  {
    id: 1,
    name: 'Naked Development',
    rating: 4.7,
    reviews: 53,
    priceRange: '$150 - $199 / hr',
    teamSize: '10 - 49',
    location: 'Irvine, CA',
    services: ['Mobile App Development', 'UX/UI Design', 'Application Management'],
    description: 'A mobile app development company specializing in delivering custom-built, high-quality mobile applications. With generally positive feedback, over 70% of reviewers commend their attention to detail, project management, and ability to enhance user engagement.',
    verified: true
  },
  {
    id: 2,
    name: 'TechWave Solutions',
    rating: 4.5,
    reviews: 42,
    priceRange: '$100 - $149 / hr',
    teamSize: '50 - 99',
    location: 'San Francisco, CA',
    services: ['Mobile App Development', 'Web Development', 'Cloud Services'],
    description: 'Full-service digital agency focusing on innovative solutions for businesses of all sizes. Known for their collaborative approach and technical expertise in both mobile and web technologies.',
    verified: true
  },
  {
    id: 3,
    name: 'Quantum Code Labs',
    rating: 4.3,
    reviews: 38,
    priceRange: '$200 - $300 / hr',
    teamSize: '10 - 49',
    location: 'Austin, TX',
    services: ['Mobile App Development', 'AI Integration', 'IoT Solutions'],
    description: 'Specializing in cutting-edge mobile applications with AI and IoT integration. Their team excels at creating robust, scalable solutions for complex business challenges.',
    verified: false
  }
];

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [companies, setCompanies] = useState([]);
  const [filters, setFilters] = useState({
    services: '',
    budget: '',
    rate: '',
    industry: ''
  });

  useEffect(() => {
    // In a real app, you would fetch data from your API based on the search query
    // This is just mock data for demonstration
    setCompanies(mockCompanies);
  }, [initialQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search-results?q=${searchQuery}`);
    // In a real app, you would trigger a new search here
  };

  const handleFilterChange = (filter, value) => {
    setFilters({
      ...filters,
      [filter]: value
    });
    // In a real app, you would apply these filters to your search results
  };

  return (
    <Box>
      {/* Search Header */}
      <Box 
        sx={{ 
          backgroundColor: colors.neutral[100],
          py: 4,
          borderBottom: `1px solid ${colors.neutral[300]}`
        }}
      >
        <Container maxWidth="lg">
          <Paper
            component="form"
            onSubmit={handleSearch}
            elevation={1}
            sx={{
              p: '4px',
              display: 'flex',
              alignItems: 'center',
              maxWidth: 600,
              mx: 'auto',
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
        </Container>
      </Box>

      {/* Results Section */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            mb: 1,
            fontWeight: 600,
            color: colors.neutral[800]
          }}
        >
          Top Companies for "{initialQuery}"
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 4,
            color: colors.neutral[600]
          }}
        >
          Found {companies.length} companies matching your search criteria
        </Typography>

        {/* Filters */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Services</InputLabel>
              <Select
                value={filters.services}
                label="Services"
                onChange={(e) => handleFilterChange('services', e.target.value)}
              >
                <MenuItem value="">All Services</MenuItem>
                <MenuItem value="app-development">App Development</MenuItem>
                <MenuItem value="web-development">Web Development</MenuItem>
                <MenuItem value="ui-design">UI/UX Design</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Budget</InputLabel>
              <Select
                value={filters.budget}
                label="Budget"
                onChange={(e) => handleFilterChange('budget', e.target.value)}
              >
                <MenuItem value="">Any Budget</MenuItem>
                <MenuItem value="low">$1K - $10K</MenuItem>
                <MenuItem value="medium">$10K - $50K</MenuItem>
                <MenuItem value="high">$50K+</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Hourly Rate</InputLabel>
              <Select
                value={filters.rate}
                label="Hourly Rate"
                onChange={(e) => handleFilterChange('rate', e.target.value)}
              >
                <MenuItem value="">Any Rate</MenuItem>
                <MenuItem value="low">$25 - $100</MenuItem>
                <MenuItem value="medium">$100 - $200</MenuItem>
                <MenuItem value="high">$200+</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Industry</InputLabel>
              <Select
                value={filters.industry}
                label="Industry"
                onChange={(e) => handleFilterChange('industry', e.target.value)}
              >
                <MenuItem value="">All Industries</MenuItem>
                <MenuItem value="healthcare">Healthcare</MenuItem>
                <MenuItem value="fintech">FinTech</MenuItem>
                <MenuItem value="ecommerce">E-commerce</MenuItem>
                <MenuItem value="education">Education</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Company Listings */}
        <Box>
          {companies.map((company) => (
            <Card 
              key={company.id}
              elevation={1}
              sx={{
                mb: 3,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3,
                },
              }}
            >
              <CardContent>
                <Grid container spacing={2}>
                  {/* Logo and Basic Info */}
                  <Grid item xs={12} md={3}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: 2,
                          backgroundColor: colors.neutral[200],
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2
                        }}
                      >
                        Logo
                      </Box>
                      <Typography variant="h6" gutterBottom>
                        {company.name}
                        {company.verified && (
                          <Chip 
                            label="Verified" 
                            size="small" 
                            color="primary"
                            sx={{ ml: 1, height: 20, fontSize: '0.7rem' }} 
                          />
                        )}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Rating value={company.rating} readOnly size="small" precision={0.1} />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {company.rating} ({company.reviews} reviews)
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {company.priceRange}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {company.teamSize} employees
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {company.location}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  {/* Description and Services */}
                  <Grid item xs={12} md={7}>
                    <Typography variant="body1" paragraph>
                      {company.description}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Services:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {company.services.map((service, index) => (
                        <Chip key={index} label={service} size="small" />
                      ))}
                    </Box>
                  </Grid>
                  
                  {/* Action Buttons */}
                  <Grid item xs={12} md={2}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Button 
                        variant="contained" 
                        fullWidth
                        sx={{ fontWeight: 600 }}
                      >
                        View Profile
                      </Button>
                      <Button 
                        variant="outlined" 
                        fullWidth
                      >
                        Contact
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default SearchResultsPage;