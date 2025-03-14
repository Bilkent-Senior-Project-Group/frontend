import React, { useState } from 'react';
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
  MenuItem,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ProjectService from '../../services/ProjectService';
import { colors } from '../../theme/theme';

const CreateProject = () => {
  const [projectDetails, setProjectDetails] = useState({
    name: '',
    description: '',
    industry: '',
    clientType: '',
    impact: '',
    technologiesUsed: [''],
    clientCompanyId: '',
    providerCompanyId: ''
  });

  // Add states for loading and notifications
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState(null);

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

  function isValidGuid(str) {
    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return guidRegex.test(str);
  }
  
  // Convert string to GUID if needed
  function convertToGuid(value) {
    if (!value) return null;
    if (isValidGuid(value)) return value; // Already a valid GUID
    throw new Error(`Invalid GUID format: ${value}`);
  }

  const handleSubmit = async () => {
    // Reset states
    setValidationErrors({});
    setError(null);
    setIsLoading(true);
    
    try {
      // Ensure we have the correct format before submission
      const formData = {
        name: projectDetails.name || 'Untitled Project',
        description: projectDetails.description || 'No description provided',
        industry: projectDetails.industry || '',
        clientType: projectDetails.clientType || 'Unknown',
        impact: projectDetails.impact || '',
        technologiesUsed: projectDetails.technologiesUsed.length > 0 && projectDetails.technologiesUsed[0] !== '' 
          ? projectDetails.technologiesUsed 
          : ['Not specified'],
        clientCompanyId: projectDetails.clientCompanyId || null,
        providerCompanyId: projectDetails.providerCompanyId || null,
      };
      
      const response = await ProjectService.createProject(formData);
      
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

  // Sample industry options (you might want to fetch these from an API)
  const industryOptions = [
    'Technology',
    'Finance',
    'Healthcare',
    'Education',
    'Manufacturing',
    'Retail',
    'Construction',
    'Entertainment',
    'Food & Beverage',
    'Transportation',
    'Energy',
    'Other'
  ];

  // Sample client types
  const clientTypeOptions = [
    'Enterprise',
    'Small Business',
    'Startup',
    'Government',
    'Non-profit',
    'Individual',
    'Other'
  ];

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
              name="name"
              value={projectDetails.name}
              onChange={handleProjectDetailsChange}
              variant="outlined"
              required
              error={!!validationErrors.name}
              helperText={validationErrors.name}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Industry"
              name="industry"
              value={projectDetails.industry}
              onChange={handleProjectDetailsChange}
              variant="outlined"
              error={!!validationErrors.industry}
              helperText={validationErrors.industry}
            >
              {industryOptions.map(option => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Client Type"
              name="clientType"
              value={projectDetails.clientType}
              onChange={handleProjectDetailsChange}
              variant="outlined"
              error={!!validationErrors.clientType}
              helperText={validationErrors.clientType}
            >
              {clientTypeOptions.map(option => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Client Company ID"
              name="clientCompanyId"
              value={projectDetails.clientCompanyId}
              onChange={handleProjectDetailsChange}
              variant="outlined"
              error={!!validationErrors.clientCompanyId}
              helperText={validationErrors.clientCompanyId}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Provider Company ID"
              name="providerCompanyId"
              value={projectDetails.providerCompanyId}
              onChange={handleProjectDetailsChange}
              variant="outlined"
              error={!!validationErrors.providerCompanyId}
              helperText={validationErrors.providerCompanyId}
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
              required
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

export default CreateProject;