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
import axios from 'axios'; // Import axios
import { API_URL } from '../config/apiConfig';

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!initialQuery) return;

    const fetchCompanies = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`${API_URL}/api/Company/FreeTextSearch/${encodeURIComponent(initialQuery)}`);

            console.log('API Response:', response.data);

            if (response.data.results) {
                setCompanies(response.data.results);
            } else {
                setCompanies([]);
            }
        } catch (error) {
            console.error('Error fetching companies:', error);
            setError('Failed to load results.');
        }

        setLoading(false);
    };

    fetchCompanies();
}, [initialQuery]);

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
          Top Companies for "{initialQuery}"
        </Typography>

        {loading && <Typography>Loading results...</Typography>}
        {error && <Typography color="error">{error}</Typography>}

        {companies.length === 0 && !loading && !error && (
          <Typography>No companies found.</Typography>
        )}

        <Box>
          {companies.map((company) => (
            <Card key={company.CompanyId} elevation={1} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6">{company.Name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {company.Location} | {company.Size}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {company.Description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default SearchResultsPage;
