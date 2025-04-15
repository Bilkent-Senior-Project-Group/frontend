import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Box,
  FormControlLabel,
  Switch,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ProjectDTO from '../../../DTO/project/ProjectDTO';

// Import this when backend is ready
// import ProjectService from '../../../services/ProjectService';

// Mock industries/client types for form dropdowns
const INDUSTRY_OPTIONS = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Retail',
  'Manufacturing',
  'Entertainment',
  'Other'
];

const CLIENT_TYPE_OPTIONS = [
  'Enterprise',
  'Small Business',
  'Startup',
  'Government',
  'Non-profit',
  'Individual',
  'Internal',
  'Other'
];

// Mock project data - Remove when backend is integrated
const mockProject = {
  id: '123',
  name: 'E-Commerce Platform',
  description: 'A full-featured online shopping platform with payment integration',
  technologiesUsed: ['React', 'Node.js', 'MongoDB', 'AWS'],
  industry: 'Retail',
  impact: 'Increased client sales by 35% in first quarter after launch',
  startDate: '2025-01-15',
  completionDate: '2025-04-30',
  isCompleted: true,
  projectUrl: 'https://example-ecommerce.com',
  clientType: 'Enterprise',
  clientCompanyName: 'Retail Solutions Inc.',
  providerCompanyName: 'Our Company'
};

const EditProjectPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  
  // For tech stack input
  const [techInput, setTechInput] = useState('');
  const [techStack, setTechStack] = useState([]);

  // Load project data
  useEffect(() => {
    // Current implementation with mock data
    setTimeout(() => {
      setProject(mockProject);
      setTechStack(mockProject.technologiesUsed || []);
      setLoading(false);
    }, 500); // Simulate API delay

    /* BACKEND INTEGRATION - Uncomment when ready
    const fetchProject = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await ProjectService.getProjectById(projectId);
        const projectData = response.data;
        
        // Transform API data to form data
        setProject({
          id: projectData.ProjectId,
          name: projectData.ProjectName,
          description: projectData.Description,
          technologiesUsed: projectData.TechnologiesUsed,
          industry: projectData.Industry,
          impact: projectData.Impact,
          startDate: projectData.StartDate,
          completionDate: projectData.CompletionDate,
          isCompleted: projectData.IsCompleted,
          projectUrl: projectData.ProjectUrl,
          clientType: projectData.ClientType,
          clientCompanyName: projectData.ClientCompanyName,
          providerCompanyName: projectData.ProviderCompanyName
        });
        
        setTechStack(projectData.TechnologiesUsed || []);
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("Failed to load project data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
    */
  }, [projectId]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject({ ...project, [name]: value });
  };

  // Handle toggle changes (switches)
  const handleToggleChange = (e) => {
    const { name, checked } = e.target;
    setProject({ ...project, [name]: checked });
  };

  // Handle date changes
  const handleDateChange = (name, date) => {
    setProject({ ...project, [name]: date });
  };

  // Handle tech stack management
  const handleAddTech = () => {
    if (techInput && !techStack.includes(techInput)) {
      const newTechStack = [...techStack, techInput];
      setTechStack(newTechStack);
      setProject({ ...project, technologiesUsed: newTechStack });
      setTechInput('');
    }
  };

  const handleDeleteTech = (techToDelete) => {
    const newTechStack = techStack.filter(tech => tech !== techToDelete);
    setTechStack(newTechStack);
    setProject({ ...project, technologiesUsed: newTechStack });
  };

  // Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Current implementation without backend
    setSaving(true);
    
    // Create a ProjectDTO from form data
    const projectDTO = new ProjectDTO(project);
    
    console.log("Project to save:", projectDTO);
    
    // Simulate API call
    setTimeout(() => {
      setSuccess(true);
      setSaving(false);
      
      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);

    /* BACKEND INTEGRATION - Uncomment when ready
    try {
      setSaving(true);
      setError(null);
      
      // Create a ProjectDTO from form data
      const projectDTO = new ProjectDTO(project);
      
      // Update the project
      await ProjectService.updateProject(projectId, projectDTO);
      
      setSuccess(true);
      
      // Reset success message after 3 seconds and then navigate back
      setTimeout(() => {
        setSuccess(false);
        navigate('/projects');
      }, 3000);
    } catch (err) {
      console.error("Error updating project:", err);
      setError("Failed to update project. Please try again.");
      setSaving(false);
    }
    */
  };

  // Handle project completion
  const handleMarkAsCompleted = () => {
    setConfirmDialogOpen(true);
  };

  const confirmMarkAsCompleted = async () => {
    // Current implementation without backend
    setProject({ ...project, isCompleted: true });
    setConfirmDialogOpen(false);

    /* BACKEND INTEGRATION - Uncomment when ready
    try {
      setSaving(true);
      await ProjectService.markProjectAsCompleted(projectId);
      
      // Update local state
      setProject({ ...project, isCompleted: true });
      setSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error marking project as completed:", err);
      setError("Failed to update project status. Please try again.");
    } finally {
      setSaving(false);
      setConfirmDialogOpen(false);
    }
    */
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading project details...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/projects')}
            variant="outlined"
          >
            Back to Projects
          </Button>
          <Typography variant="h4" component="h1" gutterBottom>
            Edit Project
          </Typography>
          {!project.isCompleted && (
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircleIcon />}
              onClick={handleMarkAsCompleted}
            >
              Mark as Completed
            </Button>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Project updated successfully!
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Project Information */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Basic Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Project Name"
                name="name"
                value={project.name || ''}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Project URL"
                name="projectUrl"
                value={project.projectUrl || ''}
                onChange={handleChange}
                placeholder="https://example.com"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Project Description"
                name="description"
                value={project.description || ''}
                onChange={handleChange}
                multiline
                rows={4}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Industry</InputLabel>
                <Select
                  name="industry"
                  value={project.industry || ''}
                  label="Industry"
                  onChange={handleChange}
                >
                  {INDUSTRY_OPTIONS.map(industry => (
                    <MenuItem key={industry} value={industry}>
                      {industry}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Impact"
                name="impact"
                value={project.impact || ''}
                onChange={handleChange}
                placeholder="How did this project impact the business?"
              />
            </Grid>

            {/* Technologies Used */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>
                Technologies Used
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TextField
                  label="Add Technology"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                  sx={{ mr: 2, flexGrow: 1 }}
                />
                <Button variant="contained" onClick={handleAddTech}>
                  Add
                </Button>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {techStack.map((tech, index) => (
                  <Chip
                    key={index}
                    label={tech}
                    onDelete={() => handleDeleteTech(tech)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Grid>

            {/* Client Information */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>
                Client Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Client Type</InputLabel>
                <Select
                  name="clientType"
                  value={project.clientType || ''}
                  label="Client Type"
                  onChange={handleChange}
                >
                  {CLIENT_TYPE_OPTIONS.map(type => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Client Company Name"
                name="clientCompanyName"
                value={project.clientCompanyName || ''}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Provider Company Name"
                name="providerCompanyName"
                value={project.providerCompanyName || ''}
                onChange={handleChange}
              />
            </Grid>

            {/* Project Timeline */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>
                Project Timeline
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={project.startDate ? new Date(project.startDate) : null}
                  onChange={(date) => handleDateChange('startDate', date)}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth name="startDate" />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Completion Date"
                  value={project.completionDate ? new Date(project.completionDate) : null}
                  onChange={(date) => handleDateChange('completionDate', date)}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth name="completionDate" />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={project.isCompleted || false}
                    onChange={handleToggleChange}
                    name="isCompleted"
                  />
                }
                label="Project Completed"
              />
            </Grid>

            {/* Form Actions */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  startIcon={<SaveIcon />}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Confirmation Dialog for Marking as Completed */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Mark Project as Completed?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to mark this project as completed? This will update the project status in the system.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmMarkAsCompleted} variant="contained" color="success">
            Yes, Mark as Completed
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EditProjectPage;