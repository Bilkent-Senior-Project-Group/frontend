import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Grid,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Checkbox,
  InputAdornment,
  CardContent,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText
} from '@mui/material';
import { 
  Upload as UploadIcon, 
  Delete as DeleteIcon, 
  Add as AddIcon, 
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { MapPin } from 'lucide-react';
import { colors } from '../../theme/theme';

// Import the CompanyPDFExtractor component
import CompanyPDFExtractor from '../../components/CompanyPDFExtractor';

import { useNavigate, useLocation, Link } from 'react-router-dom';
import CompanyService from '../../services/CompanyService';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { API_URL } from '../../config/apiConfig.js';


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

const CreateCompanyPage = () => {
  const [companyDetails, setCompanyDetails] = useState({
    companyName: '',              
    description: '',       
    foundedYear: '',  
    address: '',  
    location: -1,           
    companySize: '',       
    website: '',          
    services: [],
    partnerships: [],  
    portfolio: [],  
    phone: '',
    email: '',                
  });

  const [projects, setProjects] = useState([]);
  const [openProjectDialog, setOpenProjectDialog] = useState(false);
  const [currentProject, setCurrentProject] = useState({
    projectName: '',
    description: '',                 
    completionDate: '',
    technologiesUsed: [''],               
    startDate: '',  
    completionDate: '',          
    isCompleted: true,     
    isOnCompedia: false,   
    projectUrl: '',      
    clientType: '',
    clientCompanyName: '',
    providerCompanyName: '',
    services: ["6d3f7103-8670-4f9e-92cc-08f3a37c8239"],  
  });
  const [editingProjectIndex, setEditingProjectIndex] = useState(null);
  
  // Add states for loading and notifications
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState(null);
  const {token, user, updateUser } = useAuth();
  const [servicesByIndustry, setServicesByIndustry] = useState([]);
  const [activeIndustryTab, setActiveIndustryTab] = useState(0);
  const [selectedServices, setSelectedServices] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [showServicePanel, setShowServicePanel] = useState(false);
  const [locationQuery, setLocationQuery] = useState('');
  const [locationResults, setLocationResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedLocationIds, setSelectedLocationIds] = useState(-1);

  // Generate years from 1800 to current year
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 1800; year--) {
      years.push(year);
    }
    return years;
  };

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
    // Change to store only the single selected location
    setSelectedLocation(`${location.city}, ${location.country}`);
    // Store just the single location ID
    setSelectedLocationIds(location.id);
    setLocationQuery('');
    setLocationResults([]);
  };

  const clearSelectedLocation = () => {
    setSelectedLocation(null);
    // Also clear the location ID when clearing the selection
    setSelectedLocationIds(-1);
  };

  const toggleService = (serviceId) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const getSelectedServiceCount = () => {
    return selectedServices.length;
  };


  const handleCompanyDetailsChange = (e) => {
    const { name, value } = e.target;
    // Ensure employeeSize is stored as a string
    if (name === 'companySize') {
      setCompanyDetails(prev => ({
        ...prev,
        [name]: value.toString()
      }));
    } else {
      setCompanyDetails(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle data extracted from PDF
  const handleExtractedData = (data) => {
    // Update company details with extracted information
    if (data.companyDetails) {
      setCompanyDetails(data.companyDetails);
    }
    
    // Update projects with extracted information
    if (data.projects && data.projects.length > 0) {
      setProjects(data.projects);
    }
    
    // Show notification
    setNotification({
      open: true,
      message: `Successfully extracted company information${data.projects?.length ? ` and ${data.projects.length} projects` : ''}`,
      severity: 'success'
    });
  };

  const handleCreateProject = () => {
    // Ensure all required fields have default values
    const formattedProject = {
      ...currentProject,
      projectName: currentProject.projectName || 'Untitled Project',
      description: currentProject.description || 'No description provided',
      startDate: currentProject.startDate || new Date().toISOString().split('T')[0],
      completionDate: currentProject.completionDate || new Date().toISOString().split('T')[0],
      technologiesUsed: currentProject.technologiesUsed || [''],
      isCompleted: true,
      projectUrl: currentProject.projectUrl || 'https://example.com', // Default URL for validation
      clientType: currentProject.clientType || 'Unknown', // Default client type for validation
      // Ensure company objects have valid structure
      clientCompanyName: currentProject.clientCompanyName || 'Unknown Client',
      providerCompanyName: currentProject.providerCompanyName || 'Unknown Provider',
      isOnCompedia: false,
      services: currentProject.services || ["6d3f7103-8670-4f9e-92cc-08f3a37c8239"]
    };
  
    if (editingProjectIndex !== null) {
      // Editing existing project
      const updatedProjects = [...projects];
      updatedProjects[editingProjectIndex] = formattedProject;
      setProjects(updatedProjects);
      setEditingProjectIndex(null);
    } else {
      // Adding new project
      setProjects(prev => [...prev, formattedProject]);
    }
    
    // Reset project dialog
    setCurrentProject({
      projectName: '',
      description: '',
      clientType: '',
      completionDate: '',
      startDate: '',
      technologiesUsed: [''],
      projectUrl: '',
      isCompleted: true,
      isOnCompedia: false,
      clientCompanyName: '',
      providerCompanyName: '',
      services: ["6d3f7103-8670-4f9e-92cc-08f3a37c8239"]
    });
    setOpenProjectDialog(false);
  };

  const handleEditProject = (index) => {
    const project = projects[index];
    
    setCurrentProject({
        projectName: project.projectName || '',
        description: project.description || '',
        startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
        completionDate: project.completionDate ? new Date(project.completionDate).toISOString().split('T')[0] : '',
        technologiesUsed: project.technologiesUsed || [''],
        projectUrl: project.projectUrl || '',
        isCompleted: project.isCompleted !== undefined ? project.isCompleted : true,
        isOnCompedia: project.isOnCompedia !== undefined ? project.isOnCompedia : false,
        clientType: project.clientType || '',
        // Update these to ensure proper DTO structure
        clientCompanyName: project.clientCompanyName || '',
        providerCompanyName: project.providerCompanyName || '',
        services: project.services || ["6d3f7103-8670-4f9e-92cc-08f3a37c8239"],
    });
    
    setEditingProjectIndex(index);
    setOpenProjectDialog(true);
};

  const handleDeleteProject = (index) => {
    setProjects(prev => prev.filter((_, i) => i !== index));
  };

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    
        setCurrentProject(prev => ({
            ...prev,
            [name]: value
        }));

  };

  const handleSubmit = async () => {
    // Reset states
    setValidationErrors({});
    setError(null);
    setIsLoading(true);
    
    try {
      // Prepare form data for DTO conversion
      const formData = {
        ...companyDetails,
        services: selectedServices, // Use the selected services from the new UI
        location: selectedLocationIds, // Add the selected location IDs
        portfolio: projects.map(project => ({
          projectName: project.projectName,
          description: project.description,
          startDate: project.startDate,
          completionDate: project.completionDate,
          clientType: project.clientType,
          projectUrl: project.projectUrl,
          isCompleted: project.isCompleted,
          isOnCompedia: project.isOnCompedia,
          clientCompanyName: project.clientCompanyName,
          providerCompanyName: project.providerCompanyName,
          technologiesUsed: project.technologiesUsed,
          services: project.services,
        }))
      };
      
      const response = await CompanyService.createCompany(formData, token);

      if(response.status == 200) {
        const updatedUser = { ...user };
        updatedUser.companies.push(response.data.data);

        updateUser(updatedUser);
      }else{
        console.error('Error adding company:', response.data.message);
      }

      console.log('Company added successfully:', response.data.data);
      
      setNotification({
        open: true,
        message: 'Company added successfully!',
        severity: 'success'
      });
      
      // Navigate away on success
      navigate('/home', {
        state: {
          message: 'Company added successfully!'
        }
      });
      
    } catch (err) {
      console.error('Error adding company:', err);
      
      // Try to extract detailed error information
      if (err.response?.data?.errors) {
        console.log('Validation errors from server:', err.response.data.errors);
        const backendErrors = err.response.data.errors;
        const formattedErrors = {};
        
        Object.keys(backendErrors).forEach(key => {
          // Skip the companyDto error since we're fixing that in the service
          if (key !== 'companyDto') {
            const formattedKey = key.startsWith('$.') 
              ? key.substring(2).toLowerCase() 
              : key.charAt(0).toLowerCase() + key.slice(1);
            formattedErrors[formattedKey] = backendErrors[key][0];
          }
        });
        
        setValidationErrors(formattedErrors);
      } else {
        // Handle general error
        setError(err.message || 'An error occurred while adding the company');
      }
      
      setNotification({
        open: true,
        message: err.response?.data?.title || err.message || 'An error occurred while adding the company',
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, color: colors.neutral[800] }}>
        Add New Company
      </Typography>

      {/* Replace the original PDF upload paper with the CompanyPDFExtractor component */}
      <CompanyPDFExtractor onExtracted={handleExtractedData} />

      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 3,
          border: `1px solid ${colors.neutral[200]}`,
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ mb: 3, color: colors.neutral[700] }}>
          Company Details
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Company Name"
              name="companyName"
              value={companyDetails.companyName}
              onChange={handleCompanyDetailsChange}
              variant="outlined"
              required
            />
          </Grid>
          {/* <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Founded Year"
              name="foundedYear"
              value={companyDetails.foundedYear}
              onChange={handleCompanyDetailsChange}
              variant="outlined"
              required
              helperText="Must be between 1800 and 2100"
            />
          </Grid> */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined" required>
              <InputLabel id="founded-year-label">Founded Year</InputLabel>
              <Select
                labelId="founded-year-label"
                id="foundedYear"
                name="foundedYear"
                value={companyDetails.foundedYear || ''}
                onChange={handleCompanyDetailsChange}
                label="Founded Year"
              >
                {generateYearOptions().map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Must be between 1800 and current year</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={companyDetails.address}
              onChange={handleCompanyDetailsChange}
              variant="outlined"
              required
            />
          </Grid>
          {/* <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Company Size"
              name="companySize"
              value={companyDetails.companySize}
              onChange={handleCompanyDetailsChange}
              variant="outlined"
              type="text"
              helperText="Enter number of employees (e.g., '100' or '100-500')"
            />
          </Grid> */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined" required>
              <InputLabel id="company-size-label">Company Size</InputLabel>
              <Select
                labelId="company-size-label"
                id="companySize"
                name="companySize"
                value={companyDetails.companySize || ''}
                onChange={handleCompanyDetailsChange}
                label="Company Size"
              >
                {companySizeOptions.map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Select the range that matches your company's employee count</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Website URL"
              name="website"
              value={companyDetails.website}
              onChange={handleCompanyDetailsChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={companyDetails.phone || ''}
              onChange={handleCompanyDetailsChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              value={companyDetails.email || ''}
              onChange={handleCompanyDetailsChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Company Description"
              name="description"
              value={companyDetails.description}
              onChange={handleCompanyDetailsChange}
              multiline
              rows={4}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder={selectedLocation ? selectedLocation : "Add a location..."}
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MapPin size={20} color="#9e9e9e" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <>
                    {selectedLocation && (
                      <IconButton 
                        size="small" 
                        onClick={clearSelectedLocation}
                        sx={{ mr: 0.5 }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                    {loadingLocations && <CircularProgress size={20} />}
                  </>
                ),
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
                  ...(selectedLocation && {
                    backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
                    color: 'primary.main',
                    fontWeight: 500,
                  }),
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
          </Grid>

          {/* Services Selection Component - Moved inside the Company Details Paper */}
          <Grid item xs={12}>
            <Box sx={{ width: '100%' }}>
              {/* Section 3: Services */}
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
                  <Typography variant="h6" fontWeight={600} color={colors.neutral[700]}>
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
                    <Box 
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
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </Grid>
          
        </Grid>
      </Paper>


      

      {/* Projects Section - Keeping it the same */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 3,
          border: `1px solid ${colors.neutral[200]}`,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ color: colors.neutral[700] }}>
            Previous Projects
          </Typography>
          <Button 
            startIcon={<AddIcon />}
            variant="contained"
            sx={{ 
              bgcolor: colors.primary[500],
              '&:hover': { bgcolor: colors.primary[600] }
            }}
            onClick={() => {
              setCurrentProject({
                projectName: '',
                description: '',
                clientType: '',
                completionDate: '',
                startDate: '',
                technologiesUsed: [''],
                projectUrl: '',
                isCompleted: true,
                isOnCompedia: false,
                clientCompanyName: '',
                providerCompanyName: '',
                services: ["6d3f7103-8670-4f9e-92cc-08f3a37c8239"]
              });
              setEditingProjectIndex(null);
              setOpenProjectDialog(true);
            }}
          >
            Add Project
          </Button>
        </Box>

        <Grid container spacing={3}>
        {projects.map((project, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Paper 
              elevation={1} 
              sx={{ 
                p: 2, 
                position: 'relative',
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" gutterBottom>
                {project.projectName}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {project.description}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">
                    {project.completionDate ? new Date(project.completionDate).toLocaleDateString() : 'No date'}
                  </Typography>
                </Box>
                
                {project.technologiesUsed && project.technologiesUsed.length > 0 && project.technologiesUsed[0] && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Technologies: {project.technologiesUsed.join(', ')}
                    </Typography>
                  </Box>
                )}
                
                {project.projectUrl && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      URL: {project.projectUrl}
                    </Typography>
                  </Box>
                )}
              </Box>
              <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                <IconButton 
                  size="small" 
                  onClick={() => handleEditProject(index)}
                  sx={{ mr: 1 }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton 
                  size="small" 
                  onClick={() => handleDeleteProject(index)}
                  color="error"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Paper>
          </Grid>
        ))}
          {projects.length === 0 && (
            <Grid item xs={12}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  textAlign: 'center',
                  bgcolor: colors.neutral[50],
                  color: colors.neutral[500],
                  border: `1px dashed ${colors.neutral[300]}`,
                  borderRadius: 2
                }}
              >
                <Typography>
                  No projects found in uploaded document. You can add projects manually or upload a PDF with project details.
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Paper>
        
        {/* Add this right before your submit button */}
      {(Object.keys(validationErrors).length > 0 || error) && (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            mb: 3,
            borderRadius: 2,
            backgroundColor: 'rgba(211, 47, 47, 0.08)',
            border: '1px solid rgba(211, 47, 47, 0.3)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Alert 
              severity="error" 
              sx={{ backgroundColor: 'transparent', p: 0, mb: 1 }}
            >
              <Typography variant="subtitle1" fontWeight={600}>
                Please fix the following errors:
              </Typography>
            </Alert>
          </Box>
          
          <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
            {Object.entries(validationErrors).map(([field, message]) => (
              <li key={field}>
                <Typography variant="body2" color="error.dark">
                  {message}
                </Typography>
              </li>
            ))}
            {error && (
              <li>
                <Typography variant="body2" color="error.dark">
                  {error}
                </Typography>
              </li>
            )}
          </ul>
        </Paper>
      )}

      {/* Update your submit button to show loading state */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isLoading}
          sx={{ 
            bgcolor: colors.primary[500],
            '&:hover': { bgcolor: colors.primary[600] },
            minWidth: '160px'
          }}
        >
          {isLoading ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
              Submitting...
            </>
          ) : (
            'Submit Company'
          )}
        </Button>
      </Box>

      {/* Project Dialog */}
      <Dialog 
        open={openProjectDialog} 
        onClose={() => setOpenProjectDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingProjectIndex !== null ? 'Edit Project' : 'Add New Project'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ pt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Project Name"
                name="projectName"
                value={currentProject.projectName}
                onChange={handleProjectChange}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Client Type"
                name="clientType"
                value={currentProject.clientType || ''}
                onChange={handleProjectChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Start Date"
                name="startDate"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={currentProject.startDate || ''}
                onChange={handleProjectChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Completion Date"
                name="completionDate"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={currentProject.completionDate || ''}
                onChange={handleProjectChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Project URL"
                name="projectUrl"
                value={currentProject.projectUrl || ''}
                onChange={handleProjectChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Client Company"
                name="clientCompanyName"
                value={currentProject.clientCompanyName || ''}
                onChange={handleProjectChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Provider Company"
                name="providerCompanyName"
                value={currentProject.providerCompanyName || ''}
                onChange={handleProjectChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Project Description"
                name="description"
                value={currentProject.description}
                onChange={handleProjectChange}
                multiline
                rows={4}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12}>
              {/* This could be replaced with a more sophisticated component for adding multiple technologies */}
              <TextField
                fullWidth
                label="Technologies Used (comma separated)"
                name="technologiesUsed"
                value={currentProject.technologiesUsed?.join(', ') || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setCurrentProject(prev => ({
                    ...prev,
                    technologiesUsed: value.split(',').map(tech => tech.trim())
                  }));
                }}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenProjectDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateProject} color="primary" variant="contained">
            {editingProjectIndex !== null ? 'Update Project' : 'Add Project'}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Notifications */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateCompanyPage;