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
  CircularProgress,
  Drawer,
  IconButton,
  Checkbox,
  Tabs,
  Tab,
  alpha,
  Badge
} from '@mui/material';
import { Search, Filter, MapPin, X } from 'lucide-react';
import { colors } from '../theme/theme';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL, SEARCH_API_URL } from '../config/apiConfig';

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Filter state
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedLocationIds, setSelectedLocationIds] = useState([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [serviceNames, setServiceNames] = useState({});
  
  // Filter drawer state
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [servicesByIndustry, setServicesByIndustry] = useState([]);
  const [activeIndustryTab, setActiveIndustryTab] = useState(0);
  const [locationQuery, setLocationQuery] = useState('');
  const [locationResults, setLocationResults] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  const [displayedQuery, setDisplayedQuery] = useState('');

  // Helper function to parse service names from various formats
  const parseServiceNames = (services) => {
    if (!services || !Array.isArray(services) || services.length === 0) {
      return [];
    }

    // Check if we have a string representation of a list in the first element
    if (services.length === 1 && typeof services[0] === 'string') {
      const firstItem = services[0];
      
      // If it looks like a string representation of a list
      if (firstItem.startsWith('[') && firstItem.endsWith(']')) {
        try {
          // Safely parse the string as a JSON array
          const parsed = JSON.parse(firstItem.replace(/'/g, '"'));
          if (Array.isArray(parsed)) {
            return parsed;
          }
        } catch (e) {
          // If parsing fails, try a simple string split approach
          const cleanString = firstItem
            .replace(/^\[|\]$/g, '')  // Remove opening and closing brackets
            .replace(/'/g, '')        // Remove single quotes
            .split(',')               // Split by commas
            .map(item => item.trim()); // Trim whitespace
          
          return cleanString;
        }
      }
    }
    
    // If all else fails, return the original array
    return services;
  };

  // Track active filters count for badge
  const getActiveFiltersCount = () => {
    return selectedLocationIds.length + selectedServiceIds.length;
  };

  // Parse query parameters on load
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const currentQuery = queryParams.get('q') || '';
    setSearchQuery(currentQuery);
    setDisplayedQuery(currentQuery);
    
    // Parse locations from URL
    const locationParam = queryParams.get('loc');
    let locations = [];
    let locationIds = [];
    
    if (locationParam) {
      const locationItems = locationParam.split('|');
      
      locationItems.forEach(item => {
        const [displayName, id] = item.split(':');
        if (displayName && id) {
          locations.push(displayName);
          locationIds.push(parseInt(id, 10));
        }
      });
    }
    
    setSelectedLocations(locations);
    setSelectedLocationIds(locationIds);
    
    // Parse service IDs from URL
    const serviceParam = queryParams.get('srv');
    const serviceIds = serviceParam ? serviceParam.split(',') : [];
    setSelectedServiceIds(serviceIds);
    
    // Fetch all necessary data
    fetchInitialData(currentQuery, locationIds, serviceIds);
  }, [location.search]);

  // Fetch initial data
  const fetchInitialData = async (query, locationIds, serviceIds) => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch services for filter panel
      const servicesResponse = await axios.get(`${API_URL}/api/Company/GetAllServices`);
      
      // Process services data
      const grouped = servicesResponse.data.map(group => ({
        industry: group[0].industry.name,
        services: group.map(s => ({ id: s.id, name: s.name })),
      }));
      setServicesByIndustry(grouped);
      
      // Build a map of service IDs to names
      const serviceNamesMap = {};
      grouped.forEach(group => {
        group.services.forEach(service => {
          serviceNamesMap[service.id] = service.name;
        });
      });
      setServiceNames(serviceNamesMap);
      
      // Build search payload
      const searchPayload = {
        searchQuery: query,
        locations: locationIds?.length > 0 ? locationIds : null,
        serviceIds: serviceIds?.length > 0 ? serviceIds : null
      };
      
      console.log("Search payload:", searchPayload);
      
      // Execute search 
      const searchResponse = await axios.post(`${SEARCH_API_URL}/search`, searchPayload);
      
      // Process search results
      setCompanies(searchResponse.data.results || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load results. Please try again.');
    }
    
    setLoading(false);
  };

  // Submit search with current filters
  const handleSearch = (e) => {
    e.preventDefault();
    
    // Update the displayed query when search is submitted
    setDisplayedQuery(searchQuery);
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.set('q', searchQuery);
    
    if (selectedLocations.length > 0) {
      // Store both the display name and ID for each location
      const locationParams = selectedLocations.map((loc, index) => 
        `${loc}:${selectedLocationIds[index]}`
      );
      queryParams.set('loc', locationParams.join('|'));
    }
    
    if (selectedServiceIds.length > 0) {
      queryParams.set('srv', selectedServiceIds.join(','));
    }
    
    // Navigate with updated parameters
    navigate(`/search-results?${queryParams.toString()}`);
  };

  // Location search
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

  const handleRemoveLocation = (index) => {
    const newLocations = [...selectedLocations];
    const newLocationIds = [...selectedLocationIds];
    newLocations.splice(index, 1);
    newLocationIds.splice(index, 1);
    setSelectedLocations(newLocations);
    setSelectedLocationIds(newLocationIds);
  };

  const toggleService = (serviceId) => {
    setSelectedServiceIds(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const clearAllFilters = () => {
    setSelectedLocations([]);
    setSelectedLocationIds([]);
    setSelectedServiceIds([]);
  };

  const applyFilters = () => {
    // Close drawer
    setFilterDrawerOpen(false);
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.set('q', searchQuery);
    
    if (selectedLocations.length > 0) {
      // Store both the display name and ID for each location
      const locationParams = selectedLocations.map((loc, index) => 
        `${loc}:${selectedLocationIds[index]}`
      );
      queryParams.set('loc', locationParams.join('|'));
    }
    
    if (selectedServiceIds.length > 0) {
      queryParams.set('srv', selectedServiceIds.join(','));
    }
    
    // Navigate with updated parameters
    navigate(`/search-results?${queryParams.toString()}`);
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
              mb: 2
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

          {/* Filter chips area */}
          <Box sx={{ maxWidth: 600, mx: 'auto', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Button 
                variant="outlined" 
                startIcon={
                  <Badge badgeContent={getActiveFiltersCount()} color="primary">
                    <Filter size={16} />
                  </Badge>
                }
                onClick={() => setFilterDrawerOpen(true)}
                size="small"
                sx={{ mr: 2, textTransform: 'none' }}
              >
                Filters
              </Button>
              
              {getActiveFiltersCount() > 0 && (
                <Button 
                  variant="text" 
                  size="small" 
                  onClick={clearAllFilters}
                  sx={{ textTransform: 'none', color: colors.neutral[600] }}
                >
                  Clear all
                </Button>
              )}
            </Box>

            {/* Active filter chips */}
            {(selectedLocations.length > 0 || selectedServiceIds.length > 0) && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {/* Location filters */}
                {selectedLocations.length > 0 && (
                  <Box>
                    <Box 
                      component="span" 
                      sx={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        color: colors.neutral[500],
                        backgroundColor: colors.neutral[100],
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        mb: 0
                      }}
                    >
                      Locations
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                      {selectedLocations.map((loc, index) => (
                        <Chip
                          key={`loc-${index}`}
                          label={loc}
                          onDelete={() => handleRemoveLocation(index)}
                          size="small"
                          sx={{ 
                            borderRadius: '16px',
                            bgcolor: alpha(colors.primary[500], 0.1),
                            color: colors.primary[700],
                            '& .MuiChip-deleteIcon': {
                              color: colors.primary[700],
                            },
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
                
                {/* Service filters */}
                {selectedServiceIds.length > 0 && (
                  <Box>
                    <Box 
                      component="span" 
                      sx={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        color: colors.neutral[500],
                        backgroundColor: colors.neutral[100],
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        mb: 0
                      }}
                    >
                      Services
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                      {selectedServiceIds.map(id => (
                        <Chip
                          key={`srv-${id}`}
                          label={serviceNames[id] || `Service ${id}`}
                          onDelete={() => toggleService(id)}
                          size="small"
                          sx={{ 
                            borderRadius: '16px',
                            bgcolor: alpha(colors.primary[500], 0.1),
                            color: colors.primary[700],
                            '& .MuiChip-deleteIcon': {
                              color: colors.primary[700],
                            },
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
        Top Companies {displayedQuery && `for "${displayedQuery}"`}
      </Typography>

        {/* Loading state */}
        {loading && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10 }}>
            <CircularProgress size={48} thickness={4} sx={{ color: colors.primary[500], mb: 2 }} />
            <Typography variant="h6" sx={{ color: colors.neutral[700], fontWeight: 500 }}>
              Searching for companies{displayedQuery && ` matching "${displayedQuery}"`}...
            </Typography>
            <Typography variant="body2" sx={{ color: colors.neutral[500], mt: 1 }}>
              Please wait while we find the best matches for you.
            </Typography>
          </Box>
        )}

        {/* Error state */}
        {error && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="error" variant="h6">{error}</Typography>
          </Box>
        )}

        {/* Empty state */}
        {companies.length === 0 && !loading && !error && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: colors.neutral[700], mb: 2 }}>
              No companies found
            </Typography>
            <Typography variant="body1" sx={{ color: colors.neutral[600], mb: 3 }}>
              Try adjusting your search criteria or removing some filters.
            </Typography>
            <Button 
              variant="outlined" 
              onClick={clearAllFilters}
              sx={{ mr: 2 }}
            >
              Clear all filters
            </Button>
          </Box>
        )}

        {/* Results */}
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
                        {company.Name || "Unnamed Company"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <MapPin size={14} style={{ marginRight: 4, verticalAlign: 'text-bottom' }} />
                        {company.Location || "Location not specified"}
                      </Typography>
                
                      {/* Services Display - WITH FIX */}
                      {company.Services && company.Services.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {parseServiceNames(company.Services).map((service, index) => (
                              <Chip 
                                key={`${service}-${index}`} 
                                label={service} 
                                size="small"
                                sx={{ 
                                  bgcolor: alpha(colors.primary[500], 0.1),
                                  color: colors.primary[700],
                                  fontWeight: 500,
                                  borderRadius: '16px',
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                      )}
                      
                      {/* Specialties if available */}
                      {company.Specialties && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
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
                          {Math.round((company.Distance / 2) * 100)}%
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

      {/* Filter Drawer */}
      <Drawer
        anchor="right"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 450 },
            p: 3,
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6" fontWeight={600}>
            Filters
          </Typography>
          <IconButton onClick={() => setFilterDrawerOpen(false)}>
            <X size={20} />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Location Filter */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Location
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for a location..."
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
            sx={{ mb: 2 }}
          />
          
          {locationResults.length > 0 && (
            <Paper elevation={1} sx={{ mb: 2, maxHeight: 200, overflowY: 'auto' }}>
              {locationResults.map((loc) => (
                <Box
                  key={loc.id}
                  sx={{ 
                    px: 2, 
                    py: 1.5, 
                    cursor: 'pointer', 
                    '&:hover': { backgroundColor: alpha(colors.primary[500], 0.05) },
                    borderBottom: `1px solid ${colors.neutral[200]}`,
                    '&:last-child': { borderBottom: 'none' }
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
                key={`drawer-loc-${index}`}
                label={loc}
                onDelete={() => handleRemoveLocation(index)}
                sx={{ 
                  mb: 1,
                  borderRadius: '16px',
                  bgcolor: alpha(colors.primary[500], 0.1),
                  color: colors.primary[700]
                }}
              />
            ))}
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Services Filter */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Services
          </Typography>
          
          <Tabs
            value={activeIndustryTab}
            onChange={(e, newValue) => setActiveIndustryTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ mb: 2 }}
          >
            {servicesByIndustry.map((group, index) => (
              <Tab key={index} label={group.industry} />
            ))}
          </Tabs>

          {servicesByIndustry.length > 0 && activeIndustryTab < servicesByIndustry.length && (
            <Box sx={{ maxHeight: '300px', overflowY: 'auto' }}>
              <Grid container spacing={1}>
                {servicesByIndustry[activeIndustryTab].services.map((service) => {
                  const isSelected = selectedServiceIds.includes(service.id);
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
                            ? alpha(colors.primary[500], 0.1)
                            : 'background.paper',
                          border: '1px solid',
                          borderColor: isSelected ? colors.primary[500] : colors.neutral[300],
                          borderRadius: 1,
                          '&:hover': {
                            bgcolor: isSelected 
                              ? alpha(colors.primary[500], 0.15)
                              : alpha(colors.primary[500], 0.05),
                          },
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
                          color={isSelected ? colors.primary[700] : 'text.primary'}
                          sx={{ fontSize: '0.85rem' }}
                        >
                          {service.name}
                        </Typography>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          )}
        </Box>

        <Box sx={{ mt: 'auto', pt: 3, borderTop: `1px solid ${colors.neutral[200]}` }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={clearAllFilters}
            sx={{ mb: 2 }}
          >
            Clear all filters
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={applyFilters}
          >
            Apply filters
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
};

export default SearchResultsPage;