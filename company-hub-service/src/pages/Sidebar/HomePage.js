import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Chip,
  TextField,
  InputAdornment,
  Button,
  Paper,
  CircularProgress,
  Tabs,
  Tab,
  FormControlLabel,
  Checkbox,
  Card,
  CardContent,
  Divider,
  IconButton,
  alpha
} from '@mui/material';
import { Search, MapPin, Filter, ChevronDown, CheckCircle } from 'lucide-react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import { API_URL } from '../../config/apiConfig';
import { useNavigate } from 'react-router-dom';

const FilterSearchPage = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [locationResults, setLocationResults] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedLocationIds, setSelectedLocationIds] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [activeIndustryTab, setActiveIndustryTab] = useState(0);
  const [servicesByIndustry, setServicesByIndustry] = useState([]);
  const [showServicePanel, setShowServicePanel] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/Company/GetAllServices`);
        
        const grouped = res.data.map(group => ({
          industry: group[0].industry.name,
          services: group.map(s => ({ id: s.id, name: s.name })),
        }));
        setServicesByIndustry(grouped);
      } catch (err) {
        console.error('Failed to fetch services', err);
      }
    };

    fetchServices();
  }, []);

  // Location search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (locationQuery.length >= 2) {
        searchLocations(locationQuery);
      } else {
        setLocationResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [locationQuery]);

  const searchLocations = async (query) => {
    if (query.length < 2) return;
    
    setLoadingLocations(true);
    try {
      const response = await axios.get(`${API_URL}/api/Company/LocationSearch?term=${query}`);
      setLocationResults(response.data);
    } catch (error) {
      console.error('Error searching locations', error);
      setLocationResults([]);
    } finally {
      setLoadingLocations(false);
    }
  };

  const handleAddLocation = (location) => {
    const locationString = `${location.city}, ${location.country}`;
    if (!selectedLocations.includes(locationString)) {
      setSelectedLocations([...selectedLocations, locationString]);
      setSelectedLocationIds([...selectedLocationIds, location.id]);
    }
    setLocationQuery('');
    setLocationResults([]);
  };

  const toggleService = (serviceId) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSearch = () => {
    // Create the search payload according to FreeTextSearchDTO
    const searchPayload = {
      searchQuery: searchText,
      locations: selectedLocationIds.length > 0 ? selectedLocationIds : null,
      serviceIds: selectedServices.length > 0 ? selectedServices : null
    };

    // Convert to query parameters for the URL
    const queryParams = new URLSearchParams();
    queryParams.set('q', searchText);
    
    // Add locations as comma separated string with display names and IDs
    if (selectedLocations.length > 0) {
      // Store both the display name and ID for each location
      const locationParams = selectedLocations.map((loc, index) => 
        `${loc}:${selectedLocationIds[index]}`
      );
      queryParams.set('loc', locationParams.join('|'));
    }
    
    // Add services as comma separated string
    if (selectedServices.length > 0) {
      queryParams.set('srv', selectedServices.join(','));
    }
    
    // Navigate to the search results page with query parameters
    navigate(`/search-results?${queryParams.toString()}`);
  };

  const getSelectedServiceCount = () => {
    return selectedServices.length;
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      
      <Typography variant="h4" fontWeight={700} gutterBottom color="text.primary">
        Discover the best companies
      </Typography>
      
      {/* Main Card Container */}
      <Card 
        elevation={1} 
        sx={{ 
          mb: 3,
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        {/* Section 1: Keyword Search */}
        <CardContent sx={{ pt: 3, pb: 3 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom color="text.primary">
            What do you need?
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Describe what you're looking for..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} color="#9e9e9e" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.04),
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                  borderWidth: 1,
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                  borderWidth: 2,
                },
              },
            }}
          />
        </CardContent>
        
        <Divider />
        
        {/* Section 2: Location */}
        <CardContent sx={{ pt: 3, pb: 3 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom color="text.primary">
            Where?
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Add a location..."
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MapPin size={20} color="#9e9e9e" />
                </InputAdornment>
              ),
              endAdornment: loadingLocations ? <CircularProgress size={20} /> : null,
            }}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.04),
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                  borderWidth: 1,
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                  borderWidth: 2,
                },
              },
            }}
          />
          
          {locationResults.length > 0 && (
            <Paper elevation={2} sx={{ borderRadius: 1, mb: 2, maxHeight: 150, overflowY: 'auto' }}>
              {locationResults.map((loc) => (
                <Box
                  key={loc.id}
                  sx={{ 
                    px: 2, 
                    py: 1.5, 
                    cursor: 'pointer', 
                    '&:hover': { 
                      backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08)
                    },
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    '&:last-child': {
                      borderBottom: 'none'
                    }
                  }}
                  onClick={() => handleAddLocation(loc)}
                >
                  <Typography variant="body2">{loc.city}, {loc.country}</Typography>
                </Box>
              ))}
            </Paper>
          )}
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {selectedLocations.map((loc, index) => (
              <Chip 
                key={loc} 
                label={loc} 
                onDelete={() => {
                  const newLocations = [...selectedLocations];
                  const newLocationIds = [...selectedLocationIds];
                  newLocations.splice(index, 1);
                  newLocationIds.splice(index, 1);
                  setSelectedLocations(newLocations);
                  setSelectedLocationIds(newLocationIds);
                }} 
                sx={{ 
                  borderRadius: '16px',
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main',
                  fontWeight: 500,
                  '& .MuiChip-deleteIcon': {
                    color: 'primary.main',
                    '&:hover': {
                      color: 'primary.dark',
                    },
                  },
                }}
              />
            ))}
          </Box>
        </CardContent>
        
        <Divider />
        
        {/* Section 3: Services */}
        <CardContent sx={{ pt: 3, pb: 3 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              cursor: 'pointer',
              mb: showServicePanel ? 2 : 0
            }}
            onClick={() => setShowServicePanel(!showServicePanel)}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                Services
              </Typography>
              {getSelectedServiceCount() > 0 && (
                <Chip
                  size="small"
                  label={`${getSelectedServiceCount()} selected`}
                  sx={{ 
                    ml: 1.5, 
                    height: 24, 
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                    color: 'primary.main',
                    fontWeight: 500,
                  }}
                />
              )}
            </Box>
            <IconButton 
              size="small"
              sx={{
                transition: 'transform 0.2s',
                transform: showServicePanel ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </Box>

          {showServicePanel && (
            <Box>
              <Tabs
                value={activeIndustryTab}
                onChange={(e, newValue) => setActiveIndustryTab(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  mb: 2,
                  minHeight: '44px',
                  '& .MuiTabs-indicator': {
                    height: 3,
                    borderRadius: '3px 3px 0 0',
                  },
                  '& .MuiTab-root': {
                    minHeight: '44px',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    px: 2,
                  },
                }}
              >
                {servicesByIndustry.map((group, index) => (
                  <Tab key={index} label={group.industry} />
                ))}
              </Tabs>

              {servicesByIndustry.length > 0 && activeIndustryTab < servicesByIndustry.length && (
                <Paper 
                  elevation={0} 
                  sx={{ 
                    maxHeight: '200px', 
                    overflowY: 'auto', 
                    p: 1,
                    bgcolor: (theme) => alpha(theme.palette.background.paper, 0.5),
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                  }}
                >
                  <Grid container spacing={1}>
                    {servicesByIndustry[activeIndustryTab].services.map((service) => {
                      const isSelected = selectedServices.includes(service.id);
                      return (
                        <Grid item xs={6} key={service.id}>
                          <Paper
                            elevation={0}
                            onClick={() => toggleService(service.id)}
                            sx={{
                              p: 1,
                              display: 'flex',
                              alignItems: 'center',
                              cursor: 'pointer',
                              bgcolor: isSelected 
                                ? (theme) => alpha(theme.palette.primary.main, 0.1) 
                                : 'background.paper',
                              border: '1px solid',
                              borderColor: isSelected ? 'primary.main' : 'divider',
                              borderRadius: 1,
                              '&:hover': {
                                bgcolor: isSelected 
                                  ? (theme) => alpha(theme.palette.primary.main, 0.15) 
                                  : (theme) => alpha(theme.palette.primary.main, 0.05),
                              },
                              transition: 'all 0.2s',
                            }}
                          >
                            <Checkbox
                              checked={isSelected}
                              color="primary"
                              size="small"
                              sx={{ p: 0.5, mr: 1 }}
                            />
                            <Typography
                              variant="body2"
                              fontWeight={isSelected ? 600 : 400}
                              color={isSelected ? 'primary.main' : 'text.primary'}
                              sx={{ fontSize: '0.85rem' }}
                            >
                              {service.name}
                            </Typography>
                          </Paper>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Paper>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Search Button */}
      <Button
        variant="contained"
        size="large"
        fullWidth
        disabled={!searchText && selectedLocations.length === 0 && selectedServices.length === 0}
        sx={{
          py: 1.5,
          fontSize: '1rem',
          fontWeight: 600,
          borderRadius: 2,
          boxShadow: 2,
          '&:hover': {
            boxShadow: 4,
          },
          textTransform: 'none',
          opacity: (!searchText && selectedLocations.length === 0 && selectedServices.length === 0) ? 0.7 : 1,
        }}
        onClick={handleSearch}
      >
        Show matching providers
      </Button>
    </Container>
  );
};

export default FilterSearchPage;