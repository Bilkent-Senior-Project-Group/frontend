import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Button, TextField, Grid, Card, CardContent,
  FormControl, InputLabel, Select, MenuItem, Chip, Paper, Tabs, Tab,
  Snackbar, Alert, Autocomplete, CircularProgress, Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../../contexts/AuthContext';
import CompanyService from '../../services/CompanyService';
import axios from 'axios';
import { API_URL } from '../../config/apiConfig.js';
import CountryCodeSelector from '../../components/CountryCodeSelector';
import { validatePhoneNumber } from '../../utils/phoneUtils';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const EditCompanyPage = () => {
  const { companyName } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  
  // Company details state
  const [companyDetails, setCompanyDetails] = useState({
    companyId: '',
    name: '',              
    description: '',       
    foundedYear: '',  
    address: '',  
    location: -1,           
    companySize: '',       
    website: '',          
    services: [],
    partnerships: [],  
    phone: '',
    email: '',                
  });

  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState(null);

  // Services states
  const [servicesByIndustry, setServicesByIndustry] = useState([]);
  const [activeIndustryTab, setActiveIndustryTab] = useState(0);
  const [selectedServices, setSelectedServices] = useState([]);
  const [showServicePanel, setShowServicePanel] = useState(false);

  // Location states
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [locationQuery, setLocationQuery] = useState('');
  const [locationResults, setLocationResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedLocationIds, setSelectedLocationIds] = useState(-1);

  // Company size options
  const companySizeOptions = [
    "1-10 employees",
    "11-50 employees",
    "51-200 employees",
    "201-500 employees",
    "501-1000 employees",
    "1001-5000 employees",
    "5001-10000 employees",
    "10000+ employees"
  ];

  // Generate years from 1800 to current year
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 1800; year--) {
      years.push(year);
    }
    return years;
  };

  // Fetch company data when component mounts
  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!token || !companyName) {
        setIsFetching(false);
        return;
      }
      
      try {
        const companyData = await CompanyService.getCompany(companyName, token);
        
        // Set company details
        setCompanyDetails({
          companyId: companyData.companyId,
          name: companyData.name || '',
          description: companyData.description || '',
          foundedYear: companyData.foundedYear || '',
          address: companyData.address || '',
          location: companyData.location || -1,
          companySize: companyData.companySize || '',
          website: companyData.website || '',
          services: companyData.services || [],
          partnerships: companyData.partnerships || [],
          phone: companyData.phone || '',
          email: companyData.email || '',
        });
        
        // Set selected services
        if (companyData.services && companyData.services.length > 0) {
          setSelectedServices(companyData.services.map(service => service.id));
        }
        
        // Set location if available
        if (companyData.location !== -1 && companyData.location !== undefined) {
          setSelectedLocationIds(companyData.location);
          setSelectedLocation({
            city: companyData.city || '',
            country: companyData.country || ''
          });
        }
        
      } catch (err) {
        setError(err.message || 'Failed to fetch company data');
        setNotification({
          open: true,
          message: 'Error fetching company data: ' + (err.message || 'Unknown error'),
          severity: 'error'
        });
      } finally {
        setIsFetching(false);
      }
    };

    const fetchIndustryServices = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/Company/GetAllServices`);
        
        const grouped = res.data.map(group => ({
          industry: group[0].industry.name,
          services: group.map(s => ({ id: s.id, name: s.name })),
        }));
        setServicesByIndustry(grouped);
      } catch (err) {
        console.error('Error fetching industries:', err);
        setNotification({
          open: true,
          message: 'Error fetching industries: ' + (err.message || 'Unknown error'),
          severity: 'error'
        });
      }
    };

    fetchCompanyData();
    fetchIndustryServices();
  }, [companyName, token]);

  // Location search effect
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (locationQuery && locationQuery.length >= 2) {
        searchLocations(locationQuery);
      } else {
        setLocationResults([]);
      }
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [locationQuery]);

  const searchLocations = async (query) => {
    if (!query || query.trim() === '') return;
    
    setLoadingLocations(true);
    try {
      const response = await axios.get(`${API_URL}/api/Company/LocationSearch?term=${query}`);
      // Make sure we're handling the response data correctly
      setLocationResults(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error searching locations:', error);
      setNotification({
        open: true,
        message: 'Error searching locations: ' + (error.message || 'Unknown error'),
        severity: 'error'
      });
      // Ensure locationResults is always an array even on error
      setLocationResults([]);
    } finally {
      setLoadingLocations(false);
    }
  };

  const handleAddLocation = (location) => {
    setSelectedLocation(location);
    setSelectedLocationIds(location.id);
    setCompanyDetails(prev => ({
      ...prev,
      location: location.id
    }));
    setLocationQuery('');
    setLocationResults([]);
  };

  const clearSelectedLocation = () => {
    setSelectedLocation(null);
    setSelectedLocationIds(-1);
    setCompanyDetails(prev => ({
      ...prev,
      location: -1
    }));
  };

  const toggleService = (serviceId) => {
    setSelectedServices(prevSelected => {
      if (prevSelected.includes(serviceId)) {
        return prevSelected.filter(id => id !== serviceId);
      } else {
        return [...prevSelected, serviceId];
      }
    });
  };

  const getSelectedServiceCount = () => {
    return selectedServices.length;
  };

  const handleCompanyDetailsChange = (e) => {
    const { name, value } = e.target;
    setCompanyDetails(prevState => ({
      ...prevState,
      [name]: value
    }));

    // Clear validation error when field is edited
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handlePartnershipsChange = (event, newValue) => {
    setCompanyDetails(prev => ({
      ...prev,
      partnerships: newValue || []
    }));
  };

  const validateForm = () => {
    const errors = {};
    
    if (!companyDetails.name || companyDetails.name.trim() === '') {
      errors.name = 'Company name is required';
    }
    
    if (!companyDetails.description || companyDetails.description.trim() === '') {
      errors.description = 'Description is required';
    }
    
    if (!companyDetails.email || companyDetails.email.trim() === '') {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(companyDetails.email)) {
      errors.email = 'Email is invalid';
    }
    
    // Add phone validation
    // if (companyDetails.phone && !validatePhoneNumber(companyDetails.phone)) {
    //   errors.phone = "Please enter a valid phone number";
    // }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setNotification({
        open: true,
        message: 'Please fix the validation errors before submitting',
        severity: 'error'
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // Format services correctly - ensure industryId is a valid GUID
      const formattedServices = selectedServices.map(id => {
        const service = servicesByIndustry
          .flatMap(industry => industry.services)
          .find(service => service.id === id);
        
        // Find the industry this service belongs to
        const industryInfo = servicesByIndustry.find(ind => 
          ind.services.some(s => s.id === id)
        );
        
        // Get industry ID from the first service in that industry (they all share the same industryId)
        const industryId = industryInfo?.services[0]?.industryId;
        
        return {
          id: id , // Default GUID if missing
          serviceName: service?.name ,
          industryId: industryId , // Default GUID if missing
          industryName: industryInfo?.industry,
        //   percentage: service?.percentage,
        };
      });

      // Create a structured object following the backend's expected format
      const companyRequestData = {
        companyId: companyDetails.companyId,
        name: companyDetails.name,
        description: companyDetails.description,
        foundedYear: companyDetails.foundedYear ,
        address: companyDetails.address,
        location: companyDetails.location,
        city: selectedLocation?.city,
        country: selectedLocation?.country,
        companySize: companyDetails.companySize,
        website: companyDetails.website,
        phone: companyDetails.phone,
        email: companyDetails.email,
        // verified: 0, // Include required field
        // totalReviews: 0, // Include required field
        // overallRating: 0, // Include required field
        // logoUrl: companyDetails.logoUrl || '', // Include required field
        
        // Properly format services array with all required fields
        services: formattedServices,
        
        // // Make sure partnerships is an array of strings
        // partnerships: Array.isArray(companyDetails.partnerships) 
        //   ? companyDetails.partnerships 
        //   : []
      };
      
      console.log('Sending company data:', companyRequestData);
      
      // Send the update request with properly formatted data
      await CompanyService.editCompanyProfile(companyRequestData, token);
      
      setNotification({
        open: true,
        message: 'Company profile updated successfully',
        severity: 'success'
      });
      
      // Navigate back to company page after successful update
      setTimeout(() => {
        navigate(`/company/${companyDetails.name}`);
      }, 2000);
      
    } catch (error) {
      console.error('Error updating company profile:', error);
      setNotification({
        open: true,
        message: `Error updating company profile: ${error.message || 'Unknown error'}`,
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({
      ...prev,
      open: false
    }));
  };

  if (isFetching) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 'bold' }}>
        Edit Company Profile
      </Typography>
      <Divider sx={{ mb: 4 }} />

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>
      )}

      <Box component="form" noValidate>
        <Grid container spacing={3}>
          {/* Company Basic Information */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Company Name"
                      name="name"
                      value={companyDetails.name}
                      onChange={handleCompanyDetailsChange}
                      error={!!validationErrors.name}
                      helperText={validationErrors.name}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Founded Year</InputLabel>
                      <Select
                        value={companyDetails.foundedYear}
                        label="Founded Year"
                        name="foundedYear"
                        onChange={handleCompanyDetailsChange}
                      >
                        <MenuItem value="">
                          <em>Select year</em>
                        </MenuItem>
                        {generateYearOptions().map((year) => (
                          <MenuItem key={year} value={year}>{year}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Description"
                      name="description"
                      multiline
                      rows={4}
                      value={companyDetails.description}
                      onChange={handleCompanyDetailsChange}
                      error={!!validationErrors.description}
                      helperText={validationErrors.description}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Company Size</InputLabel>
                      <Select
                        value={companyDetails.companySize}
                        label="Company Size"
                        name="companySize"
                        onChange={handleCompanyDetailsChange}
                      >
                        <MenuItem value="">
                          <em>Select size</em>
                        </MenuItem>
                        {companySizeOptions.map((size) => (
                          <MenuItem key={size} value={size}>{size}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Website"
                      name="website"
                      value={companyDetails.website}
                      onChange={handleCompanyDetailsChange}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Contact Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={companyDetails.email}
                      onChange={handleCompanyDetailsChange}
                      error={!!validationErrors.email}
                      helperText={validationErrors.email}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CountryCodeSelector
                      value={companyDetails.phone || ''}
                      onChange={(value) => {
                        setCompanyDetails(prev => ({
                          ...prev,
                          phone: value
                        }));
                      }}
                      label="Phone Number"
                      error={!!validationErrors.phone}
                      helperText={validationErrors.phone}
                      variant="outlined"
                      fullWidth
                      size="medium"
                    />
                  </Grid>
                  <Grid item xs={12}>
                   
                    <Autocomplete
                      options={locationResults}
                      getOptionLabel={(option) => `${option.city}, ${option.country}`}
                      loading={loadingLocations}
                      value={selectedLocation}
                      onInputChange={(_, value) => {
                        if (!selectedLocation) {
                          setLocationQuery(value);
                        }
                      }}
                      onChange={(_, value) => {
                        if (value) {
                          handleAddLocation(value);
                        } else {
                          clearSelectedLocation();
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Location"
                          variant="outlined"
                          value={selectedLocation ? `${selectedLocation.city}, ${selectedLocation.country}` : locationQuery}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {loadingLocations ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                              </React.Fragment>
                            ),
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      name="address"
                      value={companyDetails.address}
                      onChange={handleCompanyDetailsChange}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Services */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Services
                </Typography>
                
                {validationErrors.services && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {validationErrors.services}
                  </Alert>
                )}
                
                <Box sx={{ width: '100%', mb: 2 }}>
                 
                  {/* Industry tabs */}
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs 
                      value={activeIndustryTab}
                      onChange={(_, newValue) => setActiveIndustryTab(newValue)}
                      variant="scrollable"
                      scrollButtons="auto"
                      aria-label="industry tabs"
                    >
                      {servicesByIndustry.map((industry, index) => (
                        <Tab key={index} label={industry.industry} id={`industry-tab-${index}`} />
                      ))}
                    </Tabs>
                  </Box>
                  
                  {/* Services as checkboxes by selected industry */}
                  <Box sx={{ pt: 2 }}>
                    {servicesByIndustry.length > 0 && servicesByIndustry[activeIndustryTab] && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {servicesByIndustry[activeIndustryTab]?.services.map((service) => (
                          <Box 
                            key={service.id} 
                            sx={{ 
                              width: 'calc(50% - 8px)',
                              maxWidth: '340px',
                              padding: '12px 16px',
                              borderRadius: '4px',
                              border: '1px solid',
                              borderColor: 'divider',
                              display: 'flex',
                              alignItems: 'center',
                              mb: 1,
                              bgcolor: 'background.paper'
                            }}
                          >
                            <input 
                              type="checkbox" 
                              id={`service-${service.id}`}
                              checked={selectedServices.includes(service.id)}
                              onChange={() => toggleService(service.id)}
                              style={{ 
                                marginRight: '12px',
                                width: '18px',
                                height: '18px',
                                cursor: 'pointer'
                              }}
                            />
                            <label 
                              htmlFor={`service-${service.id}`} 
                              style={{ 
                                cursor: 'pointer',
                                fontWeight: selectedServices.includes(service.id) ? 500 : 400
                              }}
                            >
                              {service.name}
                            </label>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                </Box>
                
                {/* Selected services summary - keep as chips */}
                <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                  <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                    Selected Services ({getSelectedServiceCount()})
                  </Typography>
                  
                  {selectedServices.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No services selected yet. Please select at least one service.
                    </Typography>
                  ) : (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedServices.map((serviceId) => {
                        const service = servicesByIndustry
                          .flatMap(industry => industry.services)
                          .find(service => service.id === serviceId);
                        
                        return (
                          <Chip
                            key={serviceId}
                            label={service ? service.name : 'Unknown Service'}
                            onDelete={() => toggleService(serviceId)}
                            color="primary"
                          />
                        );
                      })}
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Partnerships */}
          {/* <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Partnerships
                </Typography>
                <Autocomplete
                  multiple
                  freeSolo
                  options={[]}
                  value={companyDetails.partnerships}
                  onChange={handlePartnershipsChange}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Add partnerships (press Enter after each)"
                      placeholder="Enter partnership"
                    />
                  )}
                />
              </CardContent>
            </Card>
          </Grid> */}

          {/* Action Buttons */}
          <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Button 
              variant="outlined" 
              color="secondary"
              onClick={() => navigate(`/company/${companyName}`)}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Company Profile'}
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EditCompanyPage;