import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Grid,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  Autocomplete,
  Chip,
  FormHelperText,
  Tabs,
  Tab,
  Card,
  CardContent
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import ProjectService from '../../services/ProjectService';
import CompanyService from '../../services/CompanyService';
import { colors } from '../../theme/theme';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { API_URL } from '../../config/apiConfig.js';

const CreateProjectPage = () => {
  const location = useLocation();
  
  // Get any pre-filled data from navigation state
  const providerCompanyFromNavigation = location.state?.providerCompany || '';
  
  const [projectDetails, setProjectDetails] = useState({
    projectName: '',
    description: '',
    clientType: '',
    impact: '',
    technologiesUsed: [],
    clientCompanyName: '',
    providerCompanyName: providerCompanyFromNavigation,
    services: [],
  });

  // Add states for loading and notifications
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  // States for company autocomplete
  const [clientCompanyOptions, setClientCompanyOptions] = useState([]);
  const [providerCompanyOptions, setProviderCompanyOptions] = useState([]);
  const [clientInputValue, setClientInputValue] = useState('');
  const [providerInputValue, setProviderInputValue] = useState(providerCompanyFromNavigation);

  // Services states
  const [servicesByIndustry, setServicesByIndustry] = useState([]);
  const [activeIndustryTab, setActiveIndustryTab] = useState(0);
  const [selectedServices, setSelectedServices] = useState([]);
  const [showServicePanel, setShowServicePanel] = useState(false);

  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState(null);
  const { token, user } = useAuth();

  // Add this constant for technology options
  const technologyOptions = [
    // Programming Languages
    "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "Go", "PHP", "Ruby", "Swift", "Kotlin", "Rust",
    
    // Frameworks & Libraries - Frontend
    "React", "Angular", "Vue.js", "Svelte", "Next.js", "Nuxt.js",
    
    // Frameworks & Libraries - Backend
    "Node.js", "Express.js", "Django", "Flask", "Spring Boot", "ASP.NET Core", "Laravel", "Ruby on Rails", "FastAPI",
    
    // Frameworks & Libraries - Mobile
    "React Native", "Flutter", "SwiftUI", "Android SDK",
    
    // Databases
    "PostgreSQL", "MySQL", "SQLite", "MongoDB", "Redis", "Firebase Realtime DB", "Firestore", "Microsoft SQL Server", "Cassandra", "Neo4j",
    
    // Cloud & DevOps
    "AWS", "Microsoft Azure", "Google Cloud Platform", "Docker", "Kubernetes", "Jenkins", "GitHub Actions", "GitLab CI/CD", "Vercel", "Netlify", "Heroku",
    
    // AI/ML & Data
    "TensorFlow", "PyTorch", "Scikit-learn", "OpenCV", "Pandas", "NumPy", "Hugging Face Transformers", "Keras", "spaCy", "LangChain", "OpenAI API", "NLTK",
    
    // Tools & Miscellaneous
    "Git", "GitHub", "GitLab", "Figma", "Postman", "Swagger", "OpenAPI", "Elasticsearch", "RabbitMQ", "Apache Kafka", "REST API", "GraphQL", "WebSockets"
  ];

  // Add new state for user's companies
  const [userCompanies, setUserCompanies] = useState([]);
  const [isLoadingUserCompanies, setIsLoadingUserCompanies] = useState(true);

  // Add states to track company verification status
  const [clientCompanyVerified, setClientCompanyVerified] = useState(null);
  const [providerCompanyVerified, setProviderCompanyVerified] = useState(null);
  const [isCheckingClientVerification, setIsCheckingClientVerification] = useState(false);
  const [isCheckingProviderVerification, setIsCheckingProviderVerification] = useState(false);

  // Fetch companies when input changes
  useEffect(() => {
    const fetchClientCompanies = async () => {
      if (clientInputValue.length >= 2) {
        try {
          const companies = await CompanyService.searchCompaniesByName(clientInputValue);
          setClientCompanyOptions(companies);
        } catch (error) {
          console.error("Error fetching client companies:", error);
        }
      }
    };

    const timer = setTimeout(() => {
      fetchClientCompanies();
    }, 300);

    return () => clearTimeout(timer);
  }, [clientInputValue]);

  useEffect(() => {
    const fetchProviderCompanies = async () => {
      if (providerInputValue.length >= 2) {
        try {
          const companies = await CompanyService.searchCompaniesByName(providerInputValue);
          setProviderCompanyOptions(companies);
        } catch (error) {
          console.error("Error fetching provider companies:", error);
        }
      }
    };

    const timer = setTimeout(() => {
      fetchProviderCompanies();
    }, 300);

    return () => clearTimeout(timer);
  }, [providerInputValue]);

  // Add this new useEffect to fetch services when component mounts
  useEffect(() => {
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

    fetchIndustryServices();
  }, []);

  // Fetch user's companies when component mounts
  useEffect(() => {
    const fetchUserCompanies = async () => {
      if (user && user.id && token) {
        try {
          setIsLoadingUserCompanies(true);
          const companies = await CompanyService.getCompaniesOfUser(user.id, token);
          setUserCompanies(companies);
          console.log('User companies:', companies);
        } catch (error) {
          console.error('Error fetching user companies:', error);
          setNotification({
            open: true,
            message: 'Error fetching your companies: ' + (error.message || 'Unknown error'),
            severity: 'error'
          });
        } finally {
          setIsLoadingUserCompanies(false);
        }
      } else {
        setIsLoadingUserCompanies(false);
      }
    };
    
    fetchUserCompanies();
  }, [user, token]);

  // Add a debounced effect to check client company verification when the name changes
  useEffect(() => {
    const checkClientCompanyVerification = async () => {
      if (projectDetails.clientCompanyName && projectDetails.clientCompanyName.trim().length > 0) {
        setIsCheckingClientVerification(true);
        try {
          const companyData = await CompanyService.getCompany(projectDetails.clientCompanyName, token);
          setClientCompanyVerified(companyData.verified === 1);
          
          // Clear validation errors if company is now verified
          if (companyData.verified === 1 && validationErrors.clientCompanyVerified) {
            setValidationErrors(prev => {
              const updated = { ...prev };
              delete updated.clientCompanyVerified;
              return updated;
            });
          }
        } catch (error) {
          console.error('Error checking client company verification:', error);
          setClientCompanyVerified(false);
        } finally {
          setIsCheckingClientVerification(false);
        }
      } else {
        setClientCompanyVerified(null);
      }
    };

    const timer = setTimeout(() => {
      checkClientCompanyVerification();
    }, 500); // Debounce to avoid too many API calls

    return () => clearTimeout(timer);
  }, [projectDetails.clientCompanyName, token]);

  // Add a debounced effect to check provider company verification when the name changes
  useEffect(() => {
    const checkProviderCompanyVerification = async () => {
      if (projectDetails.providerCompanyName && projectDetails.providerCompanyName.trim().length > 0) {
        setIsCheckingProviderVerification(true);
        try {
          const companyData = await CompanyService.getCompany(projectDetails.providerCompanyName, token);
          setProviderCompanyVerified(companyData.verified === 1);
          
          // Clear validation errors if company is now verified
          if (companyData.verified === 1 && validationErrors.providerCompanyVerified) {
            setValidationErrors(prev => {
              const updated = { ...prev };
              delete updated.providerCompanyVerified;
              return updated;
            });
          }
        } catch (error) {
          console.error('Error checking provider company verification:', error);
          setProviderCompanyVerified(false);
        } finally {
          setIsCheckingProviderVerification(false);
        }
      } else {
        setProviderCompanyVerified(null);
      }
    };

    const timer = setTimeout(() => {
      checkProviderCompanyVerification();
    }, 500); // Debounce to avoid too many API calls

    return () => clearTimeout(timer);
  }, [projectDetails.providerCompanyName, token]);

  // Verify the provider company when it's pre-filled from navigation
  useEffect(() => {
    if (providerCompanyFromNavigation) {
      const checkProviderCompanyVerification = async () => {
        setIsCheckingProviderVerification(true);
        try {
          const companyData = await CompanyService.getCompany(providerCompanyFromNavigation, token);
          setProviderCompanyVerified(companyData.verified === 1);
          
          // Clear validation errors if company is now verified
          if (companyData.verified === 1 && validationErrors.providerCompanyVerified) {
            setValidationErrors(prev => {
              const updated = { ...prev };
              delete updated.providerCompanyVerified;
              return updated;
            });
          }
        } catch (error) {
          console.error('Error checking provider company verification:', error);
          setProviderCompanyVerified(false);
        } finally {
          setIsCheckingProviderVerification(false);
        }
      };

      checkProviderCompanyVerification();
    }
  }, [providerCompanyFromNavigation, token]);

  const handleProjectDetailsChange = (e) => {
    const { name, value } = e.target;
    setProjectDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add this function to toggle services
  const toggleService = (serviceId) => {
    setSelectedServices(prevSelected => {
      let newSelected;
      if (prevSelected.includes(serviceId)) {
        newSelected = prevSelected.filter(id => id !== serviceId);
      } else {
        newSelected = [...prevSelected, serviceId];
      }
      
      // Update the projectDetails with the new selected services
      setProjectDetails(prev => ({
        ...prev,
        services: newSelected
      }));
      
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

  // Add this function to get selected service count
  const getSelectedServiceCount = () => {
    return selectedServices.length;
  };

  const validateForm = () => {
    const errors = {};
    if (!projectDetails.projectName || projectDetails.projectName.trim() === '') {
      errors.projectName = "Project name is required";
    }
    if (!projectDetails.clientCompanyName || projectDetails.clientCompanyName.trim() === '') {
      errors.clientCompanyName = "Client company is required";
    }
    if (!projectDetails.providerCompanyName || projectDetails.providerCompanyName.trim() === '') {
      errors.providerCompanyName = "Provider company is required";
    }
    
    // Check if companies are verified
    if (clientCompanyVerified === false) {
      errors.clientCompanyVerified = "Client company is not verified. Projects can only be created for verified companies.";
    }
    
    if (providerCompanyVerified === false) {
      errors.providerCompanyVerified = "Provider company is not verified. Projects can only be created for verified companies.";
    }
    
    // Check if user is associated with either the client or provider company
    const isUserAssociatedWithProject = userCompanies.some(company => 
      company.companyName === projectDetails.clientCompanyName || 
      company.companyName === projectDetails.providerCompanyName
    );
    
    if (!isUserAssociatedWithProject && userCompanies.length > 0) {
      errors.authorization = "You can only create projects for companies you are associated with";
    }
    
    // Check for selected services
    if (selectedServices.length === 0) {
      errors.services = "At least one service is required";
    }
    
    return errors;
  };

  const handleSubmit = async () => {
    // Reset states
    setValidationErrors({});
    setError(null);
    
    // Validate required fields
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setValidationErrors(formErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Format services correctly with the proper structure expected by the API
      const formattedServices = selectedServices.map(id => {
        const service = servicesByIndustry
          .flatMap(industry => industry.services)
          .find(service => service.id === id);
        
        // Find the industry this service belongs to
        const industryInfo = servicesByIndustry.find(ind => 
          ind.services.some(s => s.id === id)
        );
        
        // Return the service ID in the format expected by the API (as a string)
        return service ? service.id : null;
      }).filter(id => id !== null); // Remove any null values

      // Ensure we have the correct format before submission
      const formData = {
        projectName: projectDetails.projectName,
        description: projectDetails.description || 'No description provided',
        clientType: projectDetails.clientType || 'Unknown',
        impact: projectDetails.impact || '',
        technologiesUsed: projectDetails.technologiesUsed.length > 0 && projectDetails.technologiesUsed[0] !== '' 
          ? projectDetails.technologiesUsed 
          : ['Not specified'],
        clientCompanyName: projectDetails.clientCompanyName,
        providerCompanyName: projectDetails.providerCompanyName,
        services: formattedServices, // Now it should be an array of service IDs as strings
      };
      
      console.log('Submitting project with data:', formData);
      
      const response = await ProjectService.createProject(formData, token);
      
      console.log('Project added successfully:', response);
      
      setNotification({
        open: true,
        message: 'Project created successfully!',
        severity: 'success'
      });
      
      // Navigate away on success
      navigate('/home', {
        state: {
          message: 'Project created successfully!'
        }
      });
      
    } catch (err) {
      console.error('Error creating project:', err);
      
      // Try to extract detailed error information
      if (err.response?.data?.errors) {
        console.log('Validation errors from server:', err.response.data.errors);
        const backendErrors = err.response.data.errors;
        const formattedErrors = {};
        
        Object.keys(backendErrors).forEach(key => {
          const formattedKey = key.startsWith('$.') 
            ? key.substring(2).toLowerCase() 
            : key.charAt(0).toLowerCase() + key.slice(1);
          formattedErrors[formattedKey] = backendErrors[key][0];
        });
        
        setValidationErrors(formattedErrors);
      } else {
        // Handle general error
        setError(err.message || 'An error occurred while creating the project');
      }
      
      setNotification({
        open: true,
        message: err.response?.data?.title || err.message || 'An error occurred while creating the project',
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
        Create New Project
      </Typography>

      {isLoadingUserCompanies ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {userCompanies.length === 0 && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              You're not associated with any companies. You need to be part of at least one company to create projects.
            </Alert>
          )}

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
              Project Details
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Project Name"
                  name="projectName"
                  value={projectDetails.projectName}
                  onChange={handleProjectDetailsChange}
                  variant="outlined"
                  required
                  error={!!validationErrors.projectName}
                  helperText={validationErrors.projectName}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Client Type"
                  name="clientType"
                  value={projectDetails.clientType}
                  onChange={handleProjectDetailsChange}
                  variant="outlined"
                  error={!!validationErrors.clientType}
                  helperText={validationErrors.clientType}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={clientCompanyOptions}
                  getOptionLabel={(option) => option.companyName || ''}
                  inputValue={clientInputValue}
                  onInputChange={(event, newInputValue) => {
                    setClientInputValue(newInputValue);
                  }}
                  onChange={(event, newValue) => {
                    setProjectDetails(prev => ({
                      ...prev,
                      clientCompanyName: newValue?.companyName || ''
                    }));
                    // Reset verification status when company changes
                    setClientCompanyVerified(null);
                  }}
                  isOptionEqualToValue={(option, value) => option.companyName === value.companyName}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Client Company"
                      required
                      error={!!validationErrors.clientCompanyName || clientCompanyVerified === false}
                      helperText={
                        validationErrors.clientCompanyName || 
                        (clientCompanyVerified === false ? 
                          "This company is not verified. Projects can only be created for verified companies." : 
                          "")
                      }
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {isCheckingClientVerification ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : clientCompanyVerified === true ? (
                              <Box component="span" sx={{ color: 'success.main', display: 'flex', alignItems: 'center' }}>
                                ✓ Verified
                              </Box>
                            ) : clientCompanyVerified === false ? (
                              <Box component="span" sx={{ color: 'error.main', display: 'flex', alignItems: 'center' }}>
                                ✗ Not Verified
                              </Box>
                            ) : null}
                            {params.InputProps.endAdornment}
                          </>
                        )
                      }}
                    />
                  )}
                  freeSolo
                  noOptionsText="Type to search companies"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={providerCompanyOptions}
                  getOptionLabel={(option) => option.companyName || ''}
                  inputValue={providerInputValue}
                  onInputChange={(event, newInputValue) => {
                    setProviderInputValue(newInputValue);
                    // Also update projectDetails when text is manually edited/deleted
                    if (event) {
                      setProjectDetails(prev => ({
                        ...prev,
                        providerCompanyName: newInputValue
                      }));
                      
                      // Reset verification status when text changes
                      if (projectDetails.providerCompanyName !== newInputValue) {
                        setProviderCompanyVerified(null);
                      }
                    }
                  }}
                  onChange={(event, newValue) => {
                    // This handles dropdown selection
                    const newCompanyName = newValue?.companyName || '';
                    setProjectDetails(prev => ({
                      ...prev,
                      providerCompanyName: newCompanyName
                    }));
                    // Reset verification status when company changes
                    setProviderCompanyVerified(null);
                  }}
                  isOptionEqualToValue={(option, value) => option.companyName === value.companyName}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Provider Company"
                      required
                      error={!!validationErrors.providerCompanyName || providerCompanyVerified === false}
                      helperText={
                        validationErrors.providerCompanyName || 
                        (providerCompanyVerified === false ? 
                          "This company is not verified. Projects can only be created for verified companies." : 
                          "")
                      }
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {isCheckingProviderVerification ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : providerCompanyVerified === true ? (
                              <Box component="span" sx={{ color: 'success.main', display: 'flex', alignItems: 'center' }}>
                                ✓ Verified
                              </Box>
                            ) : providerCompanyVerified === false ? (
                              <Box component="span" sx={{ color: 'error.main', display: 'flex', alignItems: 'center' }}>
                                ✗ Not Verified
                              </Box>
                            ) : null}
                            {params.InputProps.endAdornment}
                          </>
                        )
                      }}
                    />
                  )}
                  freeSolo
                  noOptionsText="Type to search companies"
                  value={projectDetails.providerCompanyName ? { companyName: projectDetails.providerCompanyName } : null}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Technologies Used
                </Typography>
                <Autocomplete
                  multiple
                  id="technologies-autocomplete"
                  options={technologyOptions}
                  freeSolo
                  value={projectDetails.technologiesUsed || []}
                  onChange={(event, newValue) => {
                    setProjectDetails(prev => ({
                      ...prev,
                      technologiesUsed: newValue.map(item => item.trim()).filter(item => item !== '')
                    }));
                  }}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        label={option}
                        {...getTagProps({ index })}
                        key={index}
                        size="small"
                        sx={{
                          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                          color: 'primary.main',
                          fontWeight: 500,
                          borderRadius: 1.5,
                        }}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder={projectDetails.technologiesUsed?.length > 0 ? "" : "Add technologies..."}
                      fullWidth
                      error={!!validationErrors.technologiesUsed}
                      helperText={validationErrors.technologiesUsed}
                    />
                  )}
                  filterOptions={(options, params) => {
                    const filtered = options.filter(option => 
                      option.toLowerCase().includes(params.inputValue.toLowerCase())
                    );
                    
                    // Add the option to add a new value if it's not in our list
                    const isExisting = options.some(
                      option => option.toLowerCase() === params.inputValue.toLowerCase()
                    );
                    
                    if (params.inputValue !== '' && !isExisting) {
                      filtered.push(params.inputValue);
                    }
                    
                    return filtered;
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      paddingLeft: 1,
                      '& input': { paddingTop: 1, paddingBottom: 1 }
                    }
                  }}
                />
                <FormHelperText>
                  Start typing to see suggestions or add your own technologies
                </FormHelperText>
              </Grid>

              {/* Add Services Selection Section */}
              <Grid item xs={12}>
                <Card sx={{ mt: 3 }}>
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
                    
                    {/* Selected services summary */}
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
                          {/* Service chips */}
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
                        </>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Project Impact"
                  name="impact"
                  value={projectDetails.impact}
                  onChange={handleProjectDetailsChange}
                  multiline
                  rows={2}
                  variant="outlined"
                  error={!!validationErrors.impact}
                  helperText={validationErrors.impact}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Project Description"
                  name="description"
                  value={projectDetails.description}
                  onChange={handleProjectDetailsChange}
                  multiline
                  rows={4}
                  variant="outlined"
                  error={!!validationErrors.description}
                  helperText={validationErrors.description}
                />
              </Grid>
            </Grid>
          </Paper>
        
          {/* Display errors if any */}
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

          {/* Submit button with loading state and disabled when conditions aren't met */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={
                isLoading || 
                userCompanies.length === 0 ||
                isCheckingClientVerification || 
                isCheckingProviderVerification || 
                clientCompanyVerified === false || 
                providerCompanyVerified === false
              }
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
                'Create Project'
              )}
            </Button>
          </Box>
        </>
      )}

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

export default CreateProjectPage;