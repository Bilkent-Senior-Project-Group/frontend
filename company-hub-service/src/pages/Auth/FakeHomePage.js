import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Global, css } from '@emotion/react';
import {
  AppBar,
  Box,
  Button,
  Container,
  Alert,
  Snackbar,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Toolbar,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
  alpha,
  CircularProgress,
  Tabs,
  Tab,
  Checkbox,
  FormControlLabel,
} from '@mui/material';

import {
  Building,
  Home,
  Compass,
  Search,
  MapPin,
  Mail,
  ChevronDown,
  X,
  MailCheck,
} from 'lucide-react';

import UserService from '../../services/UserService'; // Adjust the import path as necessary

// Debounce utility function
const debounce = (func, delay) => {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
};

// Modify the VideoBackground component to allow pointer events to pass through
const VideoBackground = React.memo(({ videoUrl }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none', // Add this to allow mouse events to pass through
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark overlay with 40% opacity
          zIndex: 1,
          pointerEvents: 'none', // Add this to also allow events to pass through the overlay
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
          pointerEvents: 'none', // Add this to ensure video element doesn't capture events
        }}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </Box>
    </Box>
  );
});

// Location Search Component - move outside main component function and memoize
const LocationSearch = React.memo(({ 
  locationQuery, setLocationQuery,
  loadingLocations, locationResults,
  handleAddLocation, selectedLocations,
  handleRemoveLocation
}) => {
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
          mb: locationResults.length > 0 ? 0 : 2,
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
            key={index} 
            label={loc} 
            onDelete={() => handleRemoveLocation(index)} 
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

// Services Panel Component - move outside main component function and memoize
const ServicesPanel = React.memo(({ 
  showServicePanel, setShowServicePanel, 
  getSelectedServiceCount, loadingServices,
  servicesByIndustry, activeIndustryTab, 
  setActiveIndustryTab, selectedServices,
  toggleService
}) => {
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
          <ChevronDown size={20} />
        </IconButton>
      </Box>

      {showServicePanel && (
        <Box>
          {loadingServices ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <React.Fragment>
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
                    {servicesByIndustry[activeIndustryTab].services.map((service) => (
                      <Grid item xs={6} key={service.id}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectedServices.includes(service.id)}
                              onChange={() => toggleService(service.id)}
                              size="small"
                            />
                          }
                          label={<Typography variant="body2">{service.name}</Typography>}
                          sx={{ 
                            '& .MuiFormControlLabel-label': { fontSize: '0.875rem' },
                            ml: 0.5
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              )}
            </React.Fragment>
          )}
        </Box>
      )}
    </CardContent>
  );
});

export default function FakeHomepage() {
  // Original state variables
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const navigate = useNavigate();

  // Location search state variables
  const [locationQuery, setLocationQuery] = useState('');
  const [locationResults, setLocationResults] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedLocationIds, setSelectedLocationIds] = useState([]);

  // Services state variables 
  const [servicesByIndustry, setServicesByIndustry] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [showServicePanel, setShowServicePanel] = useState(false);
  const [activeIndustryTab, setActiveIndustryTab] = useState(0);

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Add this function to handle form input changes
  const handleContactFormChange = (event) => {
    const { name, value } = event.target;
    setContactForm({
      ...contactForm,
      [name]: value
    });
  };

  // Add this function to handle form submission
  const handleContactSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const { name, email, message } = contactForm;
      await UserService.sendSupportMessage(name, email, message);

      // Reset form on success
      setContactForm({
        name: '',
        email: '',
        message: ''
      });
      setSnackbarOpen(true);
    } catch (error) {
      setSubmitError(error.message || 'Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Constants
  const DRAWER_WIDTH = 240;
  const MINI_DRAWER_WIDTH = 72;

  // Fetch services data on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  // Fetch services data from backend
  const fetchServices = async () => {
    try {
      setLoadingServices(true);
      // In a real implementation, this would be a real API call
      // For demo purposes, we'll use a timeout and mock data
      setTimeout(() => {
        const mockServiceData = [
          {
            industry: "Manufacturing & Industrial",
            services: [
              { id: 1, name: "Plastic Molding" },
              { id: 2, name: "3D Printing" },
              { id: 3, name: "Custom Fabrication" },
              { id: 4, name: "CNC Machining" },
              { id: 5, name: "Quality Control & Inspection" },
              { id: 6, name: "Electronics Assembly" }
            ]
          },
          {
            industry: "Tourism & Hospitality",
            services: [
              { id: 7, name: "Hotel Management" },
              { id: 8, name: "Tour Operators" },
              { id: 9, name: "Event Planning" },
              { id: 10, name: "Restaurant Services" }
            ]
          },
          {
            industry: "Food & Beverage",
            services: [
              { id: 11, name: "Food Processing" },
              { id: 12, name: "Beverage Manufacturing" },
              { id: 13, name: "Catering Services" },
              { id: 14, name: "Food Safety Consulting" }
            ]
          }
        ];
        
        setServicesByIndustry(mockServiceData);
        setLoadingServices(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching services:", error);
      setLoadingServices(false);
    }
  };

  // Debounced location search function
  const debouncedLocationSearch = useCallback(
    debounce(async (query) => {
      if (!query || query.trim().length < 2) {
        setLocationResults([]);
        setLoadingLocations(false);
        return;
      }

      try {
        // In a real implementation, this would be a real API call
        // For demo purposes, we'll use a timeout and mock data
        setTimeout(() => {
          const mockLocations = [
            { id: 1, city: "Ankara", country: "Turkey" },
            { id: 2, city: "Istanbul", country: "Turkey" },
            { id: 3, city: "Izmir", country: "Turkey" },
            { id: 4, city: "Antalya", country: "Turkey" },
          ].filter(location => 
            location.city.toLowerCase().includes(query.toLowerCase()) || 
            location.country.toLowerCase().includes(query.toLowerCase())
          );
          
          setLocationResults(mockLocations);
          setLoadingLocations(false);
        }, 300);
      } catch (error) {
        console.error("Error searching locations:", error);
        setLoadingLocations(false);
      }
    }, 300),
    []
  );

  // Update location search results when query changes
  useEffect(() => {
    if (locationQuery.trim().length >= 2) {
      setLoadingLocations(true);
      debouncedLocationSearch(locationQuery);
    } else {
      setLocationResults([]);
    }
  }, [locationQuery, debouncedLocationSearch]);

  // Redirect to login
  const redirectToLogin = () => {
    navigate('checkEmail');
  };

  // Reset homepage view
  const goToHomepage = () => {
    setShowSearchResults(false);
    setShowLoginPrompt(false);
    setSearchQuery('');
  };

  // Handle search submission
  const handleSearch = (e) => {
    e && e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchResults(true);
      setTimeout(() => {
        setShowLoginPrompt(true);
      }, 1500);
    }
  };

  // Handle adding a location
  const handleAddLocation = (location) => {
    // Check if already added
    if (!selectedLocationIds.includes(location.id)) {
      const locationLabel = `${location.city}, ${location.country}`;
      setSelectedLocations([...selectedLocations, locationLabel]);
      setSelectedLocationIds([...selectedLocationIds, location.id]);
      setLocationQuery('');
      setLocationResults([]);
    }
  };

  // Handle removing a location
  const handleRemoveLocation = (index) => {
    const newLocations = [...selectedLocations];
    const newLocationIds = [...selectedLocationIds];
    newLocations.splice(index, 1);
    newLocationIds.splice(index, 1);
    setSelectedLocations(newLocations);
    setSelectedLocationIds(newLocationIds);
  };

  // Handle toggling a service
  const toggleService = (serviceId) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter(id => id !== serviceId));
    } else {
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  // Get selected service count
  const getSelectedServiceCount = selectedServices.length;

  // Fake company data for search results
  const fakeCompanies = [
    {
      CompanyId: 1,
      Name: "Tech Innovations Inc.",
      Location: "San Francisco, USA",
      Services: ["Software Development", "Cloud Solutions", "AI Implementation"],
      Distance: 1.7
    },
    {
      CompanyId: 2,
      Name: "Global Marketing Partners",
      Location: "New York, USA",
      Services: ["Digital Marketing", "Brand Strategy", "Social Media"],
      Distance: 1.5
    },
    {
      CompanyId: 3,
      Name: "EcoSolutions Group",
      Location: "Berlin, Germany",
      Services: ["Renewable Energy", "Sustainability Consulting", "Green Tech"],
      Distance: 1.3
    }
  ];

  return (
    <>
      <Global
        styles={css`
          html, body {
            height: 100%;
            width: 100%;
            margin: 0;
            padding: 0;
            overflow: auto !important;
          }
          #root {
            height: 100%;
          }
        `}
      />
      
      <Box sx={{ 
        display: 'flex', 
        height: '100vh',
      }}>
        <AppBar
          position="fixed"
          color="default"
          elevation={0}
          sx={{
            zIndex: theme => theme.zIndex.drawer + 1,
            borderBottom: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper'
          }}
        >
          <Toolbar sx={{ position: 'relative' }}>
            <Box sx={{ flexGrow: 1 }} />

            {/* Centered Logo - positioned absolutely to center in entire toolbar */}
            <Box 
              sx={{ 
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex', 
                alignItems: 'center',
                gap: 1.5,
                cursor: 'pointer',
              }}
              onClick={goToHomepage}
            >
              <Box 
                component="img"
                src="/images/logo.png"  
                alt="Compedia Logo"
                sx={{ 
                  height: 40,
                  width: 'auto',
                  objectFit: 'contain'
                }}
              />
              <Box 
                component="img"
                src="/images/compedia-text.png"  
                alt="Compedia"
                sx={{ 
                  height: 32,
                  width: 'auto',
                  objectFit: 'contain'
                }}
              />
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            
            <Button 
              variant="contained" 
              color="primary"
              className="login-button"
              onClick={redirectToLogin}
              sx={{ 
                ml: 2,
                // Update responsive styling to make button even smaller
                '@media (max-width: 768px)': {
                  fontSize: '8px',
                  py: 0.15,
                  px: 0.5,
                  minWidth: 'auto',
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  lineHeight: 1,
                  height: '20px',
                  maxHeight: '20px'
                }
              }}
            >
              Login / Sign up
            </Button>
          </Toolbar>
        </AppBar>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            bgcolor: 'background.default',
            height: '100vh',
            pt: '64px',
            width: '100%',
            position: 'relative',
          }}
        >
          {!showSearchResults ? (
            <Box sx={{
              width: '100%',
              maxWidth: '100%',
              minHeight: 'calc(100vh - 64px)',
              px: { xs: 2, sm: 3, md: 4 },
              py: 4,
              position: 'relative',
              zIndex: 1,
            }}>
              <VideoBackground videoUrl="/videos/bg.mp4" />

              <Container
                maxWidth="sm"
                sx={{
                  py: 4,
                  position: 'relative',
                  zIndex: 2,
                  borderRadius: 2,
                  px: 3,
                }}
              >
                <Typography
                  variant="h2"
                  fontWeight={700}
                  gutterBottom
                  color="white"
                  align="center"
                  sx={{
                    mb: 4,
                    textShadow: '0px 2px 4px rgba(0,0,0,0.5)'
                  }}
                >
                 Discover Companies
                </Typography>

                <Card elevation={3} sx={{
                  mb: 3,
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'divider',
                  display: 'block',
                  backgroundColor: '#ffffff',
                }}>
                  <CardContent sx={{ pt: 3, pb: 3 }}>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom color="text.primary">
                      What do you need?
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Describe what you're looking for..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search size={20} color="#9e9e9e" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.7),
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

                  <LocationSearch 
                    locationQuery={locationQuery}
                    setLocationQuery={setLocationQuery}
                    loadingLocations={loadingLocations}
                    locationResults={locationResults}
                    handleAddLocation={handleAddLocation}
                    selectedLocations={selectedLocations}
                    handleRemoveLocation={handleRemoveLocation}
                  />

                  <Divider />

                  <ServicesPanel 
                    showServicePanel={showServicePanel}
                    setShowServicePanel={setShowServicePanel}
                    getSelectedServiceCount={getSelectedServiceCount}
                    loadingServices={loadingServices}
                    servicesByIndustry={servicesByIndustry}
                    activeIndustryTab={activeIndustryTab}
                    setActiveIndustryTab={setActiveIndustryTab}
                    selectedServices={selectedServices}
                    toggleService={toggleService}
                  />
                </Card>

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderRadius: 2,
                    boxShadow: 2,
                    bgcolor: 'white',
                    color: 'primary.main',
                    textTransform: 'none',
                    background: 'white !important',
                    '&:hover': {
                      background: '#f5f5f5 !important',
                      boxShadow: 4,
                    },
                    backgroundImage: 'none !important',
                  }}
                  onClick={handleSearch}
                >
                  Search
                </Button>
              </Container>

              {/* Contact/Message Section */}
              <Container
                maxWidth="md"
                sx={{
                  mt: 10,
                  mb: 4,
                  position: 'relative',
                  zIndex: 2,
                  borderRadius: 2,
                  px: 3,
                }}
              >
                <Box
                  sx={{
                    textAlign: 'center',
                    mb: 5,
                  }}
                >
                  <Typography
                    variant="h3"
                    fontWeight={700}
                    gutterBottom
                    color="white"
                    align="center"
                    sx={{
                      mb: 2,
                      textShadow: '0px 2px 4px rgba(0,0,0,0.5)'
                    }}
                  >
                    Contact Us
                  </Typography>
                  <Typography
                    variant="h6"
                    color="white"
                    align="center"
                    sx={{
                      maxWidth: '700px',
                      mx: 'auto',
                      textShadow: '0px 1px 2px rgba(0,0,0,0.5)',
                      fontWeight: 400
                    }}
                  >
                    Have questions or need assistance? Send us a message and we'll get back to you as soon as possible.
                  </Typography>
                </Box>

                <Card elevation={3} sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                }}>
                  <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          Send us a message
                        </Typography>
                        <form onSubmit={handleContactSubmit}>
                          <TextField
                            fullWidth
                            name="name"
                            label="Full Name"
                            variant="outlined"
                            margin="normal"
                            value={contactForm.name}
                            onChange={handleContactFormChange}
                            required
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'primary.main',
                                },
                              },
                            }}
                          />
                          <TextField
                            fullWidth
                            name="email"
                            label="Email Address"
                            variant="outlined"
                            type="email"
                            margin="normal"
                            value={contactForm.email}
                            onChange={handleContactFormChange}
                            required
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'primary.main',
                                },
                              },
                            }}
                          />
                          <TextField
                            fullWidth
                            name="message"
                            label="Your Message"
                            variant="outlined"
                            multiline
                            rows={5}
                            margin="normal"
                            value={contactForm.message}
                            onChange={handleContactFormChange}
                            required
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'primary.main',
                                },
                              },
                            }}
                          />
                          {submitError && (
                            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                              {submitError}
                            </Alert>
                          )}
                          
                          <Box sx={{ mt: 2 }}>
                            <Button
                              variant="contained"
                              type="submit"
                              size="large"
                              disabled={isSubmitting}
                              fullWidth
                              sx={{
                                py: 1.5,
                                fontSize: '1rem',
                                fontWeight: 600,
                                borderRadius: 2,
                                textTransform: 'none',
                              }}
                            >
                              {isSubmitting ? (
                                <>
                                  <CircularProgress size={24} sx={{ mr: 1, color: 'white' }} />
                                  Sending...
                                </>
                              ) : (
                                'Submit Message'
                              )}
                            </Button>
                          </Box>
                        </form>
                      </Grid>

                      <Grid item xs={12} md={6} sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}>
                        <Box>
                          <Typography variant="h6" fontWeight={600} gutterBottom>
                            Contact Information
                          </Typography>
                          <Box sx={{ mt: 3 }}>
                            <Typography variant="body1" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                              <Box component={MapPin} sx={{ mr: 2, color: 'primary.main' }} size={20} />
                              Bilkent University, Ankara, Turkey
                            </Typography>
          
                            <Typography variant="body1" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                              <Box component={Mail} sx={{ mr: 2, color: 'primary.main' }} size={20} />
                              compedicorp@gmail.com
                             
                              
                            </Typography>
                          </Box>
                        </Box>
                        
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Container>
            </Box>
          ) : (
            <Box>
              <Box sx={{
                backgroundColor: theme => theme.palette.grey[100],
                py: 4,
                borderBottom: `1px solid ${theme => theme.palette.divider}`
              }}>
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
                            <Search />
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
                <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
                  Top Companies for "{searchQuery}"
                </Typography>

                <Box>
                  {fakeCompanies.map((company) => (
                    <Card
                      key={company.CompanyId}
                      elevation={1}
                      sx={{
                        mb: 3,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        cursor: 'pointer',
                        transition: 'transform 0.1s ease-in-out',
                        position: 'relative', // Add position relative for the overlay
                        overflow: 'hidden', // Ensure the overlay stays within bounds
                        '&:hover': {
                          transform: 'scale(1.01)',
                          boxShadow: 3,
                        },
                      }}
                      onClick={redirectToLogin}
                    >
                      {/* Update the blur overlay to remove the button completely */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backdropFilter: 'blur(6px)',
                          zIndex: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        }}
                        onClick={(e) => {
                          // Prevent clicks on card from doing anything
                          e.stopPropagation();
                        }}
                      >
                        {/* Remove the button completely - don't show anything in the overlay */}
                      </Box>
                      <CardContent sx={{ filter: 'blur(4px)' }}>
                        {/* Existing card content */}
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} md={9}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {company.Name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              <MapPin size={14} style={{ marginRight: 4, verticalAlign: 'text-bottom' }} />
                              {company.Location}
                            </Typography>

                            {company.Services && company.Services.length > 0 && (
                              <Box sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                  {company.Services.map((service) => (
                                    <Chip
                                      key={service}
                                      label={service}
                                      size="small"
                                      sx={{
                                        bgcolor: 'primary.50',
                                        color: 'primary.700',
                                        fontWeight: 500,
                                        borderRadius: '16px',
                                      }}
                                    />
                                  ))}
                                </Box>
                              </Box>
                            )}
                          </Grid>

                          <Grid item xs={12} md={3} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                            <Box sx={{ display: 'inline-block', backgroundColor: 'primary.50', px: 2, py: 1, borderRadius: 2 }}>
                              <Typography variant="caption" sx={{ color: 'primary.800', fontWeight: 500 }}>
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

                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={redirectToLogin}
                      sx={{ px: 4 }}
                    >
                      Show More Results
                    </Button>
                  </Box>
                </Box>
              </Container>
            </Box>
          )}
        </Box>

        <Dialog
          open={showLoginPrompt}
          // Remove onClose handler to prevent closing when clicking outside
          aria-labelledby="login-prompt-dialog"
          // Add these props to prevent closing on backdrop click or escape key
          disableEscapeKeyDown
          disableBackdropClick
          // Use onClose only for the "Later" button (which we'll modify)
          onClose={(event, reason) => {
            // This prevents any auto-closing behavior
            if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
              setShowLoginPrompt(false);
            }
          }}
        >
          <DialogTitle id="login-prompt-dialog">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Building size={20} />
              <Typography variant="h6">Create an Account</Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Sign up or login to view more details about these companies,
              and connect with businesses around the world.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              onClick={redirectToLogin}
              autoFocus
              fullWidth
            >
              Login / Sign Up
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}