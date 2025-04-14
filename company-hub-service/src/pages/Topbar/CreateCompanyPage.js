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
  Alert
} from '@mui/material';
import { 
  Upload as UploadIcon, 
  Delete as DeleteIcon, 
  Add as AddIcon, 
  Edit as EditIcon 
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { colors } from '../../theme/theme';

// Import the CompanyPDFExtractor component
import CompanyPDFExtractor from '../../components/CompanyPDFExtractor';

import { useNavigate, useLocation, Link } from 'react-router-dom';
import CompanyService from '../../services/CompanyService';
import { useAuth } from '../../contexts/AuthContext';

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
    services: ["6d3f7103-8670-4f9e-92cc-08f3a37c8239"],
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
      projectName: currentProject.name || 'Untitled Project',
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
      companyDetails.portfolio = projects.map(project => ({
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
      }));
      const formData = companyDetails;
      
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
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={companyDetails.location}
              onChange={handleCompanyDetailsChange}
              variant="outlined"
              required
              helperText="This will be used for both Address and Location"
              type="number"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="address"
              name="address"
              value={companyDetails.address}
              onChange={handleCompanyDetailsChange}
              variant="outlined"
              required
              helperText="This will be used for both Address"
            />
          </Grid>
          <Grid item xs={12} md={4}>
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
          </Grid>
          <Grid item xs={12} md={4}>
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
          </Grid>
          <Grid item xs={12} md={4}>
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
        </Grid>
      </Paper>

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