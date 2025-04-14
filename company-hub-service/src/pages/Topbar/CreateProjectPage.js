import React, { useState, useEffect } from 'react';
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
  Autocomplete
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ProjectService from '../../services/ProjectService';
import CompanyService from '../../services/CompanyService';
import { colors } from '../../theme/theme';
import { useAuth } from '../../contexts/AuthContext';

const CreateProjectPage = () => {
  const [projectDetails, setProjectDetails] = useState({
    projectName: '',
    description: '',
    clientType: '',
    impact: '',
    technologiesUsed: [''],
    clientCompanyName: '',
    providerCompanyName: '',
    services: ["6d3f7103-8670-4f9e-92cc-08f3a37c8239"],
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
  const [providerInputValue, setProviderInputValue] = useState('');

  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState(null);
  const {token} = useAuth();

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

  const handleProjectDetailsChange = (e) => {
    const { name, value } = e.target;
    setProjectDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTechnologiesChange = (e) => {
    const value = e.target.value;
    setProjectDetails(prev => ({
      ...prev,
      technologiesUsed: value.split(',').map(tech => tech.trim()).filter(tech => tech !== '')
    }));
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
        services: projectDetails.services,
      };
      
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
              }}
              isOptionEqualToValue={(option, value) => option.companyName === value.companyName}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Client Company"
                  required
                  error={!!validationErrors.clientCompanyName}
                  helperText={validationErrors.clientCompanyName}
                  variant="outlined"
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
              }}
              onChange={(event, newValue) => {
                setProjectDetails(prev => ({
                  ...prev,
                  providerCompanyName: newValue?.companyName || ''
                }));
              }}
              isOptionEqualToValue={(option, value) => option.companyName === value.companyName}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Provider Company"
                  required
                  error={!!validationErrors.providerCompanyName}
                  helperText={validationErrors.providerCompanyName}
                  variant="outlined"
                />
              )}
              freeSolo
              noOptionsText="Type to search companies"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Technologies Used (comma separated)"
              name="technologiesUsed"
              value={projectDetails.technologiesUsed.join(', ')}
              onChange={handleTechnologiesChange}
              variant="outlined"
              error={!!validationErrors.technologiesUsed}
              helperText={validationErrors.technologiesUsed || "Enter technologies separated by commas"}
            />
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

      {/* Submit button with loading state */}
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
            'Create Project'
          )}
        </Button>
      </Box>

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