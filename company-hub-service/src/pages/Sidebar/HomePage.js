import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Box, Typography, Container, Grid, Chip, TextField, InputAdornment,
  Button, Paper, CircularProgress, Tabs, Tab, Checkbox, Card,
  CardContent, Divider, IconButton, alpha, SpeedDial, SpeedDialIcon, SpeedDialAction
} from '@mui/material';
import { Search, MapPin, CheckCircle, ChevronLeft, ChevronRight, ChevronDown, Plus, Building, FileText } from 'lucide-react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import { API_URL, SEARCH_API_URL } from '../../config/apiConfig.js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.js';
import debounce from 'lodash/debounce';
import { last } from 'lodash';
import OnboardingTour from '../../components/OnboardingTour'; // Import the OnboardingTour component

// Location Search Component
const LocationSearch = React.memo(({ selectedLocations, selectedLocationIds, setSelectedLocations, setSelectedLocationIds }) => {
  const [locationQuery, setLocationQuery] = useState('');
  const [locationResults, setLocationResults] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query) => {
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
    }, 300),
    []
  );

  useEffect(() => {
    if (locationQuery.length >= 2) {
      debouncedSearch(locationQuery);
    } else {
      setLocationResults([]);
    }
    return () => debouncedSearch.cancel();
  }, [locationQuery, debouncedSearch]);

  const handleAddLocation = (location) => {
    const locationString = `${location.city}, ${location.country}`;
    if (!selectedLocations.includes(locationString)) {
      setSelectedLocations([...selectedLocations, locationString]);
      setSelectedLocationIds([...selectedLocationIds, location.id]);
    }
    setLocationQuery('');
    setLocationResults([]);
  };

  return (
    
    <CardContent sx={{ pt: 3, pb: 3 }}>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom color="text.primary">Where?</Typography>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Add a location..."
        value={locationQuery}
        onChange={(e) => setLocationQuery(e.target.value)}
        InputProps={{
          startAdornment: (<InputAdornment position="start"><MapPin size={20} color="#9e9e9e" /></InputAdornment>),
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
                px: 2, py: 1.5, cursor: 'pointer', 
                '&:hover': { backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08) },
                borderBottom: '1px solid', borderColor: 'divider',
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
                '&:hover': { color: 'primary.dark' },
              },
            }}
          />
        ))}
      </Box>
    </CardContent>
  );
});

// Services Panel Component
const ServicesPanel = React.memo(({ servicesByIndustry, selectedServices, setSelectedServices, showServicePanel, setShowServicePanel }) => {
  const [activeIndustryTab, setActiveIndustryTab] = useState(0);
  
  const getSelectedServiceCount = useMemo(() => {
    return selectedServices.length;
  }, [selectedServices]);

  const toggleService = useCallback((serviceId) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  }, [setSelectedServices]);

  return (
    <CardContent sx={{ pt: 3, pb: 3 }}>
      <Box 
        sx={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          cursor: 'pointer', mb: showServicePanel ? 2 : 0
        }}
        onClick={() => setShowServicePanel(!showServicePanel)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="subtitle1" fontWeight={600} color="text.primary">Services</Typography>
          {getSelectedServiceCount > 0 && (
            <Chip
              size="small"
              label={`${getSelectedServiceCount} selected`}
              sx={{ 
                ml: 1.5, height: 24, 
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                color: 'primary.main', fontWeight: 500,
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
              '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0' },
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
                maxHeight: '200px', overflowY: 'auto', p: 1,
                bgcolor: (theme) => alpha(theme.palette.background.paper, 0.5),
                border: '1px solid', borderColor: 'divider', borderRadius: 1,
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
                          p: 1, display: 'flex', alignItems: 'center', cursor: 'pointer',
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
  );
});

// Similar Company Card Component
const SimilarCompanyCard = React.memo(({ company, navigateToCompanyProfile }) => {
  return (
    <Card
      sx={{
        width: 300, 
        minWidth: 300, 
        height: 'auto',
        display: 'flex', 
        flexDirection: 'column', 
        cursor: 'pointer',
        transition: 'all 0.2s', 
        scrollSnapAlign: 'start',
        '&:hover': { 
          transform: 'translateY(-4px)', 
          boxShadow: '0 12px 20px rgba(0, 0, 0, 0.25)' 
        },
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: 2,
        background: 'rgba(25, 28, 41, 0.75)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
      }}
      onClick={() => navigateToCompanyProfile(company.entity.company_name)}
    >
      {/* Logo Section */}
      <Box sx={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, position: 'relative' }}>
        {company.entity.logoUrl ? (
          <Box component="img" src={company.entity.logoUrl} alt={company.entity.company_name} sx={{ maxHeight: 50, maxWidth: 50, borderRadius: '8px', objectFit: 'contain' }}/>
        ) : (
          <Box sx={{ width: 50, height: 50, borderRadius: '50%', bgcolor: 'rgba(255, 255, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h6" color="white" fontWeight="bold">{company.entity.company_name.charAt(0)}</Typography>
          </Box>
        )}
        <Typography variant="body" color="rgba(255, 255, 255, 0.8)" sx={{ ml: 0.8, fontSize: '0.85rem', position: 'absolute', top: 20, right: 20 }}>
          %{Math.round(company.distance * 100)} similarity
        </Typography>
      </Box>
    
      {/* Content Section */}
      <CardContent sx={{ pt: 0, px: 2, pb: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="h6" fontWeight={600} color="white" noWrap>{company.entity.company_name}</Typography>
    
        {(company.entity.location_name) && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <MapPin size={16} color="rgba(255, 255, 255, 0.7)" />
            <Typography variant="body2" color="rgba(255, 255, 255, 0.7)" sx={{ ml: 0.8, fontSize: '0.85rem' }} noWrap>
              {company.entity.location_name}
            </Typography>
          </Box>
        )}
    
        {/* Services */}
        <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {company.entity.service_names?.slice(0, 3).map((service, idx) => (
            <Chip
              key={idx}
              label={service}
              size="small"
              sx={{
                borderRadius: '12px',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '0.75rem',
                height: '22px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
              }}
            />
          ))}
          {company.entity.service_names?.length > 3 && (
            <Chip
              label={`+${company.entity.service_names.length - 3}`}
              size="small"
              sx={{
                borderRadius: '12px',
                bgcolor: 'rgba(255, 255, 255, 0.15)',
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '0.75rem',
                height: '22px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
});

// First, let's update the SimilarCompaniesSection component to handle incremental loading

const SimilarCompaniesSection = React.memo(({ userCompanies, similarCompanies, loadingStates, navigateToCompanyProfile }) => {
  return (
    <Box sx={{ mt: 4, width: '100%', px: 2 }}>

      <Typography 
        variant="h5" 
        fontWeight={700} 
        gutterBottom 
        color="white" 
        sx={{ 
          mb: 3,
          position: 'relative',
          textShadow: '0px 2px 4px rgba(0,0,0,0.5)',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -8,
            left: 0,
            width: 60,
            height: 3,
            backgroundColor: 'white',
            borderRadius: 1.5
          }
        }}
      >

        Possible Competitors
      </Typography>

      {userCompanies.map((company) => (
        <Box key={company.id} sx={{ mb: 6, width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight={600} color="white" sx={{ textShadow: '0px 1px 3px rgba(0,0,0,0.4)' }}>
              Companies like {company.name}
            </Typography>
          </Box>

          {loadingStates ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
              <CircularProgress sx={{ color: 'white' }} />
            </Box>

          ) : similarCompanies[company.id]?.length > 0 ? (
            <Box sx={{ position: 'relative', width: '100%' }}>
              {/* Left Scroll Button */}
              <IconButton
                sx={{
                  position: 'absolute', left: -30, top: '50%', transform: 'translateY(-50%)', zIndex: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(5px)', boxShadow: 2, 
                  width: 40, height: 40, color: 'white',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.25)', boxShadow: 4 },
                }}
                onClick={() => {
                  const container = document.getElementById(`scroll-container-${company.id}`);
                  if (container) container.scrollBy({ left: -320, behavior: 'smooth' });
                }}
              >
                <ChevronLeft size={20} />
              </IconButton>
              
              {/* Scrollable Container */}
              <Box 
                id={`scroll-container-${company.id}`}
                sx={{ 
                  display: 'flex', gap: 3, overflowX: 'auto', pb: 2, pt: 1, px: 1,
                  scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' },
                  msOverflowStyle: 'none', scrollSnapType: 'x mandatory',
                }}
              >
                {similarCompanies[company.id].map((similarCompany) => (
                  <SimilarCompanyCard 
                    key={similarCompany.id} 
                    company={similarCompany}
                    navigateToCompanyProfile={navigateToCompanyProfile}
                  />
                ))}
              </Box>
              
              {/* Right Scroll Button */}
              <IconButton
                sx={{
                  position: 'absolute', right: -30, top: '50%', transform: 'translateY(-50%)', zIndex: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(5px)', boxShadow: 2, 
                  width: 40, height: 40, color: 'white',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.25)', boxShadow: 4 },
                }}
                onClick={() => {
                  const container = document.getElementById(`scroll-container-${company.id}`);
                  if (container) container.scrollBy({ left: 320, behavior: 'smooth' });
                }}
              >
                <ChevronRight size={20} />
              </IconButton>
            </Box>
          ) : (
            <Typography variant="body2" color="rgba(255, 255, 255, 0.7)" sx={{ mt: 1 }}>
              No similar companies found for {company.name}.
            </Typography>
          )}
        </Box>
      ))}
    </Box>
  );
});

const VideoBackground = React.memo(({ videoUrl }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0, // Start from the very top
        left: 0, // Start from the very left (cover sidebar)
        right: 0,
        bottom: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark overlay with 40% opacity
          zIndex: 1,
          pointerEvents: 'none',
        }
      }}
    >
      <Box
        component="video"
        autoPlay
        muted
        loop
        sx={{
          objectFit: 'cover',
          width: '100%',
          height: '100%',
          position: 'absolute',
          pointerEvents: 'none',
        }}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </Box>
    </Box>
  );
});

// Main FilterSearchPage Component
const FilterSearchPage = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const isAdmin = user?.email === "admin@admin.com";
  
  // Onboarding tour state
  const [showOnboardingTour, setShowOnboardingTour] = useState(false);
  
  // Search state
  const [searchText, setSearchText] = useState('');
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedLocationIds, setSelectedLocationIds] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [showServicePanel, setShowServicePanel] = useState(false);
  
  // Services state
  const [servicesByIndustry, setServicesByIndustry] = useState([]);
  
  // User companies state
  const [userCompanies, setUserCompanies] = useState([]);
  const [similarCompanies, setSimilarCompanies] = useState({});
  const [loadingStates, setLoadingStates] = useState({});

  // Show the onboarding tour when the component mounts
  useEffect(() => {
    // Only show the tour if the user is logged in
    if (user?.id) {
      setShowOnboardingTour(true);
    }
  }, [user?.id]);

  // Handler to close the onboarding tour
  const handleCloseOnboardingTour = () => {
    setShowOnboardingTour(false);
  };

  const CACHE_KEY = 'similar_companies_cache';
  const FETCH_STATUS_KEY = 'similar_companies_fetch_status';
  const CACHE_EXPIRATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  const abortControllerRef = useRef(null);
  const fetchingRef = useRef(false);

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

  useEffect(() => {
    // Only proceed if user exists
    if (!user?.id) return;
    
    const fetchUserCompanies = async () => {
      try {
        console.log('Fetching user companies for user id:', user.id);
        const response = await axios.get(`${API_URL}/api/Company/GetCompaniesOfUser/${user.id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        const fetchedCompanies = response.data.map((company) => ({
          id: company.companyId,
          name: company.companyName,
          services: company.services,
          technologiesUsed: company.technologiesUsed,
        }));
  
        console.log('Fetched companies:', fetchedCompanies);
        setUserCompanies(fetchedCompanies);
      } catch (err) {
        console.log('No companies found for user or error fetching companies');
        setUserCompanies([]);
      }
    };
  
    fetchUserCompanies();
  }, [user?.id, token]); // Only depends on user.id and token
  

  // Add this helper function inside your component
  const getSavedSimilarCompanies = () => {
    try {
      const savedData = localStorage.getItem(CACHE_KEY);
      if (!savedData) return null;
      
      const { data, timestamp } = JSON.parse(savedData);
      
      // Check if cache is expired
      if (Date.now() - timestamp > CACHE_EXPIRATION) {
        localStorage.removeItem(CACHE_KEY);
        localStorage.removeItem(FETCH_STATUS_KEY);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  };

  // Helper to save cache data incrementally
  const saveSimilarCompaniesToCache = (companyIdsKey, companiesData) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: {
          companyIdsKey,
          companies: companiesData,
          lastUpdated: Date.now()
        },
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  // Helper to check if a fetch is in progress
  const getFetchStatus = () => {
    try {
      const status = localStorage.getItem(FETCH_STATUS_KEY);
      if (!status) return null;
      
      const { inProgress, startTime, companyIdsKey } = JSON.parse(status);
      
      // If fetch has been running for more than 5 minutes, assume it failed
      if (inProgress && Date.now() - startTime > 5 * 60 * 1000) {
        localStorage.removeItem(FETCH_STATUS_KEY);
        return null;
      }
      
      return { inProgress, startTime, companyIdsKey };
    } catch (error) {
      console.error('Error reading fetch status from localStorage:', error);
      return null;
    }
  };

  // Helper to set fetch status
  const setFetchStatus = (inProgress, companyIdsKey = null) => {
    try {
      if (inProgress) {
        localStorage.setItem(FETCH_STATUS_KEY, JSON.stringify({
          inProgress,
          startTime: Date.now(),
          companyIdsKey
        }));
      } else {
        localStorage.removeItem(FETCH_STATUS_KEY);
      }
    } catch (error) {
      console.error('Error setting fetch status in localStorage:', error);
    }
  };

  useEffect(() => {
    // Only proceed if we have user companies
    if (isAdmin || !userCompanies || userCompanies.length === 0) {
      return;
    }

    // Create a cache key based on company IDs to ensure cache validity
    const companyIdsKey = userCompanies.map(company => company.id).sort().join(',');
    
    const fetchSimilarCompaniesData = async () => {
      // Check if we're already fetching
      if (fetchingRef.current) {
        console.log('Fetch already in progress, skipping duplicate fetch');
        return;
      }

      // Check if another tab/window is already fetching
      const fetchStatus = getFetchStatus();
      if (fetchStatus && fetchStatus.inProgress && fetchStatus.companyIdsKey === companyIdsKey) {
        console.log('Fetch is already in progress in another tab/window, waiting for it to complete');
        
        // Initialize loading states for all companies
        const initialLoadingStates = {};
        userCompanies.forEach(company => {
          initialLoadingStates[company.id] = true;
        });
        setLoadingStates(initialLoadingStates);
        
        // Poll for changes in cache until fetch completes or times out
        const checkInterval = setInterval(() => {
          const status = getFetchStatus();
          if (!status || !status.inProgress) {
            clearInterval(checkInterval);
            const cachedData = getSavedSimilarCompanies();
            if (cachedData && cachedData.companyIdsKey === companyIdsKey) {
              setSimilarCompanies(cachedData.companies);
              
              // Reset all loading states
              const resetLoadingStates = {};
              userCompanies.forEach(company => {
                resetLoadingStates[company.id] = false;
              });
              setLoadingStates(resetLoadingStates);
            } else {
              // If cache wasn't updated properly, try fetching again
              fetchSimilarCompaniesData();
            }
          }
        }, 1000); // Check every second
        
        return;
      }

      console.log('Starting to fetch similar companies for userCompanies');

      // Try to get from localStorage first
      const cachedData = getSavedSimilarCompanies();
      
      // If we have valid cached data and it matches our current companies, use it
      if (cachedData && cachedData.companyIdsKey === companyIdsKey) {
        console.log('Using cached similar companies data');
        setSimilarCompanies(cachedData.companies);
        
        // Reset all loading states since we're using cached data
        const resetLoadingStates = {};
        userCompanies.forEach(company => {
          resetLoadingStates[company.id] = false;
        });
        setLoadingStates(resetLoadingStates);
        return;
      }
      
      // Initialize loading states for all companies
      const initialLoadingStates = {};
      userCompanies.forEach(company => {
        initialLoadingStates[company.id] = true;
      });
      setLoadingStates(initialLoadingStates);
      
      fetchingRef.current = true;

      // Create a new AbortController for this fetch
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;
      
      // Mark fetch as in progress
      setFetchStatus(true, companyIdsKey);

      // If no valid cache, fetch fresh data
      console.log('Cache miss or expired, fetching similar companies...');
      try {
        const similarCompaniesData = {};
        
        // Process each company
        for (const company of userCompanies) {
          if (signal.aborted) {
            console.log('Fetch aborted, stopping');
            break;
          }

          console.log(`Fetching similar companies for ${company.name}`);
          
          // Create payload for this specific company
          const payload = {
            services: company.services || [],
            technologies_used: company.technologiesUsed || []
          };
          
          try {
            // Make API call to get similar companies
            const response = await axios.post(
              `${SEARCH_API_URL}/get_featured_companies`,
              payload,
              { signal }
            );
  
            // Process the results
            let processedResults = [];
            
            if (response.data && response.data.results) {
              // Filter out the current company from the results
              processedResults = response.data.results
                .filter(result => {
                  // Check if this result is not the user's own company
                  // You can compare by ID, name, or any unique identifier
                  return result.entity.company_name.toLowerCase() !== company.name.toLowerCase();
                })
                .map(result => ({
                  id: result.id,
                  distance: result.distance,
                  entity: result.entity
                }));
            }
            
            similarCompaniesData[company.id] = processedResults;

            // Incrementally save to cache after each company is processed
            saveSimilarCompaniesToCache(companyIdsKey, similarCompaniesData);
            
            // Only update state if component is still mounted and fetch wasn't aborted
            if (!signal.aborted) {
              // Update the similar companies for this specific company
              setSimilarCompanies(prev => ({
                ...prev,
                [company.id]: processedResults
              }));
              
              // Mark this company as loaded
              setLoadingStates(prev => ({
                ...prev,
                [company.id]: false
              }));
            }

          } catch (companyError) {
            // Only log error if not aborted
            if (!signal.aborted) {
              console.error(`Error fetching similar companies for ${company.name}:`, companyError);
              // Set empty array to indicate we tried but had an error
              similarCompaniesData[company.id] = [];
              
              setSimilarCompanies(prev => ({
                ...prev,
                [company.id]: []
              }));
              
              // Mark this company as loaded (with error)
              setLoadingStates(prev => ({
                ...prev,
                [company.id]: false
              }));
            }
          }
        }
        
        // Final save to ensure everything is persisted
        if (!signal.aborted) {
          console.log('Completed fetching similar companies:', similarCompaniesData);
          saveSimilarCompaniesToCache(companyIdsKey, similarCompaniesData);
        }
      } catch (err) {
        if (!signal.aborted) {
          console.error('Failed to fetch similar companies:', err);
        }
      } finally {
        // Reset fetch status regardless
        fetchingRef.current = false;
        setFetchStatus(false);
      }
    };
    
    // Execute the fetch
    fetchSimilarCompaniesData();

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        console.log('Component unmounting, detaching from fetch but allowing it to continue');
        fetchingRef.current = false;
      }
    };
  }, [userCompanies, SEARCH_API_URL, isAdmin]); // Only depends on userCompanies


  // Navigate to company profile
  const navigateToCompanyProfile = useCallback((companyName) => {
    navigate(`/company/${companyName.replace(/\s+/g, '')}`);
  }, [navigate]);

  // Handle search function
  const handleSearch = useCallback(() => {
    const queryParams = new URLSearchParams();
    queryParams.set('q', searchText);
    
    if (selectedLocations.length > 0) {
      const locationParams = selectedLocations.map((loc, index) => 
        `${loc}:${selectedLocationIds[index]}`
      );
      queryParams.set('loc', locationParams.join('|'));
    }
    
    if (selectedServices.length > 0) {
      queryParams.set('srv', selectedServices.join(','));
    }
    
    navigate(`/search-results?${queryParams.toString()}`);
  }, [searchText, selectedLocations, selectedLocationIds, selectedServices, navigate]);

  // Disable search button condition
  const shouldDisableSearch = useMemo(() => {
    return !searchText && selectedLocations.length === 0 && selectedServices.length === 0;
  }, [searchText, selectedLocations, selectedServices]);

  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: '100%', 
      px: { xs: 2, sm: 3, md: 4 }, 
      py: 4, 
      position: 'relative',
      zIndex: 1 
    }}>
      {/* Onboarding Tour */}
      <OnboardingTour 
        isOpen={showOnboardingTour} 
        onClose={handleCloseOnboardingTour} 
        userId={user?.id} 
      />

      <VideoBackground videoUrl="/videos/bg.mp4" />
      
      /* Main Content Container - Remove background to show video directly */
        <Container 
          maxWidth="sm" 
          sx={{ 
            py: 4, 
            position: 'relative',
            zIndex: 2, // Ensure content is above the video
            // Remove background color to show video
            // backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: 2,
            px: 3,
            // Remove box shadow
            // boxShadow: 3,
            // Remove backdrop filter to avoid blurring
          }}
        >
          
            <Typography 
              variant="h2" // Changed from h3 to h2 for bigger text
              fontWeight={700} 
              gutterBottom 
              color="white" 
              align="center" 
              sx={{ 
                mb: 4,
                textShadow: '0px 2px 4px rgba(0,0,0,0.5)' // Add shadow for better visibility
              }}
            >
              Discover Companies
            </Typography>
            
            {/* Main Card Container - Use solid white background */}
        <Card elevation={3} sx={{ 
          mb: 3, 
          borderRadius: 2, 
          overflow: 'hidden', 
          border: '1px solid', 
          borderColor: 'divider',
          display: 'block', // Ensure it's always displayed
          backgroundColor: '#ffffff', // Solid white background
          // Remove backdropFilter to eliminate blur
        }}>
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
                  backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.7), // More opaque input field
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
          
          {/* Section 2: Location Search - Always visible */}
          <LocationSearch
            selectedLocations={selectedLocations}
            selectedLocationIds={selectedLocationIds}
            setSelectedLocations={setSelectedLocations}
            setSelectedLocationIds={setSelectedLocationIds}
          />
          
          <Divider />
          
          {/* Section 3: Services - Restore the collapsible ServicesPanel */}
          <ServicesPanel
            servicesByIndustry={servicesByIndustry}
            selectedServices={selectedServices}
            setSelectedServices={setSelectedServices}
            showServicePanel={showServicePanel}
            setShowServicePanel={setShowServicePanel}
          />
        </Card>

        
          <Button
            variant="contained"
            size="large"
            fullWidth
            disabled={shouldDisableSearch}
            sx={{
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: 2,
              boxShadow: 2,
              bgcolor: 'white', 
              color: 'primary.main',
              '&:hover': { 
                boxShadow: 4,
                bgcolor: '#f5f5f5',
              },
              textTransform: 'none',
              opacity: shouldDisableSearch ? 0.7 : 1,
              background: 'white !important', // Use !important to override theme
              '&:hover': {
                background: '#f5f5f5 !important', // Also use !important for hover
                boxShadow: 4,
              },
              backgroundImage: 'none !important',
            }}
            onClick={handleSearch}
          >
            Show matching providers
          </Button>

          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            mt: 4,
            animation: 'bounce 2s infinite',
            '@keyframes bounce': {
              '0%, 20%, 50%, 80%, 100%': {
                transform: 'translateY(0)'
              },
              '40%': {
                transform: 'translateY(-10px)'
              },
              '60%': {
                transform: 'translateY(-5px)'
              }
            },
            cursor: 'pointer' // Add cursor pointer to indicate it's clickable
          }}
          onClick={() => {
            const competitorsSection = document.querySelector('[data-scroll-target="competitors"]');
            if (competitorsSection) {
              competitorsSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          >
            <Typography 
              variant="body2" 
              color="white" 
              sx={{ 
                mb: 1, 
                fontWeight: 500,
                textShadow: '0px 1px 2px rgba(0,0,0,0.5)'
              }}
            >
              Scroll to see competitors
            </Typography>
            <Box 
              sx={{ 
                color: 'white', 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <ChevronDown size={24} strokeWidth={2.5} />
              <ChevronDown size={24} strokeWidth={2.5} style={{ marginTop: -12 }} />
            </Box>
          </Box>
              </Container>
     
      
      {/* Similar Companies Section */}
      {!isAdmin ? (
        // For regular users with no companies or with companies
        userCompanies.length > 0 ? (
          <Box 
            sx={{ 
              position: 'relative', 
              zIndex: 2, 
              mt: 8,
              backgroundColor: 'transparent',
              borderRadius: 2,
              p: 3,
            }}
            data-scroll-target="competitors"
          >
          
            <SimilarCompaniesSection
              userCompanies={userCompanies}
              similarCompanies={similarCompanies}
              loadingStates={loadingStates}
              navigateToCompanyProfile={navigateToCompanyProfile}
            />
              </Box>
        ) : (
          <Container sx={{ mt: 6, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              You don't have any companies yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Create your first company to discover similar businesses 
              and get personalized recommendations.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/create-company')}
              sx={{ textTransform: 'none' }}
            >
              Create Your First Company
            </Button>
          </Container>
        )
      ) : (
        // Admin-specific UI
        <Container sx={{ mt: 6 }}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" color="primary" fontWeight={600} gutterBottom>
              Admin Dashboard Overview
            </Typography>
            <Typography variant="body1" paragraph>
              Welcome to the admin view. As an administrator, you have access to admin dashboard.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mt: 3, flexWrap: 'wrap' }}>
              <Button 
                variant="outlined"
                color="primary"
                onClick={() => navigate('/admin')}
                sx={{ textTransform: 'none' }}
              >
                Manage Admin Dashboard
              </Button>
              
              
            </Box>
          </Paper>
        </Container>
      )}
      
      <SpeedDial
        ariaLabel="Create new"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon icon={<Plus />} openIcon={<Plus />} />}
      >
        <SpeedDialAction
          icon={<Building size={20} />}
          tooltipTitle="Create Company"
          onClick={() => navigate('/create-company')}
        />
        <SpeedDialAction
          icon={<FileText size={20} />}
          tooltipTitle="Create Project"
          onClick={() => navigate('/create-project')}
        />
      </SpeedDial>
    </Box>
  );
};

export default FilterSearchPage;