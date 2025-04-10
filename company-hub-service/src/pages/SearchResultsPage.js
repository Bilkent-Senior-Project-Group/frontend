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
  InputLabel,
  CircularProgress,
} from '@mui/material';
import { Search } from 'lucide-react';
import { colors } from '../theme/theme';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios
import { API_URL } from '../config/apiConfig';

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState();
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const currentQuery = queryParams.get('q') || '';
    setSubmittedQuery(currentQuery);
    setSearchQuery(currentQuery); // Keep this if you want to update the input when URL changes
  
    if (!currentQuery) return;
  
    const fetchCompanies = async () => {
      setLoading(true);
      setError(null);
  
      try {
        const response = await axios.get(`${API_URL}/api/Company/FreeTextSearch/${encodeURIComponent(currentQuery)}`);
        console.log('API Response:', response.data);
        setCompanies(response.data.results || []);
      } catch (error) {
        console.error('Error fetching companies:', error);
        setError('Failed to load results.');
      }
  
      setLoading(false);
    };
  
    fetchCompanies();
  }, [location.search]);  
  

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search-results?q=${searchQuery}`);
  };

  return (
    <Box>
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

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
          Top Companies for "{submittedQuery}"
        </Typography>


        {loading && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10 }}>
            <CircularProgress size={48} thickness={4} sx={{ color: colors.primary[500], mb: 2 }} />
            <Typography variant="h6" sx={{ color: colors.neutral[700], fontWeight: 500 }}>
              Searching for companies matching "{submittedQuery}"...
            </Typography>
            <Typography variant="body2" sx={{ color: colors.neutral[500], mt: 1 }}>
              Please wait while we find the best matches for you.
            </Typography>
          </Box>
        )}

        {error && <Typography color="error">{error}</Typography>}

        {companies.length === 0 && !loading && !error && (
          <Typography>No companies found.</Typography>
        )}

        {!loading && companies.length > 0 && (
          <Box>
            {companies.map((company) => (
              <Card
              key={company.CompanyId}
              elevation={1}
              sx={{
                mb: 3,
                borderRadius: 2,
                border: `1px solid ${colors.neutral[200]}`,
                cursor: 'pointer',
                transition: 'transform 0.1s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.01)',
                  boxShadow: 3,
                },
              }}
              onClick={() => navigate(`/company/${encodeURIComponent(company.Name)}`)}
            >
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={9}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {company.Name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {company.Location}
                    </Typography>
            
                    {company.Specialties && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                        {company.Specialties.split(',').map((spec) => (
                          <Chip key={spec.trim()} label={spec.trim()} variant="outlined" size="small" />
                        ))}
                      </Box>
                    )}
                  </Grid>
            
                  <Grid item xs={12} md={3} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                    <Box sx={{ display: 'inline-block', backgroundColor: colors.primary[100], px: 2, py: 1, borderRadius: 2 }}>
                      <Typography variant="caption" sx={{ color: colors.primary[800], fontWeight: 500 }}>
                        Match Score
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {Math.round((company.Distance / 3) * 100)}%
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>          
            
            ))}
          </Box>
          )}
      </Container>
    </Box>
  );
};

export default SearchResultsPage;
