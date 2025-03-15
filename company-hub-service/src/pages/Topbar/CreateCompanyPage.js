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
    name: '',              
    description: '',       
    foundingYear: '',    
    location: '',           
    employeeSize: '',       
    websiteUrl: '',          
    specialties: '',         
    industries: '',          
    contactInfo: '',         
    coreExpertise: ''        
  });

  const [projects, setProjects] = useState([]);
  const [openProjectDialog, setOpenProjectDialog] = useState(false);
  const [currentProject, setCurrentProject] = useState({
    name: '',
    description: '',      
    industry: '',           
    completionDate: '',
    technologiesUsed: [''],   
    impact: '',               
    startDate: '',            
    isCompleted: true,        
    projectUrl: '',      
    clientType: '',
    // Ensure valid GUIDs are set
    clientCompany: {
        companyId: uuidv4(), // Always set a valid GUID
        companyName: ''
    },
    providerCompany: {
        companyId: uuidv4(), // Always set a valid GUID
        companyName: ''
    },
    company: {
        companyId: uuidv4(), // Always set a valid GUID
        companyName: ''
    }
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
    setCompanyDetails(prev => ({
      ...prev,
      [name]: value
    }));
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
      name: currentProject.name || 'Untitled Project',
      projectName: currentProject.name || 'Untitled Project',
      description: currentProject.description || 'No description provided',
      startDate: currentProject.startDate || new Date().toISOString().split('T')[0],
      completionDate: currentProject.completionDate || new Date().toISOString().split('T')[0],
      technologiesUsed: Array.isArray(currentProject.technologiesUsed) && 
                        currentProject.technologiesUsed.length > 0 && 
                        currentProject.technologiesUsed[0] !== '' 
                        ? currentProject.technologiesUsed 
                        : ['Not specified'],
      isCompleted: currentProject.isCompleted !== undefined ? currentProject.isCompleted : true,
      projectUrl: currentProject.projectUrl || 'https://example.com', // Default URL for validation
      clientType: currentProject.clientType || 'Unknown', // Default client type for validation
      // Ensure company objects have valid structure
      clientCompany: {
        companyId: currentProject.clientCompany?.companyId || uuidv4(),
        companyName: currentProject.clientCompany?.companyName || 'Unknown Client'
      },
      providerCompany: {
        companyId: currentProject.providerCompany?.companyId || uuidv4(),
        companyName: currentProject.providerCompany?.companyName || 'Unknown Provider'
      },
      company: {
        companyId: currentProject.company?.companyId || uuidv4(),
        companyName: currentProject.company?.companyName || 'Unknown Company'
      }
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
      name: '',
      description: '',
      industry: '',
      clientType: '',
      completionDate: '',
      startDate: '',
      impact: '',
      technologiesUsed: [''],
      projectUrl: '',
      isCompleted: true,
      clientCompany: {
        companyId: uuidv4(),
        companyName: ''
      },
      providerCompany: {
        companyId: uuidv4(),
        companyName: ''
      },
      company: {
        companyId: uuidv4(),
        companyName: ''
      }
    });
    setOpenProjectDialog(false);
  };

  const handleEditProject = (index) => {
    const project = projects[index];
    
    setCurrentProject({
        name: project.name || '',
        description: project.description || '',
        type: project.type || '',
        startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
        completionDate: project.completionDate ? new Date(project.completionDate).toISOString().split('T')[0] : '',
        impact: project.impact || '',
        technologiesUsed: project.technologiesUsed || [''],
        projectUrl: project.projectUrl || '',
        isCompleted: project.isCompleted !== undefined ? project.isCompleted : true,
        clientType: project.clientType || '',
        // Update these to ensure proper DTO structure
        clientCompany: {
            companyId: project.clientCompany?.companyId || uuidv4(),
            companyName: project.clientCompany?.companyName || ''
        },
        providerCompany: {
            companyId: project.providerCompany?.companyId || uuidv4(),
            companyName: project.providerCompany?.companyName || ''
        },
        company: {
            companyId: project.company?.companyId || uuidv4(),
            companyName: project.company?.companyName || ''
        }
    });
    
    setEditingProjectIndex(index);
    setOpenProjectDialog(true);
};

  const handleDeleteProject = (index) => {
    setProjects(prev => prev.filter((_, i) => i !== index));
  };

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for company fields
    if (name === 'clientCompany' || name === 'providerCompany' || name === 'company') {
        setCurrentProject(prev => ({
            ...prev,
            [name]: {
                companyId: prev[name].companyId || uuidv4(), // Keep existing GUID or create new one
                companyName: value
            }
        }));
    } else {
        setCurrentProject(prev => ({
            ...prev,
            [name]: value
        }));
    }
  };

  const handleSubmit = async () => {
    // Reset states
    setValidationErrors({});
    setError(null);
    setIsLoading(true);
    
    try {
      // Prepare form data for DTO conversion
      const formData = {
        companyDetails,
        projects
    };
      
      const response = await CompanyService.createCompany(formData, token);
 
      const updatedUser = { ...user };
      updatedUser.companies.push(response.data);

      updateUser(updatedUser);

      console.log('Company added successfully:', response.data);
      
      console.log('Company added successfully:', response.data);
      
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
              name="name"
              value={companyDetails.name}
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
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Founding Year"
              name="foundingYear"
              value={companyDetails.foundingYear}
              onChange={handleCompanyDetailsChange}
              variant="outlined"
              required
              helperText="Must be between 1800 and 2100"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Employee Size"
              name="employeeSize"
              value={companyDetails.employeeSize}
              onChange={handleCompanyDetailsChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Website URL"
              name="websiteUrl"
              value={companyDetails.websiteUrl}
              onChange={handleCompanyDetailsChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Specialties"
              name="specialties"
              value={companyDetails.specialties || ''}
              onChange={handleCompanyDetailsChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Industries"
              name="industries"
              value={companyDetails.industries || ''}
              onChange={handleCompanyDetailsChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Contact Information"
              name="contactInfo"
              value={companyDetails.contactInfo || ''}
              onChange={handleCompanyDetailsChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Core Expertise"
              name="coreExpertise"
              value={companyDetails.coreExpertise || ''}
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
                name: '',
                description: '',
                industry: '',
                clientType: '',
                completionDate: '',
                startDate: '',
                impact: '',
                technologiesUsed: [''],
                projectUrl: '',
                isCompleted: true,
                clientCompany: {
                  companyId: uuidv4(), // Always set a new GUID
                  companyName: ''
                },
                providerCompany: {
                  companyId: uuidv4(), // Always set a new GUID
                  companyName: ''
                },
                company: {
                  companyId: uuidv4(), // Always set a new GUID
                  companyName: ''
                }
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
                {project.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {project.description}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Chip 
                    label={project.type || 'Unspecified'} 
                    size="small" 
                    sx={{ 
                      bgcolor: colors.primary[100],
                      color: colors.primary[700],
                    }}
                  />
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
                name="name"
                value={currentProject.name}
                onChange={handleProjectChange}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Industry"
                name="industry"
                value={currentProject.industry || ''}
                onChange={handleProjectChange}
                variant="outlined"
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
                name="clientCompany"
                value={currentProject.clientCompany?.companyName || ''}
                onChange={handleProjectChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Provider Company"
                name="providerCompany"
                value={currentProject.providerCompany?.companyName || ''}
                onChange={handleProjectChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Company"
                name="company"
                value={currentProject.company?.companyName || ''}
                onChange={handleProjectChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Impact"
                name="impact"
                value={currentProject.impact || ''}
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