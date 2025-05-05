import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  CircularProgress,
  alpha
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { API_URL, SEARCH_API_URL } from '../../config/apiConfig';

const DiscoverPage = () => {
  const [servicesByIndustry, setServicesByIndustry] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [industriesWithCompanies, setIndustriesWithCompanies] = useState({});
  const [loadingCompanies, setLoadingCompanies] = useState({});
  const navigate = useNavigate();

  // Cache keys and configuration
  const SERVICES_CACHE_KEY = 'discover_services_cache';
  const COMPANIES_CACHE_KEY = 'discover_companies_cache';
  const CACHE_EXPIRATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  // Fetch all services grouped by industry
  useEffect(() => {
    fetchServices();
  }, []);

  // When services are loaded, fetch companies for each industry
  useEffect(() => {
    if (servicesByIndustry.length > 0) {
      // Create a cache key based on the services data hash
      const servicesHash = getServicesHash(servicesByIndustry);
      
      // Try to load from cache first
      const cachedCompanies = getCachedCompanies(servicesHash);
      
      if (cachedCompanies) {
        console.log('Using cached companies data');
        setIndustriesWithCompanies(cachedCompanies);
      } else {
        // If no valid cache, fetch fresh data for each industry
        servicesByIndustry.forEach(industry => {
          fetchCompaniesForIndustry(industry, servicesHash);
        });
      }
    }
  }, [servicesByIndustry]);

  // Generate a simple hash for services to check if they've changed
  const getServicesHash = (services) => {
    return services.map(group => 
      `${group.industry}:${group.services.map(s => s.id).sort().join(',')}`
    ).sort().join('|');
  };

  // Get cached services data
  const getCachedServices = () => {
    try {
      const cachedData = localStorage.getItem(SERVICES_CACHE_KEY);
      if (!cachedData) return null;
      
      const { data, timestamp } = JSON.parse(cachedData);
      
      // Check if cache is expired
      if (Date.now() - timestamp > CACHE_EXPIRATION) {
        localStorage.removeItem(SERVICES_CACHE_KEY);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error reading services from localStorage:', error);
      return null;
    }
  };

  // Get cached companies data
  const getCachedCompanies = (servicesHash) => {
    try {
      const cachedData = localStorage.getItem(COMPANIES_CACHE_KEY);
      if (!cachedData) return null;
      
      const { data, timestamp, hash } = JSON.parse(cachedData);
      
      // Check if cache is expired or services have changed
      if (Date.now() - timestamp > CACHE_EXPIRATION || hash !== servicesHash) {
        localStorage.removeItem(COMPANIES_CACHE_KEY);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error reading companies from localStorage:', error);
      return null;
    }
  };

  // Save companies data to cache
  const saveCompaniesToCache = (companiesData, servicesHash) => {
    try {
      localStorage.setItem(COMPANIES_CACHE_KEY, JSON.stringify({
        data: companiesData,
        timestamp: Date.now(),
        hash: servicesHash
      }));
    } catch (error) {
      console.error('Error saving companies to localStorage:', error);
    }
  };

  const fetchServices = async () => {
    setLoadingServices(true);
    
    // Try to get from cache first
    const cachedServices = getCachedServices();
    if (cachedServices) {
      console.log('Using cached services data');
      setServicesByIndustry(cachedServices);
      setLoadingServices(false);
      return;
    }
    
    try {
      const res = await axios.get(`${API_URL}/api/Company/GetAllServices`);
      const grouped = res.data.map(group => ({
        industry: group[0].industry.name,
        services: group.map(s => ({ id: s.id, name: s.name })),
      }));
      
      // Save to cache
      try {
        localStorage.setItem(SERVICES_CACHE_KEY, JSON.stringify({
          data: grouped,
          timestamp: Date.now()
        }));
      } catch (storageError) {
        console.error('Error saving services to localStorage:', storageError);
      }
      
      setServicesByIndustry(grouped);
    } catch (err) {
      console.error('Failed to fetch services', err);
    } finally {
      setLoadingServices(false);
    }
  };

  const fetchCompaniesForIndustry = async (industryGroup, servicesHash) => {
    const industry = industryGroup.industry;
    const serviceIds = industryGroup.services.map(s => s.id);
    
    // Update loading state for this industry
    setLoadingCompanies(prev => ({
      ...prev,
      [industry]: true
    }));

    try {
      // Build search payload
      const searchPayload = {
        searchQuery: "", // Empty query to get all companies for the services
        locations: null, // No location filter
        serviceIds: serviceIds // Filter by services in this industry
      };
      
      console.log(`Fetching companies for industry: ${industry}`, searchPayload);
      
      // Execute search
      const searchResponse = await axios.post(`${SEARCH_API_URL}/search`, searchPayload);
      
      // Get top 4 companies for this industry
      const companies = (searchResponse.data.results || []).slice(0, 4);
      
      console.log(`Found ${companies.length} companies for industry: ${industry}`);
      
      // Update state with companies for this industry
      setIndustriesWithCompanies(prev => {
        const newState = {
          ...prev,
          [industry]: companies
        };
        
        // Save to cache after each industry is loaded
        // This gives partial caching in case the user navigates away before all industries load
        saveCompaniesToCache(newState, servicesHash);
        
        return newState;
      });
    } catch (err) {
      console.error(`Failed to fetch companies for industry: ${industry}`, err);
      // Set empty array on error
      setIndustriesWithCompanies(prev => ({
        ...prev,
        [industry]: []
      }));
    } finally {
      // Update loading state
      setLoadingCompanies(prev => ({
        ...prev,
        [industry]: false
      }));
    }
  };

  const handleViewMore = (serviceIds) => {
    // Join service IDs with commas and encode them
    const query = encodeURIComponent(serviceIds.join(','));
    navigate(`/search-results?q=&srv=${query}`);
  };

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

  return (
    <Box sx={{ p: 3 }}>
      
      {loadingServices ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {servicesByIndustry.map((industryGroup, index) => {
            const industry = industryGroup.industry;
            const serviceIds = industryGroup.services.map(s => s.id);
            const isLoading = loadingCompanies[industry];
            const companies = industriesWithCompanies[industry] || [];

            return (
              <Grid item xs={12} key={index}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {industry}
                    </Typography>

                    {isLoading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress size={30} />
                      </Box>
                    ) : companies.length > 0 ? (
                      <Grid container spacing={2}>
                        {companies.map((company, i) => (
                          <Grid item xs={12} sm={6} md={6} lg={3} key={i}>
                            <Card 
                              variant="outlined" 
                              sx={{ 
                                height: '100%',
                                cursor: 'pointer',
                                transition: 'transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out',
                                '&:hover': {
                                  transform: 'translateY(-4px)',
                                  boxShadow: 3,
                                },
                              }}
                              onClick={() => navigate(`/company/${company.Name.replace(/\s+/g, '')}`)}
                            >
                              <CardContent>
                                <Typography variant="subtitle1" fontWeight="bold">
                                  {company.Name || "Unnamed Company"}
                                </Typography>
                                <Typography variant="body2">
                                  {company.Location || "Location not specified"}
                                </Typography>
                                
                                {/* Services */}
                                {company.Services && company.Services.length > 0 && (
                                  <Box sx={{ mt: 1 }}>
                                    <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>
                                      Services:
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                      {parseServiceNames(company.Services).slice(0, 3).map((service, idx) => (
                                        <Box
                                          key={`${service}-${idx}`}
                                          sx={{
                                            fontSize: '0.75rem',
                                            padding: '2px 8px',
                                            borderRadius: '12px',
                                            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
                                            color: 'primary.main',
                                            display: 'inline-block',
                                            whiteSpace: 'nowrap',
                                          }}
                                        >
                                          {service}
                                        </Box>
                                      ))}
                                      {parseServiceNames(company.Services).length > 3 && (
                                        <Box
                                          sx={{
                                            fontSize: '0.75rem',
                                            padding: '2px 8px',
                                            borderRadius: '12px',
                                            backgroundColor: (theme) => alpha(theme.palette.secondary.main, 0.1),
                                            color: 'secondary.main',
                                            display: 'inline-block',
                                          }}
                                        >
                                          +{parseServiceNames(company.Services).length - 3}
                                        </Box>
                                      )}
                                    </Box>
                                  </Box>
                                )}
                                
                                {/* Rating if available */}
                                {company.Rating > 0 && (
                                  <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                                    <Box 
                                      sx={{ 
                                        bgcolor: '#FFC107', 
                                        color: '#212121', 
                                        px: 1, 
                                        py: 0.3, 
                                        borderRadius: 1, 
                                        fontSize: '0.8rem', 
                                        fontWeight: 700 
                                      }}
                                    >
                                      {company.Rating.toFixed(1)}
                                    </Box>
                                    {company.ReviewCount && (
                                      <Typography variant="body2" sx={{ ml: 1, fontSize: '0.8rem' }}>
                                        ({company.ReviewCount} reviews)
                                      </Typography>
                                    )}
                                  </Box>
                                )}
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                        No companies found for this industry.
                      </Typography>
                    )}

                    <Box display="flex" justifyContent="flex-end" mt={2}>
                      <Button
                        variant="text"
                        color="primary"
                        onClick={() => handleViewMore(serviceIds)}
                      >
                        View More
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default DiscoverPage;