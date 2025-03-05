import React, { useEffect, useState } from 'react';
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

const AddCompanyPage = () => {
  const [companyDetails, setCompanyDetails] = useState({
    name: '',
    location: '',
    foundingYear: '',
    employeeSize: '',
    websiteUrl: '',
    description: ''
  });

  const [projects, setProjects] = useState([]);
  const [openProjectDialog, setOpenProjectDialog] = useState(false);
  const [currentProject, setCurrentProject] = useState({
    name: '',
    description: '',
    type: '',
    completionDate: ''
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

  const handleAddProject = () => {
    if (editingProjectIndex !== null) {
      // Editing existing project
      const updatedProjects = [...projects];
      updatedProjects[editingProjectIndex] = currentProject;
      setProjects(updatedProjects);
      setEditingProjectIndex(null);
    } else {
      // Adding new project
      setProjects(prev => [...prev, currentProject]);
    }
    
    // Reset project dialog
    setCurrentProject({
      name: '',
      description: '',
      type: '',
      completionDate: ''
    });
    setOpenProjectDialog(false);
  };

  const handleEditProject = (index) => {
    setCurrentProject(projects[index]);
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
      // Basic client-side validation
      const validationErrors = {};
      
      if (!companyDetails.name) {
        validationErrors.name = "Company name is required";
      }
      
      if (!companyDetails.location) {
        validationErrors.location = "Location is required";
      }
      
      const foundedYear = parseInt(companyDetails.foundingYear);
      if (isNaN(foundedYear) || foundedYear < 1800 || foundedYear > 2100) {
        validationErrors.foundingYear = "Please enter a valid founding year between 1800 and 2100";
      }
      
      if (!projects || projects.length === 0) {
        validationErrors.projects = "At least one project is required";
      } else {
        const invalidProjects = projects.filter(p => !p.name || !p.description);
        if (invalidProjects.length > 0) {
          validationErrors.projects = "All projects must have at least a name and description";
        }
      }
      
      if (Object.keys(validationErrors).length > 0) {
        setValidationErrors(validationErrors);
        setNotification({
          open: true,
          message: "Please fix the form errors before submitting",
          severity: "error"
        });
        return;
      }
      
      // // Prepare data for backend with the correct format
      // const companyData = {
      //   companyName: companyDetails.name,
      //   description: companyDetails.description || "",
      //   foundedYear: foundedYear || new Date().getFullYear(),
      //   address: companyDetails.location || "",
      //   location: companyDetails.location || "",
      //   website: companyDetails.websiteUrl || "",
      //   companySize: parseInt(companyDetails.employeeSize) || 0,
      //   // Important: Make sure these are arrays of strings where required
      //   specialties: "",
      //   industries: [], // Changed from string to empty array
      //   contactInfo: "",
      //   coreExpertise: [], // Changed from string to empty array
      //   // Format Portfolio correctly
      //   portfolio: projects.map(project => ({
      //     projectId: "",
      //     project_name: project.name,
      //     description: project.description || "",
      //     technologies_used: [], // Empty array as default
      //     industry: project.type || "",
      //     client_type: "",
      //     impact: "",
      //     startDate: project.completionDate || "",
      //     completionDate: project.completionDate || "",
      //     isOnCompedia: false,
      //     isCompleted: false,
      //     clientCompany: {
      //       companyId: "",
      //       companyName: "",
      //     },
      //     providerCompany: {
      //       companyId: "",
      //       companyName: "",
      //     },
      //     project_url: "",
      //     company: {
      //       companyId: "",
      //       companyName: "",
      //     }
          
      //   }))
      // };
      
      // console.log('Submitting Company Data:', companyData);




      // const companyData = {
      //   companyName: companyDetails.name || "string",
      //   description: companyDetails.description || "string",
      //   foundedYear: parseInt(companyDetails.foundingYear) || 2100,
      //   address: companyDetails.location || "string",
      //   specialties: companyDetails.specialties || "string",
      //   industries: companyDetails.industries || "string", // Send as string, not array
      //   location: companyDetails.location || "string",
      //   website: companyDetails.websiteUrl || "string",
      //   companySize: parseInt(companyDetails.employeeSize) || 0,
      //   contactInfo: companyDetails.contactInfo || "string",
      //   coreExpertise: companyDetails.coreExpertise || "string", // Send as string, not array
      //   portfolio: projects.map(project => ({
      //     projectId: project.id || "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      //     project_name: project.name,
      //     description: project.description || "string",
      //     technologies_used: ["string"], // Array of strings, matching postman
      //     industry: project.type || "string",
      //     client_type: "string",
      //     impact: "string",
      //     startDate: new Date().toISOString(),
      //     completionDate: project.completionDate || new Date().toISOString(),
      //     isOnCompedia: true,
      //     isCompleted: true,
      //     clientCompany: {
      //       companyId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      //       companyName: "string"
      //     },
      //     providerCompany: {
      //       companyId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      //       companyName: "string"
      //     },
      //     project_url: "string",
      //     company: {
      //       companyId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      //       companyName: "string"
      //     }
      //   })) || []
      // };

      const requestData = {
        CompanyName: companyDetails.name,
        Description: companyDetails.description || "",
        FoundedYear: parseInt(companyDetails.foundingYear) || 2023,
        Address: companyDetails.location || "",
        Location: companyDetails.location || "",
        Website: companyDetails.websiteUrl || "",
        CompanySize: parseInt(companyDetails.employeeSize) || 0,
        Specialties: "",
        Industries: "",
        ContactInfo: "",
        CoreExpertise: "",
        Portfolio: projects.map(project => ({
          ProjectName: project.name,
          Description: project.description || "",
          Industry: project.type || "",
          CompletionDate: project.completionDate || new Date().toISOString(),
          IsCompleted: true,
          TechnologiesUsed: [""],
          ClientType: "",
          Impact: "",
          StartDate: new Date().toISOString(),
          ProjectUrl: ""
        }))
      };
      
      console.log('Sending formatted data:', requestData);
      
      const response = await CompanyService.addCompany(requestData);
      
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
                type: '',
                completionDate: ''
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
                    {project.completionDate || 'No date'}
                  </Typography>
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
      {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isLoading}
          sx={{ 
            bgcolor: colors.primary[500],
            '&:hover': { bgcolor: colors.primary[600] }
          }}
        >
          Submit Company
        </Button>
      </Box> */}

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
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Project Type"
                name="type"
                value={currentProject.type}
                onChange={handleProjectChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Completion Date"
                name="completionDate"
                value={currentProject.completionDate}
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
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenProjectDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddProject} color="primary" variant="contained">
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

export default AddCompanyPage;