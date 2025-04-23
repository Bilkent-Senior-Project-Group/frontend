import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Grid, Card, CardContent, 
  CardActionArea, Dialog, DialogTitle, DialogContent, 
  DialogActions, Button, Box, Divider, Paper, Chip,
  Tabs, Tab, TextField, Autocomplete, FormHelperText
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import SendIcon from '@mui/icons-material/MoveToInbox';
import ReceiveIcon from '@mui/icons-material/MoveToInbox';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { colors } from '../../../theme/theme';
import axios from 'axios';

import ProjectService from '../../../services/ProjectService';
import CompanyService from '../../../services/CompanyService';
import { API_URL } from '../../../config/apiConfig.js';

const ProjectRequestsPage = () => {
  const { companyName } = useParams();
  const [projectRequests, setProjectRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingSent, setLoadingSent] = useState(false);
  const [error, setError] = useState(null);
  const [errorSent, setErrorSent] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [detailDialogType, setDetailDialogType] = useState('received'); // 'received' or 'sent'
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteConfirmDialogOpen, setDeleteConfirmDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    projectName: '',
    description: '',
    technologiesUsed: [],
    clientType: '',
    serviceIds: []
  });
  const [newTechnology, setNewTechnology] = useState('');
  const [servicesByIndustry, setServicesByIndustry] = useState([]);
  const [activeIndustryTab, setActiveIndustryTab] = useState(0);
  const [technologyOptions, setTechnologyOptions] = useState([
    // Programming Languages
    "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "Go", "PHP", "Ruby", "Swift", "Kotlin", "Rust",
    
    // Frameworks & Libraries - Frontend
    "React", "Angular", "Vue.js", "Svelte", "Next.js", "Nuxt.js",
    
    // Frameworks & Libraries - Backend
    "Node.js", "Express.js", "Django", "Flask", "Spring Boot", "ASP.NET Core", "Laravel", "Ruby on Rails", "FastAPI",
    
    // Frameworks & Libraries - Mobile
    "React Native", "Flutter", "SwiftUI", "Android SDK",
    
    // Databases
    "PostgreSQL", "MySQL", "SQLite", "MongoDB", "Redis", "Firebase Realtime DB", "Firestore", "Microsoft SQL Server",
    
    // Cloud & DevOps
    "AWS", "Microsoft Azure", "Google Cloud Platform", "Docker", "Kubernetes", "Jenkins", "GitHub Actions", "GitLab CI/CD",
    
    // AI/ML & Data
    "TensorFlow", "PyTorch", "Scikit-learn", "OpenCV", "Pandas", "NumPy", "Hugging Face Transformers", "Keras",
    
    // Tools & Miscellaneous
    "Git", "GitHub", "GitLab", "Figma", "Postman", "Swagger", "OpenAPI", "REST API", "GraphQL", "WebSockets"
  ]);
  const [selectedServices, setSelectedServices] = useState([]);
  const { token } = useAuth();
  const navigate = useNavigate();

  // Fetch received project requests
  useEffect(() => {
    const fetchProjectRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        const companyData = await CompanyService.getCompany(companyName, token);
        const response = await ProjectService.getProjectRequests(companyData.companyId, token);
        const requestsData = Array.isArray(response) ? response : 
                           (Array.isArray(response.data) ? response.data : []);
        setProjectRequests(requestsData);
      } catch (err) {
        console.error("Error fetching project requests:", err);
        if (err.response?.status === 404 && 
            err.response?.data?.message === "No pending project requests for this company.") {
          setProjectRequests([]);
        } else {
          setError("Failed to load project requests. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjectRequests();
  }, [companyName, token]);

  // Fetch sent project requests
  useEffect(() => {
    const fetchSentRequests = async () => {
      setLoadingSent(true);
      setErrorSent(null);
      try {
        const companyData = await CompanyService.getCompany(companyName, token);
        const response = await ProjectService.getSentProjectRequests(companyData.companyId, token);
        const sentData = Array.isArray(response) ? response : 
                         (Array.isArray(response.data) ? response.data : []);
        setSentRequests(sentData);
      } catch (err) {
        console.error("Error fetching sent project requests:", err);
        if (err.response?.status === 404 && 
            err.response?.data?.message?.includes("No sent project requests")) {
          setSentRequests([]);
        } else {
          setErrorSent("Failed to load sent project requests. Please try again later.");
        }
      } finally {
        setLoadingSent(false);
      }
    };

    fetchSentRequests();
  }, [companyName, token]);

  // Fetch services by industry
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
        setError('Error fetching services');
      }
    };

    fetchIndustryServices();
  }, []);

  const handleCardClick = (project, type) => {
    setSelectedProject(project);
    setDetailDialogType(type);
    setDetailsOpen(true);
  };

  const handleDetailsClose = () => {
    setDetailsOpen(false);
  };

  const handleActionClick = (type) => {
    setActionType(type);
    setConfirmDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    setLoading(true);
    try {
      if (actionType === 'approve') {
        await ProjectService.approveProjectRequest(selectedProject.requestId, token, true);
      } else {
        await ProjectService.declineProjectRequest(selectedProject.requestId, token, false);
      }
      try {
        const companyData = await CompanyService.getCompany(companyName, token);
        const response = await ProjectService.getProjectRequests(companyData.companyId, token);
        const requestsData = Array.isArray(response) ? response : 
                        (Array.isArray(response.data) ? response.data : []);
        setProjectRequests(requestsData);
      } catch (refreshErr) {
        console.log("Error refreshing project requests:", refreshErr);
        if (refreshErr.response?.status === 404 && 
            refreshErr.response?.data?.message === "No pending project requests for this company.") {
          setProjectRequests([]);
        }
      }
    } catch (err) {
      console.error(`Error ${actionType === 'approve' ? 'approving' : 'declining'} project:`, err);
      setError(`Failed to ${actionType} project. Please try again.`);
    } finally {
      setLoading(false);
      setConfirmDialogOpen(false);
      setDetailsOpen(false);
    }
  };

  const handleCancelAction = () => {
    setConfirmDialogOpen(false);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    const serviceIds = Array.isArray(selectedProject.services) 
      ? selectedProject.services.map(service => service.id)
      : [];
    setEditFormData({
      projectName: selectedProject.projectName || '',
      description: selectedProject.description || '',
      technologiesUsed: Array.isArray(selectedProject.technologiesUsed) 
        ? [...selectedProject.technologiesUsed] 
        : [],
      clientType: selectedProject.clientType || '',
      serviceIds: serviceIds
    });
    setSelectedServices(serviceIds);
    setDetailsOpen(false);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const toggleService = (serviceId) => {
    setSelectedServices(prevSelected => {
      const newSelected = prevSelected.includes(serviceId)
        ? prevSelected.filter(id => id !== serviceId)
        : [...prevSelected, serviceId];
        
      setEditFormData(prev => ({
        ...prev,
        serviceIds: newSelected
      }));
      
      return newSelected;
    });
  };

  const getSelectedServiceCount = () => {
    return selectedServices.length;
  };

  const handleSubmitEdit = async () => {
    try {
      setLoading(true);
      await ProjectService.editProjectRequest(editFormData, selectedProject.requestId, token);
      const companyData = await CompanyService.getCompany(companyName, token);
      const response = await ProjectService.getSentProjectRequests(companyData.companyId, token);
      const sentData = Array.isArray(response) ? response : 
                     (Array.isArray(response.data) ? response.data : []);
      setSentRequests(sentData);
      setEditDialogOpen(false);
    } catch (err) {
      console.error("Error editing project request:", err);
      setErrorSent(`Failed to edit project request: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setDetailsOpen(false);
    setDeleteConfirmDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      await ProjectService.deleteSentProjectRequest(selectedProject.requestId, token);
      
      // After deleting, try to fetch updated list
      try {
        const companyData = await CompanyService.getCompany(companyName, token);
        const response = await ProjectService.getSentProjectRequests(companyData.companyId, token);
        const sentData = Array.isArray(response) ? response : 
                       (Array.isArray(response.data) ? response.data : []);
        setSentRequests(sentData);
      } catch (refreshErr) {
        console.log("Error refreshing sent project requests:", refreshErr);
        
        // If 404 error, it means there are no sent requests, which is expected after deletion
        if (refreshErr.response?.status === 404 && 
            (refreshErr.response?.data?.message?.includes("No sent project requests") || 
             refreshErr.response?.data?.title?.includes("Not Found"))) {
          // Set sentRequests to empty array since there are no more requests
          setSentRequests([]);
        } else {
          // For other errors, set the error message
          setErrorSent(`Failed to refresh sent project requests: ${refreshErr.message}`);
        }
      }
      
      setDeleteConfirmDialogOpen(false);
    } catch (err) {
      console.error("Error deleting project request:", err);
      setErrorSent(`Failed to delete project request: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmDialogOpen(false);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Project Requests
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="project requests tabs">
          <Tab 
            icon={<ReceiveIcon />} 
            iconPosition="start" 
            label="Incoming Requests" 
            id="requests-tab-0" 
          />
          <Tab 
            icon={<SendIcon />} 
            iconPosition="start" 
            label="Sent Requests" 
            id="requests-tab-1" 
          />
        </Tabs>
      </Box>
      
      <div role="tabpanel" hidden={tabValue !== 0}>
        {loading && <Typography>Loading project requests...</Typography>}
        
        {error && (
          <Paper sx={{ p: 2, mb: 2, bgcolor: 'error.light' }}>
            <Typography color="error">{error}</Typography>
          </Paper>
        )}
        
        {!loading && !error && projectRequests.length === 0 ? (
          <Paper 
            sx={{ 
              p: 4, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '200px'
            }}
          >
            <Typography variant="h6" color="textSecondary">
              No pending project requests
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {projectRequests.map((project) => (
              <Grid item xs={12} md={6} lg={4} key={project.requestId}>
                <Card 
                  elevation={3} 
                  sx={{ 
                    height: '100%',
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.02)',
                    },
                  }}
                >
                  <CardActionArea onClick={() => handleCardClick(project, 'received')}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        {project.projectName || 'Unnamed Project'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {project.description ? 
                          (project.description.length > 100 
                            ? `${project.description.substring(0, 100)}...` 
                            : project.description) 
                          : 'No description provided'}
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2">Client: {project.clientCompanyName || 'Unknown'}</Typography>
                        <Typography variant="body2">Type: {project.clientType || 'Not specified'}</Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </div>
      
      <div role="tabpanel" hidden={tabValue !== 1}>
        {loadingSent && <Typography>Loading sent project requests...</Typography>}
        
        {errorSent && (
          <Paper sx={{ p: 2, mb: 2, bgcolor: 'error.light' }}>
            <Typography color="error">{errorSent}</Typography>
          </Paper>
        )}
        
        {!loadingSent && !errorSent && sentRequests.length === 0 ? (
          <Paper 
            sx={{ 
              p: 4, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '200px'
            }}
          >
            <Typography variant="h6" color="textSecondary">
              No sent project requests
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {sentRequests.map((project) => (
              <Grid item xs={12} md={6} lg={4} key={project.requestId}>
                <Card 
                  elevation={3} 
                  sx={{ 
                    height: '100%',
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.02)',
                    },
                  }}
                >
                  <CardActionArea onClick={() => handleCardClick(project, 'sent')}>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {project.projectName || 'Unnamed Project'}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {project.description ? 
                          (project.description.length > 100 
                            ? `${project.description.substring(0, 100)}...` 
                            : project.description) 
                          : 'No description provided'}
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2">
                          To: {
                            (project.clientCompanyName === companyName) 
                              ? project.providerCompanyName || 'Unknown'
                              : project.clientCompanyName || 'Unknown'
                          }
                        </Typography>
                        <Typography variant="body2">Type: {project.clientType || 'Not specified'}</Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </div>

      <Dialog 
        open={detailsOpen} 
        onClose={handleDetailsClose}
        maxWidth="md"
        fullWidth
      >
        {selectedProject && (
          <>
            <DialogTitle sx={{ fontWeight: 'bold' }}>
              {detailDialogType === 'received' ? 'Project Request Details' : 'Sent Project Request Details'}
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {selectedProject.projectName || 'Unnamed Project'}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" paragraph>
                  {selectedProject.description || 'No description provided.'}
                </Typography>
              </Box>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {detailDialogType === 'received' ? 'Client Company' : 'Partner Company'}
                    </Typography>
                    <Typography variant="body1">
                      {detailDialogType === 'received' 
                        ? (selectedProject.clientCompanyName || 'Not specified')
                        : (selectedProject.clientCompanyName === companyName
                            ? (selectedProject.providerCompanyName || 'Not specified')
                            : (selectedProject.clientCompanyName || 'Not specified'))
                      }
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Client Type
                    </Typography>
                    <Typography variant="body1">
                      {selectedProject.clientType || 'Not specified'}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Technologies
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {Array.isArray(selectedProject.technologiesUsed) && selectedProject.technologiesUsed.length > 0 ? (
                        selectedProject.technologiesUsed.map((tech, index) => (
                          <Chip key={index} label={tech} size="small" />
                        ))
                      ) : (
                        <Typography variant="body2">No technologies specified</Typography>
                      )}
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Services
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {Array.isArray(selectedProject.services) && selectedProject.services.length > 0 ? (
                        selectedProject.services.map((service) => (
                          <Chip key={service.id} label={service.name} size="small" />
                        ))
                      ) : (
                        <Typography variant="body2">No services specified</Typography>
                      )}
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
              {detailDialogType === 'received' ? (
                <>
                  <Button 
                    startIcon={<CancelIcon />} 
                    variant="outlined" 
                    color="error"
                    onClick={() => handleActionClick('decline')}
                  >
                    Decline Request
                  </Button>
                  <Button 
                    startIcon={<CheckCircleIcon />} 
                    variant="contained" 
                    color="success"
                    onClick={() => handleActionClick('approve')}
                  >
                    Approve Request
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    startIcon={<CancelIcon />} 
                    variant="outlined" 
                    color="error"
                    onClick={handleDeleteClick}
                  >
                    Delete
                  </Button>
                  <Box>
                    <Button onClick={handleDetailsClose} color="primary" variant="outlined" sx={{ mr: 1 }}>
                      Close
                    </Button>
                    <Button 
                      startIcon={<EditIcon />} 
                      variant="contained" 
                      color="primary"
                      onClick={handleEditClick}
                    >
                      Edit
                    </Button>
                  </Box>
                </>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      <Dialog 
        open={editDialogOpen} 
        onClose={handleEditDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>Edit Project Request</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="projectName"
                label="Project Name"
                value={editFormData.projectName}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                value={editFormData.description}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={4}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="clientType"
                label="Client Type"
                value={editFormData.clientType}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            
            {/* Technologies Section */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Technologies Used
              </Typography>
              <Autocomplete
                multiple
                id="technologies-autocomplete"
                options={technologyOptions}
                freeSolo
                value={editFormData.technologiesUsed || []}
                onChange={(event, newValue) => {
                  setEditFormData(prev => ({
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
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder={editFormData.technologiesUsed?.length > 0 ? "" : "Add technologies..."}
                    fullWidth
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
            
            {/* Services Section */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom mt={2}>
                Services
              </Typography>
              
              {/* Industry tabs */}
              {servicesByIndustry.length > 0 && (
                <Box sx={{ width: '100%', mb: 2, mt: 1 }}>
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
              )}
              
              {/* Selected services summary */}
              <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                  Selected Services ({getSelectedServiceCount()})
                </Typography>
                
                {selectedServices.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No services selected yet.
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
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleEditDialogClose} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitEdit} 
            color="primary" 
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteConfirmDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>
          Delete Project Request?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete this project request? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Yes, Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProjectRequestsPage;