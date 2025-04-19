import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Button, TextField, Grid, Card, CardContent,
  FormControl, InputLabel, Select, MenuItem, Chip, Paper, Tabs, Tab,
  Snackbar, Alert, Autocomplete, CircularProgress, Divider, LinearProgress
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

  // Add new state for service percentages
  const [servicePercentages, setServicePercentages] = useState({});

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

  // Add at the top of your file with other state variables
  const [isCheckingName, setIsCheckingName] = useState(false);
  const [nameSearchTimeout, setNameSearchTimeout] = useState(null);
  const [originalName, setOriginalName] = useState('');

  // Fetch company data when component mounts
  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!token || !companyName) {
        setIsFetching(false);
        return;
      }
      
      try {
        const companyData = await CompanyService.getCompany(companyName, token);
        
        // Store the original company name for comparison
        setOriginalName(companyData.name || '');
        
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
        
        // Set selected services and their percentages
        if (companyData.services && companyData.services.length > 0) {
          // Update selected services
          setSelectedServices(companyData.services.map(service => service.id));
          
          // Initialize service percentages
          const initialPercentages = {};
          companyData.services.forEach(service => {
            initialPercentages[service.id] = service.percentage || 0;
          });
          
          // Check if percentages sum to 100, otherwise normalize them
          const totalPercentage = Object.values(initialPercentages).reduce((sum, val) => sum + val, 0);
          
          if (totalPercentage === 0) {
            // If all percentages are 0, distribute evenly
            const evenPercentage = Math.floor(100 / companyData.services.length);
            companyData.services.forEach((service, index) => {
              if (index === companyData.services.length - 1) {
                // Last service gets the remainder to ensure total is exactly 100%
                initialPercentages[service.id] = 100 - (evenPercentage * (companyData.services.length - 1));
              } else {
                initialPercentages[service.id] = evenPercentage;
              }
            });
          } else if (totalPercentage !== 100) {
            // If percentages don't sum to 100, normalize them
            const factor = 100 / totalPercentage;
            Object.keys(initialPercentages).forEach(id => {
              initialPercentages[id] = Math.round(initialPercentages[id] * factor);
            });
            
            // Ensure the total is exactly 100% by adjusting the first service
            const adjustedTotal = Object.values(initialPercentages).reduce((sum, val) => sum + val, 0);
            if (adjustedTotal !== 100 && Object.keys(initialPercentages).length > 0) {
              const firstServiceId = Object.keys(initialPercentages)[0];
              initialPercentages[firstServiceId] += (100 - adjustedTotal);
            }
          }
          
          setServicePercentages(initialPercentages);
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
      let newSelected;
      if (prevSelected.includes(serviceId)) {
        newSelected = prevSelected.filter(id => id !== serviceId);
        // Remove percentage for this service
        setServicePercentages(prev => {
          const { [serviceId]: removed, ...rest } = prev;
          // Redistribute percentages among remaining services
          if (Object.keys(rest).length > 0) {
            const remainingTotal = 100;
            const factor = remainingTotal / Object.values(rest).reduce((sum, val) => sum + val, 0);
            return Object.fromEntries(
              Object.entries(rest).map(([id, percentage]) => [id, Math.round(percentage * factor)])
            );
          }
          return rest;
        });
      } else {
        newSelected = [...prevSelected, serviceId];
        
        // Add service with appropriate percentage distribution
        setServicePercentages(prev => {
          // Clear validation errors when adding a new service
          if (validationErrors.percentages) {
            setValidationErrors(prevErrors => ({
              ...prevErrors,
              percentages: null
            }));
          }
          
          const existingCount = Object.keys(prev).length;
          const updatedPercentages = { ...prev };
          
          if (existingCount === 0) {
            // First service gets 100%
            updatedPercentages[serviceId] = 100;
          } else {
            // Distribute evenly among all services (including the new one)
            const newPercentage = Math.floor(100 / (existingCount + 1));
            
            // Set all existing services to the new percentage
            Object.keys(updatedPercentages).forEach(key => {
              updatedPercentages[key] = newPercentage;
            });
            
            // Assign the last bit to the new service to ensure total is 100%
            updatedPercentages[serviceId] = 100 - (newPercentage * existingCount);
          }
          
          return updatedPercentages;
        });
      }
      
      // Clear services validation error if we now have services
      if (newSelected.length > 0 && validationErrors.services) {
        setValidationErrors(prev => ({
          ...prev,
          services: null
        }));
      }
      
      return newSelected;
    });
  };

  const handlePercentageChange = (serviceId, value) => {
    // Ensure value is a number between 0 and 100
    const percentage = Math.max(0, Math.min(100, parseInt(value) || 0));
    
    // Clear percentage validation error when user makes changes
    if (validationErrors.percentages) {
      setValidationErrors(prev => ({
        ...prev,
        percentages: null
      }));
    }
    
    setServicePercentages(prev => {
      const updatedPercentages = { ...prev, [serviceId]: percentage };
      
      // Calculate total of all except current
      const otherServices = Object.entries(updatedPercentages).filter(([id]) => id !== serviceId);
      const otherTotal = otherServices.reduce((sum, [, val]) => sum + val, 0);
      
      // Adjust other percentages if total exceeds 100
      if (percentage + otherTotal > 100) {
        // Calculate adjustment factor
        const excessTotal = percentage + otherTotal - 100;
        const totalToReduce = otherTotal;
        
        if (totalToReduce > 0) {
          otherServices.forEach(([id, val]) => {
            // Proportionally reduce other values
            const reduction = Math.round((val / totalToReduce) * excessTotal);
            updatedPercentages[id] = Math.max(0, val - reduction);
          });
        }
      }
      
      return updatedPercentages;
    });
  };

  const calculateRemainingPercentage = () => {
    const total = Object.values(servicePercentages).reduce((sum, val) => sum + val, 0);
    return 100 - total;
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
    
    // Check if company name already exists (but only if it's different from original)
    if (name === 'name' && value.trim() !== '') {
      // Clear any existing timeout
      if (nameSearchTimeout) {
        clearTimeout(nameSearchTimeout);
      }
      
      // If the name is the same as the original (case-insensitive), no need to check
      if (value.toLowerCase() === originalName.toLowerCase()) {
        return; // Skip the validation check - it's the original name
      }
      
      // Set a new timeout to avoid too many requests
      const timeoutId = setTimeout(async () => {
        setIsCheckingName(true);
        try {
          const results = await CompanyService.searchCompaniesByName(value, token);
          
          // Check if there's any company with the exact same name
          const nameExists = results.some(company => 
            company.companyName.toLowerCase() === value.toLowerCase()
          );
          
          if (nameExists) {
            setValidationErrors(prev => ({
              ...prev,
              name: 'This company name already exists. Please choose a different name.'
            }));
          }
        } catch (error) {
          console.error('Error checking company name:', error);
        } finally {
          setIsCheckingName(false);
        }
      }, 500);
      
      setNameSearchTimeout(timeoutId);
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
    
    // If we're checking the name or there's already a name error, form is invalid
    if (isCheckingName || validationErrors.name) {
      errors.name = validationErrors.name || 'Still checking name availability';
    }
    
    if (!companyDetails.description || companyDetails.description.trim() === '') {
      errors.description = 'Description is required';
    }
    
    if (!companyDetails.email || companyDetails.email.trim() === '') {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(companyDetails.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (companyDetails.phone && companyDetails.phone.trim() !== '') {
        const phoneValidation = validatePhoneNumber(companyDetails.phone);
        if (!phoneValidation.isValid) {
          errors.phone = phoneValidation.error || 'Phone number is invalid';
        }
    }
    
    if (selectedServices.length === 0) {
      errors.services = 'At least one service is required';
    }
    
    const totalPercentage = Object.values(servicePercentages).reduce((sum, val) => sum + val, 0);
    if (totalPercentage !== 100) {
      errors.percentages = `Service percentages must add up to 100% (currently ${totalPercentage}%)`;
    }
    
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
      // Format services correctly - ensure industryId is a valid GUID and include percentages
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
          id: id, // Default GUID if missing
          serviceName: service?.name,
          industryId: industryId, // Default GUID if missing
          industryName: industryInfo?.industry,
          percentage: servicePercentages[id] || 0, // Include percentage
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
                      helperText={
                        isCheckingName ? 'Checking name availability...' : validationErrors.name
                      }
                      InputProps={{
                        endAdornment: isCheckingName ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null,
                      }}
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
                
                {/* Selected services summary with percentages */}
                <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                  <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                    Selected Services ({getSelectedServiceCount()})
                  </Typography>
                  
                  {selectedServices.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No services selected yet. Please select at least one service.
                    </Typography>
                  ) : (
                    <>
                      {/* Service percentage distribution */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', mb: 3 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Distribute percentages among services (total must be 100%)
                        </Typography>
                        
                        {validationErrors.percentages && (
                          <Alert severity="error" sx={{ mb: 2 }}>
                            {validationErrors.percentages}
                          </Alert>
                        )}
                        
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                          {selectedServices.map((serviceId) => {
                            const service = servicesByIndustry
                              .flatMap(industry => industry.services)
                              .find(service => service.id === serviceId);
                            
                            return (
                              <Grid item xs={12} sm={6} key={serviceId}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Typography variant="body2" sx={{ minWidth: '150px', mr: 1 }}>
                                    {service ? service.name : 'Unknown Service'}:
                                  </Typography>
                                  <TextField
                                    size="small"
                                    type="number"
                                    InputProps={{
                                      endAdornment: <Typography>%</Typography>,
                                      inputProps: { min: 0, max: 100 }
                                    }}
                                    value={servicePercentages[serviceId] || 0}
                                    onChange={(e) => handlePercentageChange(serviceId, e.target.value)}
                                    sx={{ width: '100px' }}
                                  />
                                </Box>
                              </Grid>
                            );
                          })}
                        </Grid>
                        
                        {/* Total percentage indicator */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                          <Typography variant="body2" fontWeight="medium">
                            Total: {Object.values(servicePercentages).reduce((sum, val) => sum + val, 0)}%
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color={calculateRemainingPercentage() === 0 ? "success.main" : "error.main"}
                            fontWeight="medium"
                          >
                            {calculateRemainingPercentage() === 0 ? "✓ Valid distribution" : `${Math.abs(calculateRemainingPercentage())}% ${calculateRemainingPercentage() > 0 ? "remaining" : "over"}`}
                          </Typography>
                        </Box>
                      </Box>
                      
                      {/* Service percentage bars visualization */}
                      {selectedServices.length > 0 && (
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" sx={{ mb: 2 }}>Service Distribution</Typography>
                          {selectedServices.map((serviceId) => {
                            const service = servicesByIndustry
                              .flatMap(industry => industry.services)
                              .find(service => service.id === serviceId);
                            const percentage = servicePercentages[serviceId] || 0;
                            
                            return (
                              <Box key={serviceId} sx={{ mb: 1.5 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                  <Typography variant="body2">{service ? service.name : 'Unknown'}</Typography>
                                  <Typography variant="body2" fontWeight="medium">{percentage}%</Typography>
                                </Box>
                                <Box 
                                  sx={{ 
                                    position: 'relative',
                                    height: 10,
                                    width: '100%',
                                    bgcolor: 'rgba(0,0,0,0.08)',
                                    borderRadius: 1,
                                    overflow: 'hidden',
                                    cursor: 'pointer'
                                  }}
                                  onClick={(e) => {
                                    // Calculate percentage based on click position
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const clickX = e.clientX - rect.left;
                                    const totalWidth = rect.width;
                                    const clickPercentage = Math.round((clickX / totalWidth) * 100);
                                    
                                    // Update the percentage for this service
                                    handlePercentageChange(serviceId, clickPercentage);
                                  }}
                                >
                                  <Box 
                                    sx={{
                                      position: 'absolute',
                                      height: '100%',
                                      width: `${percentage}%`,
                                      bgcolor: 'primary.main',
                                      borderRadius: 1,
                                      transition: 'width 0.3s ease'
                                    }}
                                  />
                                  {/* Invisible slider overlay for dragging */}
                                  <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={percentage}
                                    onChange={(e) => handlePercentageChange(serviceId, e.target.value)}
                                    style={{
                                      position: 'absolute',
                                      top: 0,
                                      left: 0,
                                      width: '100%',
                                      height: '100%',
                                      opacity: 0,
                                      cursor: 'pointer'
                                    }}
                                  />
                                </Box>
                              </Box>
                            );
                          })}
                        </Box>
                      )}
                      
                      {/* Service chips */}
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {selectedServices.map((serviceId) => {
                          const service = servicesByIndustry
                            .flatMap(industry => industry.services)
                            .find(service => service.id === serviceId);
                          
                          return (
                            <Chip
                              key={serviceId}
                              label={`${service ? service.name : 'Unknown Service'} (${servicePercentages[serviceId] || 0}%)`}
                              onDelete={() => toggleService(serviceId)}
                              color="primary"
                            />
                          );
                        })}
                      </Box>
                    </>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

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