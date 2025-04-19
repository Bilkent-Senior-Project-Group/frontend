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

import { Search, MapPin, Filter, ChevronDown, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import { API_URL } from '../../config/apiConfig.js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.js';

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
  const [userCompanies, setUserCompanies] = useState([]);
  const [similarCompanies, setSimilarCompanies] = useState({});
  const [loadingSimilarCompanies, setLoadingSimilarCompanies] = useState(false);
  const { user, logout, token } = useAuth();

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

  // useEffect to fetch user's companies and similar companies
  useEffect(() => {
    const fetchUserCompanies = async () => {
      try {
        // const response = await axios.get(`${API_URL}/api/Company/GetCompaniesOfUser/${user?.id}`,
        //   {
        //     headers: {
        //       'Content-Type': 'application/json',
        //       'Authorization': `Bearer ${token}`
        //     }
        //   }
        // );
        // const fetchedCompanies = response.data.map((company) => ({
        //   id: company.companyId,
        //   name: company.companyName,
        //   projects: company.projects,
        // }));

        // Mock response data structure for fetchUserCompanies
        const mockResponseData = [
          {
            companyId: "b65ef568-000d-426e-8467-f81a708f3e6f",
            companyName: "TechSolutions Inc.",
            projects: [
              { id: "p1", name: "Website Redesign" },
              { id: "p2", name: "Mobile App Development" }
            ]
          },
          {
            companyId: "c87ad953-112c-489e-b789-a2e91f572c01",
            companyName: "Digital Innovators",
            projects: [
              { id: "p3", name: "E-commerce Platform" },
              { id: "p4", name: "CRM Integration" }
            ]
          },
          {
            companyId: "a4d2e987-56f1-42c3-b908-3d76c2910ef5",
            companyName: "Manufacturing Partners",
            projects: [
              { id: "p5", name: "Supply Chain Optimization" },
              { id: "p6", name: "IoT Implementation" }
            ]
          }
        ];
        // setUserCompanies(fetchedCompanies);
        setUserCompanies(mockResponseData); // Use mock data for testing
        // Pass the fetched companies directly, not the state variable
        // if (fetchedCompanies && fetchedCompanies.length > 0) {
          // fetchSimilarCompanies(fetchedCompanies);
          fetchSimilarCompanies(mockResponseData); // Use mock data for testing
        // }
      } catch (err) {
        console.error('Failed to fetch user companies', err);
      }
    };

    // Only fetch if user is logged in
    if (user?.id) {
      fetchUserCompanies();
    }
  }, [user]);

  const fetchSimilarCompanies = async (companies) => {
    setLoadingSimilarCompanies(true);
    
    try {
      const similarCompaniesData = {};
      
      // For each company, fetch similar companies
      for (const company of companies) {
        // Using simplified mock data structure that works with the rendering code
        similarCompaniesData[company.companyId] = [
          {
            companyId: "101",
            name: "Creative Solutions",
            logoUrl: null,
            verified: true,
            city: "Istanbul",
            country: "Turkey",
            totalReviews: 24,
            overallRating: 4.7,
            size: "11–50 employees",
            foundedYear: 2015,
            services: [
              { serviceName: "3D Printing" },
              { serviceName: "Prototyping" },
              { serviceName: "Product Design" }
            ],
            completedProjects: 2
          },
          {
            companyId: "102",
            name: "TechPrint",
            logoUrl: null,
            verified: false,
            city: "Ankara",
            country: "Turkey",
            size: "51–100 employees",
            foundedYear: 2012,
            services: [
              { serviceName: "3D Printing" },
              { serviceName: "CAD Modeling" },
              { serviceName: "Rapid Prototyping" }
            ],
            completedProjects: 1
          },
          {
            companyId: "103",
            name: "Industrial Innovations",
            logoUrl: null,
            verified: true,
            city: "Izmir",
            country: "Turkey",
            totalReviews: 37,
            overallRating: 4.9,
            size: "101–250 employees",
            foundedYear: 2010,
            services: [
              { serviceName: "3D Printing" },
              { serviceName: "Industrial Design" }
            ],
            completedProjects: 5
          },
          {
            companyId: "104",
            name: "NextGen Manufacturing",
            logoUrl: null,
            verified: true,
            city: "Bursa",
            country: "Turkey",
            totalReviews: 42,
            overallRating: 4.8,
            size: "51–100 employees",
            foundedYear: 2014,
            services: [
              { serviceName: "Additive Manufacturing" },
              { serviceName: "Precision Engineering" },
              { serviceName: "Prototype Testing" }
            ],
            completedProjects: 0
          },
          {
            companyId: "105",
            name: "Printify Lab",
            logoUrl: null,
            verified: false,
            city: "Antalya",
            country: "Turkey",
            totalReviews: 12,
            overallRating: 4.0,
            size: "11–50 employees",
            foundedYear: 2018,
            services: [
              { serviceName: "3D Printing" },
              { serviceName: "Resin Printing" },
              { serviceName: "Product Rendering" }
            ],
            completedProjects: 3
          },
          {
            companyId: "106",
            name: "FabTech Solutions",
            logoUrl: null,
            verified: true,
            city: "Konya",
            country: "Turkey",
            totalReviews: 29,
            overallRating: 4.6,
            size: "51–100 employees",
            foundedYear: 2013,
            services: [
              { serviceName: "3D Scanning" },
              { serviceName: "Injection Molding" },
              { serviceName: "Prototype Assembly" }
            ],
            completedProjects: 2
          },
          {
            companyId: "107",
            name: "ProtoMax Studio",
            logoUrl: null,
            verified: false,
            city: "Gaziantep",
            country: "Turkey",
            totalReviews: 21,
            overallRating: 4.3,
            size: "11–50 employees",
            foundedYear: 2016,
            services: [
              { serviceName: "3D Printing" },
              { serviceName: "Digital Fabrication" },
              { serviceName: "Reverse Engineering" }
            ],
            completedProjects: 0
          },
          {
            companyId: "108",
            name: "DesignForge",
            logoUrl: null,
            verified: true,
            city: "Eskişehir",
            country: "Turkey",
            totalReviews: 34,
            overallRating: 4.5,
            size: "101–250 employees",
            foundedYear: 2011,
            services: [
              { serviceName: "Industrial Design" },
              { serviceName: "Prototype Manufacturing" },
              { serviceName: "CNC Machining" }
            ],
            completedProjects: 1
          }
        ];
        
        
      }
      
      setSimilarCompanies(similarCompaniesData);
      console.log('Similar companies fetched:', similarCompaniesData);
    } catch (err) {
      console.error('Failed to fetch similar companies', err);
    } finally {
      setLoadingSimilarCompanies(false);
    }
  };

  const navigateToCompanyProfile = (companyName) => {
    navigate(`/company/${companyName}`);
  };

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
    <Box sx={{ width: '100%', maxWidth: '100%', px: { xs: 2, sm: 3, md: 4 }, py: 4 }}>
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
      {/* Similar Companies Section */}
{userCompanies.length > 0 && (
  <Box sx={{ mt: 4, width: '100%', px: 2 }}>
    <Typography variant="h5" fontWeight={700} gutterBottom color="text.primary" sx={{ mb: 3 }}>
      Recommended For You
    </Typography>

    {userCompanies.map((company) => (
      <Box key={company.id} sx={{ mb: 6, width: '100%' }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 2 
        }}>
          <Typography variant="h6" fontWeight={600} color="text.primary">
            Companies like {company.name}
          </Typography>
        </Box>

        {loadingSimilarCompanies ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <CircularProgress />
          </Box>
        ) : similarCompanies[company.companyId]?.length > 0 ? (
          <Box sx={{ position: 'relative', width: '100%' }}>
            {/* Left Scroll Button */}
            <IconButton
              sx={{
                position: 'absolute',
                left: -30,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                backgroundColor: 'background.paper',
                boxShadow: 2,
                '&:hover': {
                  backgroundColor: 'background.paper',
                  boxShadow: 4,
                },
                width: 40,
                height: 40,
              }}
              onClick={() => {
                const container = document.getElementById(`scroll-container-${company.companyId}`);
                if (container) {
                  container.scrollBy({ left: -320, behavior: 'smooth' });
                }
              }}
            >
              <ChevronLeft size={20} />
            </IconButton>
            
            {/* Scrollable Container */}
            <Box 
              id={`scroll-container-${company.companyId}`}
              sx={{ 
                display: 'flex',
                gap: 3,
                overflowX: 'auto',
                pb: 2,
                pt: 1,
                px: 1,
                scrollbarWidth: 'none', // Firefox
                '&::-webkit-scrollbar': {
                  display: 'none' // Chrome, Safari, Opera
                },
                '-ms-overflow-style': 'none', // IE, Edge
                scrollSnapType: 'x mandatory',
              }}
            >
              {similarCompanies[company.companyId].map((similarCompany) => (
                <Card
                key={similarCompany.companyId}
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
                    boxShadow: 4,
                  },
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                }}
                onClick={() => navigateToCompanyProfile(similarCompany.companyId)}
              >
                {/* Top Section - Logo */}
                <Box
                  sx={{
                    height: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2,
                    position: 'relative',
                  }}
                >
                  {similarCompany.logoUrl ? (
                    <Box
                      component="img"
                      src={similarCompany.logoUrl}
                      alt={similarCompany.name}
                      sx={{
                        maxHeight: 50,
                        maxWidth: 50,
                        borderRadius: '8px',
                        objectFit: 'contain',
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="h6" color="primary.main" fontWeight="bold">
                        {similarCompany.name.charAt(0)}
                      </Typography>
                    </Box>
                  )}
              
                  {similarCompany.verified && (
                    <CheckCircle
                      size={22}
                      color="#4caf50"
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                    />
                  )}
                </Box>
              
                {/* Content Section */}
                <CardContent sx={{ pt: 0, px: 2, pb: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {similarCompany.name}
                  </Typography>
              
                  {(similarCompany.city && similarCompany.country) && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <MapPin size={16} color="#757575" />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ ml: 0.8, fontSize: '0.85rem' }}
                        noWrap
                      >
                        {similarCompany.city}, {similarCompany.country}
                      </Typography>
                    </Box>
                  )}
              
                  {/* Optional: Show Company Size & Founded Year */}
                  {(similarCompany.size || similarCompany.foundedYear) && (
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                      {similarCompany.size && `${similarCompany.size}`}
                      {similarCompany.size && similarCompany.foundedYear && ' • '}
                      {similarCompany.foundedYear && `${similarCompany.foundedYear}`}
                    </Typography>
                  )}

                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                    {similarCompany.completedProjects > 0
                      ? `${similarCompany.completedProjects} completed project${similarCompany.completedProjects !== 1 ? 's' : ''}`
                      : 'No completed projects yet'}
                  </Typography>
              
                  {/* Services */}
                  <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {similarCompany.services?.slice(0, 3).map((service, idx) => (
                      <Chip
                        key={idx}
                        label={service.serviceName || service}
                        size="small"
                        sx={{
                          borderRadius: '12px',
                          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                          color: 'text.primary',
                          fontSize: '0.75rem',
                          height: '22px',
                        }}
                      />
                    ))}
                    {similarCompany.services?.length > 3 && (
                      <Chip
                        label={`+${similarCompany.services.length - 3}`}
                        size="small"
                        sx={{
                          borderRadius: '12px',
                          bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.08),
                          color: 'secondary.main',
                          fontSize: '0.75rem',
                          height: '22px',
                        }}
                      />
                    )}
                  </Box>
              
                  {/* Rating Section - Only show if rating is present */}
                  {typeof similarCompany.overallRating === 'number' && similarCompany.overallRating > 0 && (
                    <>
                      <Divider sx={{ my: 1 }} />
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            bgcolor: '#FFC107',
                            color: '#212121',
                            px: 1.2,
                            py: 0.3,
                            borderRadius: 1,
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            minWidth: 36,
                            textAlign: 'center',
                          }}
                        >
                          {similarCompany.overallRating.toFixed(1)}
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ ml: 1, fontSize: '0.8rem' }}
                        >
                          {similarCompany.totalReviews} reviews
                        </Typography>
                      </Box>
                    </>
                  )}
                </CardContent>
              </Card>
              
              ))}
            </Box>
            
            {/* Right Scroll Button */}
            <IconButton
              sx={{
                position: 'absolute',
                right: -30,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                backgroundColor: 'background.paper',
                boxShadow: 2,
                '&:hover': {
                  backgroundColor: 'background.paper',
                  boxShadow: 4,
                },
                width: 40,
                height: 40,
              }}
              onClick={() => {
                const container = document.getElementById(`scroll-container-${company.companyId}`);
                if (container) {
                  container.scrollBy({ left: 320, behavior: 'smooth' });
                }
              }}
            >
              <ChevronRight size={20} />
            </IconButton>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            No similar companies found for {company.name}.
          </Typography>
        )}
      </Box>
    ))}
  </Box>
)}
    </Box>
  );
};

export default FilterSearchPage;