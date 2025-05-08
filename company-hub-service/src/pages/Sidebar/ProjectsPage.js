import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  IconButton,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
  FormHelperText,
  Alert,
  Tabs,
  Tab,
  Rating,
  FormControl,
  FormLabel
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Add as AddIcon, 
  Visibility as VisibilityIcon,
  Check,
  Star as StarIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext.js';
import { colors } from '../../theme/theme.js';
import CompanyService from '../../services/CompanyService.js';
import ProjectService from '../../services/ProjectService.js';
import CompanyProfileDTO from '../../DTO/company/CompanyProfileDTO.js';
import ProjectDTO from '../../DTO/project/ProjectDTO.js';
import axios from 'axios';
import { API_URL } from '../../config/apiConfig.js';
import ReviewService from '../../services/ReviewService.js';

const ProjectsPage = () => {
  const location = useLocation();
  const originalCompanyName = location.state?.originalCompanyName;
  const { companyName } = useParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { token } = useAuth();

  // New state for project editing
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [editProjectDialogOpen, setEditProjectDialogOpen] = useState(false);
  const [editProjectFormData, setEditProjectFormData] = useState({
    projectName: '',
    description: '',
    technologiesUsed: [],
    clientType: '',
    projectUrl: '',
    isCompleted: false,
    startDate: '',
    completionDate: '',
    services: []
  });
  const [editProjectLoading, setEditProjectLoading] = useState(false);
  const [editProjectError, setEditProjectError] = useState('');

  // Technology options for autocomplete
  const [technologyOptions] = useState([
    "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "Go", "PHP", "Ruby", "Swift", "Kotlin", "Rust",
    "React", "Angular", "Vue.js", "Svelte", "Next.js", "Nuxt.js",
    "Node.js", "Express.js", "Django", "Flask", "Spring Boot", "ASP.NET Core", "Laravel", "Ruby on Rails", "FastAPI",
    "React Native", "Flutter", "SwiftUI", "Android SDK",
    "PostgreSQL", "MySQL", "SQLite", "MongoDB", "Redis", "Firebase Realtime DB", "Firestore", "Microsoft SQL Server",
    "AWS", "Microsoft Azure", "Google Cloud Platform", "Docker", "Kubernetes", "Jenkins", "GitHub Actions", "GitLab CI/CD",
    "TensorFlow", "PyTorch", "Scikit-learn", "OpenCV", "Pandas", "NumPy", "Hugging Face Transformers", "Keras",
    "Git", "GitHub", "GitLab", "Figma", "Postman", "Swagger", "OpenAPI", "REST API", "GraphQL", "WebSockets"
  ]);

  // State for services by industry
  const [servicesByIndustry, setServicesByIndustry] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [activeIndustryTab, setActiveIndustryTab] = useState(0);

  // Add this new state for project completion status
  const [projectCompletionStatus, setProjectCompletionStatus] = useState({});

  // Add new state for review
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewProject, setReviewProject] = useState(null);
  const [reviewData, setReviewData] = useState({
    reviewText: "",
    rating: 5,
    projectId: ""
  });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Add this state at the top with other state declarations
  const [projectsWithReviews, setProjectsWithReviews] = useState({});

  useEffect(() => {
    const fetchProjects = async () => {
        try {
            setLoading(true);
            const companyData = await CompanyService.getCompany(companyName, token);
            console.log("Backend Company Data:", companyData);
            const companyProfile = new CompanyProfileDTO(companyData);
            const companyId = companyProfile.companyId;
            const response = await CompanyService.getProjectsOfCompany(companyId, token);

            if (response) {
                const projectDTOs = response.map(project => new ProjectDTO(project));
                setProjects(projectDTOs);
            } else {
                setError('Unexpected response format from server.');
            }
        } catch (err) {
            setError('Failed to load projects. Please try again later.');
            console.error('Error fetching projects:', err);
        } finally {
            setLoading(false);
        }
    };

    fetchProjects();
  }, [token, companyName]);

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
      }
    };

    fetchIndustryServices();
  }, []);

  // Add this useEffect to fetch completion status for all projects when projects state changes
  useEffect(() => {
    if (!projects || projects.length === 0 || !token) return;
    
    const loadCompletionStatus = async () => {
      const projectStatusPromises = projects.map(async (project) => {
        try {
          // Check client side completion
          const clientResponse = await ProjectService.isProjectCompletedByClient(project.projectId, token);
          
          // Check provider side completion
          const providerResponse = await ProjectService.isProjectCompletedByProvider(project.projectId, token);
          
          return {
            projectId: project.projectId,
            client: clientResponse.isCompleted,
            provider: providerResponse.isCompleted
          };
        } catch (error) {
          console.error(`Error loading completion status for project ${project.projectId}:`, error);
          return {
            projectId: project.projectId,
            client: false,
            provider: false
          };
        }
      });
      
      const statuses = await Promise.all(projectStatusPromises);
      const statusMap = {};
      statuses.forEach(status => {
        statusMap[status.projectId] = {
          client: status.client,
          provider: status.provider
        };
      });
      
      setProjectCompletionStatus(statusMap);
    };
    
    loadCompletionStatus();
  }, [projects, token]);

  // Add this useEffect after your other useEffects
  useEffect(() => {
    if (!projects || projects.length === 0 || !token) return;
    
    const checkProjectReviews = async () => {
      const reviewCheckPromises = projects.map(async (project) => {
        try {
          // Only check for projects where this company is the client
          if (project.clientCompanyName === originalCompanyName) {
            const response = await ReviewService.projectHasReview(project.projectId, token);
            return {
              projectId: project.projectId,
              hasReview: response.hasReview
            };
          }
          return null;
        } catch (error) {
          console.error(`Error checking review for project ${project.projectId}:`, error);
          return null;
        }
      });
      
      const reviewResults = (await Promise.all(reviewCheckPromises))
        .filter(result => result !== null);
      
      const reviewMap = {};
      reviewResults.forEach(result => {
        reviewMap[result.projectId] = result.hasReview;
      });
      
      setProjectsWithReviews(reviewMap);
    };
    
    checkProjectReviews();
  }, [projects, token, companyName]);

  const handleViewProject = (projectId) => {
    const project = projects.find(p => p.projectId === projectId);
    if (project) {
      setSelectedProject(project);
      setProjectDialogOpen(true);
    }
  };

  const handleEditProject = (projectId, e) => {
    e.stopPropagation(); // Prevent triggering the card click
    
    const project = projects.find(p => p.projectId === projectId);
    if (project) {
      const formData = {
        projectName: project.projectName || '',
        description: project.description || '',
        technologiesUsed: Array.isArray(project.technologiesUsed) 
          ? [...project.technologiesUsed] 
          : (typeof project.technologiesUsed === 'string' 
              ? project.technologiesUsed.split(',').map(tech => tech.trim()).filter(tech => tech !== '')
              : []),
        clientType: project.clientType || '',
        projectUrl: project.projectUrl || '',
        isCompleted: project.isCompleted || false,
        startDate: project.startDate || '',
        completionDate: project.completionDate || '',
        services: Array.isArray(project.services) 
          ? project.services.map(service => ({
              id: service.id,
              name: service.name
            }))
          : []
      };
      
      setSelectedProject(project);
      setEditProjectFormData(formData);
      
      setSelectedServices(
        Array.isArray(project.services) 
          ? project.services.map(service => service.id) 
          : []
      );
      
      setEditProjectDialogOpen(true);
      setEditProjectError('');
    }
  };

  const handleProjectDialogClose = () => {
    setProjectDialogOpen(false);
    setSelectedProject(null);
  };

  const handleEditProjectDialogClose = () => {
    setEditProjectDialogOpen(false);
    setSelectedProject(null);
  };

  const handleProjectInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditProjectFormData({
      ...editProjectFormData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const toggleService = (serviceId) => {
    setSelectedServices(prevSelected => {
      const newSelected = prevSelected.includes(serviceId)
        ? prevSelected.filter(id => id !== serviceId)
        : [...prevSelected, serviceId];
        
      setEditProjectFormData(prev => ({
        ...prev,
        services: servicesByIndustry
          .flatMap(industry => industry.services)
          .filter(service => newSelected.includes(service.id))
      }));
      
      return newSelected;
    });
  };

  const getSelectedServiceCount = () => {
    return selectedServices.length;
  };

  const handleSubmitProjectEdit = async () => {
    if (!selectedProject || !selectedProject.projectId) {
      setEditProjectError('Project ID is missing');
      return;
    }

    setEditProjectLoading(true);
    setEditProjectError('');

    try {
      const formattedProjectData = {
        projectId: selectedProject.projectId,
        projectName: editProjectFormData.projectName,
        description: editProjectFormData.description,
        technologiesUsed: Array.isArray(editProjectFormData.technologiesUsed) 
          ? editProjectFormData.technologiesUsed.join(',') 
          : '',
        clientType: editProjectFormData.clientType || '',
        startDate: editProjectFormData.startDate || null,
        completionDate: editProjectFormData.completionDate || null,
        projectUrl: editProjectFormData.projectUrl || '',
        services: Array.isArray(editProjectFormData.services) 
          ? editProjectFormData.services.map(service => service.id)
          : []
      };

      console.log('Sending formatted project data:', formattedProjectData);

      await ProjectService.updateProject(formattedProjectData, token);

      const companyData = await CompanyService.getCompany(companyName, token);
      const companyProfile = new CompanyProfileDTO(companyData);
      const companyId = companyProfile.companyId;
      const response = await CompanyService.getProjectsOfCompany(companyId, token);
      
      if (response) {
        const projectDTOs = response.map(project => new ProjectDTO(project));
        setProjects(projectDTOs);
      }
      
      setEditProjectDialogOpen(false);
    } catch (error) {
      console.error("Error updating project:", error);
      setEditProjectError(error.message || 'Failed to update project');
    } finally {
      setEditProjectLoading(false);
    }
  };

  // Add this function to handle marking projects as completed
  const handleMarkProjectAsCompleted = async (projectId, event) => {
    // Prevent triggering card click
    event.stopPropagation();
    
    try {
      await ProjectService.markProjectAsCompleted(projectId, token);
      
      // Update the local state to reflect the change
      const project = projects.find(p => p.projectId === projectId);
      if (project) {
        const isClient = project.clientCompanyName === companyName;
        
        setProjectCompletionStatus(prev => ({
          ...prev,
          [projectId]: {
            ...prev[projectId],
            [isClient ? 'client' : 'provider']: true
          }
        }));
      }
      
      // Refresh projects data to get any other updated fields
      const companyData = await CompanyService.getCompany(companyName, token);
      const companyProfile = new CompanyProfileDTO(companyData);
      const response = await CompanyService.getProjectsOfCompany(companyProfile.companyId, token);
      
      if (response) {
        const projectDTOs = response.map(project => new ProjectDTO(project));
        setProjects(projectDTOs);
      }
    } catch (error) {
      console.error("Error marking project as completed:", error);
    }
  };

  const getStatusColor = (isCompleted) => {
    return isCompleted ? 'success' : 'primary';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return 'Invalid date';
    }
  };

  const getPartnerCompanyName = (project) => {
    if (project.clientCompanyName === companyName) {
      return project.providerCompanyName || 'No partner company';
    } else {
      return project.clientCompanyName || 'No partner company';
    }
  };

  // Add handlers for review dialog
  const handleOpenReviewDialog = (project, e) => {
    e.stopPropagation(); // Prevent triggering the card click
    setReviewProject(project);
    setReviewData({
      reviewText: "",
      rating: 5,
      projectId: project.projectId
    });
    setReviewDialogOpen(true);
    setReviewError('');
    setReviewSuccess(false);
  };

  const handleCloseReviewDialog = () => {
    setReviewDialogOpen(false);
    setReviewProject(null);
  };

  const handleReviewInputChange = (e) => {
    const { name, value } = e.target;
    setReviewData({
      ...reviewData,
      [name]: value
    });
  };

  const handleRatingChange = (event, newValue) => {
    setReviewData({
      ...reviewData,
      rating: newValue
    });
  };

  const handleSubmitReview = async () => {
    if (!reviewData.reviewText.trim()) {
      setReviewError('Please provide review text');
      return;
    }

    setReviewSubmitting(true);
    setReviewError('');
    
    try {
      await ReviewService.postReview(reviewData, token);
      setReviewSuccess(true);
      
      // Update projectsWithReviews state to make the button disappear immediately
      if (reviewData.projectId) {
        setProjectsWithReviews(prev => ({
          ...prev,
          [reviewData.projectId]: true
        }));
      }

      setReviewDialogOpen(false);

      setReviewSuccess(true);
      
    //   setTimeout(() => {
    //     setReviewDialogOpen(false);
    //   }, 2000);
    } catch (error) {
      setReviewError(error.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
          <Typography>Loading projects...</Typography>
        </Box>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ 
          p: 2, 
          backgroundColor: '#ffebee',
          borderRadius: 1,
          color: '#c62828'
        }}>
          <Typography>{error}</Typography>
        </Box>
      </Container>
    );
  }

return (
    <Box>
        <Box 
            sx={{ 
                backgroundColor: colors.neutral[100],
                py: 4,
                borderBottom: `1px solid ${colors.neutral[300]}`
            }}
        >
            <Container maxWidth="lg">
                <Container maxWidth="lg">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
                        Projects
                    </Typography>
                    <Box>
                        <Button 
                            onClick={() => navigate(`/company/projects/project-requests/${companyName}`)} 
                            variant="outlined" 
                            startIcon={<VisibilityIcon />}
                            sx={{ mr: 2 }}
                        >
                            View Project Requests
                        </Button>
                        <Button 
                            onClick={() => navigate('/create-project', {
                                state: {
                                    clientCompany: originalCompanyName
                                }
                            })}
                            variant="contained" 
                            startIcon={<AddIcon />}
                        >
                            Add Project
                        </Button>
                    </Box>
                    </Box>
                </Container>
            </Container>
            </Box>

        <Container maxWidth="lg" sx={{ py: 4 }}>
            {projects.length === 0 ? (
                <Box 
                    sx={{ 
                        py: 10, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        backgroundColor: colors.neutral[100],
                        borderRadius: 2
                    }}
                >
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No projects found
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        Start by adding your first project
                    </Typography>
                    <Button 
                        onClick={() => navigate('/create-project', {
                            state: {
                                providerCompany: originalCompanyName
                            }
                        })} 
                        variant="contained" 
                        startIcon={<AddIcon />}
                    >
                        Add Your First Project
                    </Button>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {projects.map((project) => (
                        <Grid item xs={12} md={6} lg={4} key={project.projectId}>
                            <Card 
                                elevation={1} 
                                sx={{ 
                                    height: '100%',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 3
                                    },
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                                onClick={() => handleViewProject(project.projectId)}
                            >
                                <CardContent sx={{ 
                                    flexGrow: 1, 
                                    pb: 1,
                                    minHeight: '240px'
                                }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                        <Chip 
                                            label={project.isCompleted ? 'Completed' : 'Ongoing'} 
                                            color={getStatusColor(project.isCompleted)} 
                                            size="small" 
                                        />
                                        <IconButton 
                                            size="small"
                                            onClick={(e) => handleEditProject(project.projectId, e)}
                                            sx={{ 
                                                color: colors.neutral[500],
                                                '&:hover': { color: colors.primary[500] } 
                                            }}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                    
                                    <Typography variant="h6" component="div" sx={{ fontWeight: 500, mb: 1 }}>
                                        {project.projectName}
                                    </Typography>
                                    
                                    {projectCompletionStatus[project.projectId] && project.isOnCompedia && (
                                        <Box sx={{ 
                                            display: 'flex', 
                                            flexDirection: 'column', 
                                            gap: 0.75, 
                                            mb: 1.5,
                                            mt: 0.5
                                        }}>
                                            <Chip 
                                                icon={projectCompletionStatus[project.projectId].client ? 
                                                    <Check fontSize="small" /> : 
                                                    null
                                                }
                                                label={projectCompletionStatus[project.projectId].client ? "Client Completed" : "Awaiting Client Completion"}
                                                size="small"
                                                variant={projectCompletionStatus[project.projectId].client ? "filled" : "outlined"}
                                                color={projectCompletionStatus[project.projectId].client ? "success" : "default"}
                                                sx={{ 
                                                    height: '24px',
                                                    width: 'fit-content', 
                                                    '& .MuiChip-label': {
                                                        px: 1,
                                                        fontSize: '0.7rem',
                                                        fontWeight: projectCompletionStatus[project.projectId].client ? 700 : 400
                                                    },
                                                    '& .MuiChip-icon': {
                                                        fontSize: '14px',
                                                        ml: 0.5
                                                    }
                                                }}
                                            />
                                            <Chip 
                                                icon={projectCompletionStatus[project.projectId].provider ? 
                                                    <Check fontSize="small" /> : 
                                                    null
                                                }
                                                label={projectCompletionStatus[project.projectId].provider ? "Provider Completed" : "Awaiting Provider Completion"}
                                                size="small"
                                                variant={projectCompletionStatus[project.projectId].provider ? "filled" : "outlined"}
                                                color={projectCompletionStatus[project.projectId].provider ? "success" : "default"}
                                                sx={{ 
                                                    height: '24px',
                                                    width: 'fit-content',
                                                    '& .MuiChip-label': {
                                                        px: 1,
                                                        fontSize: '0.7rem',
                                                        fontWeight: projectCompletionStatus[project.projectId].provider ? 700 : 400
                                                    },
                                                    '& .MuiChip-icon': {
                                                        fontSize: '14px',
                                                        ml: 0.5
                                                    }
                                                }}
                                            />
                                        </Box>
                                    )}
                                    
                                    <Typography 
                                        variant="body2" 
                                        color="text.secondary" 
                                        sx={{ 
                                            mb: 1.5,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                        }}
                                    >
                                        {project.description}
                                    </Typography>
                                    
                                    <Divider sx={{ my: 0.75 }} />
                                    
                                    <Box sx={{ mt: 0.75 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                                                Partner:
                                            </Typography>
                                            <Typography variant="body2" noWrap sx={{ maxWidth: '60%', textAlign: 'right', fontSize: '0.8rem' }}>
                                                {getPartnerCompanyName(project)}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                                                Started:
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                                                {formatDate(project.startDate)}
                                            </Typography>
                                        </Box>
                                        
                                        {project.isCompleted && (
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                                                    Completed:
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                                                    {formatDate(project.completionDate)}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </CardContent>
                                
                                <Box sx={{ p: 1.5, pt: 0, display: 'flex', justifyContent: 'flex-end', mt: 'auto' }}>
                                    {project.isOnCompedia && (!projectCompletionStatus[project.projectId] || 
                                     (project.providerCompanyName === originalCompanyName && !projectCompletionStatus[project.projectId]?.provider) ||
                                     (project.clientCompanyName === originalCompanyName && !projectCompletionStatus[project.projectId]?.client)) && (
                                        <Button
                                            variant="contained"
                                            size="small"
                                            color="success"
                                            onClick={(e) => handleMarkProjectAsCompleted(project.projectId, e)}
                                            startIcon={<Check size={16} />}
                                        >
                                            Mark Completed
                                        </Button>
                                    )}
                                    
                                    {/* Post Review Button - only show for completed projects where this company is the client,
                                        both parties have marked as completed, and there's no existing review */}
                                    {project.isOnCompedia && 
                                     project.clientCompanyName === originalCompanyName && 
                                     projectCompletionStatus[project.projectId]?.client &&
                                     projectCompletionStatus[project.projectId]?.provider &&
                                     !projectsWithReviews[project.projectId] && (
                                        <Button
                                            variant="contained"
                                            size="small"
                                            color="primary"
                                            onClick={(e) => handleOpenReviewDialog(project, e)}
                                            startIcon={<StarIcon size={16} />}
                                            sx={{ ml: 1 }}
                                        >
                                            Post Review
                                        </Button>
                                    )}
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>

        {/* Project Details Dialog */}
        <Dialog 
            open={projectDialogOpen} 
            onClose={handleProjectDialogClose}
            maxWidth="md"
            fullWidth
        >
            {selectedProject && (
            <>
                <DialogTitle sx={{ fontWeight: 'bold' }}>
                Project Details
                </DialogTitle>
                <DialogContent dividers>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    {selectedProject.projectName || 'Unnamed Project'}
                    </Typography>
                    <Chip 
                    label={selectedProject.isCompleted ? 'Completed' : 'Ongoing'} 
                    color={getStatusColor(selectedProject.isCompleted)}
                    size="small"
                    />
                </Box>
                
                <Box sx={{ mb: 3 }}>
                    <Typography variant="body1" paragraph>
                    {selectedProject.description || 'No description provided.'}
                    </Typography>
                </Box>
                
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography
                        variant="body2"
                        sx={{ mr: 1 }}
                        color="text.secondary"
                        >
                        Timeline:
                        </Typography>
                        <Typography variant="body2">
                        {selectedProject.startDate
                            ? new Date(selectedProject.startDate).toLocaleDateString()
                            : 'Unknown'}{' '}
                        -{' '}
                        {selectedProject.completionDate
                            ? new Date(selectedProject.completionDate).toLocaleDateString()
                            : 'Present'}
                        </Typography>
                    </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Client:</strong>{' '}
                        {selectedProject.clientCompanyName || 'Not specified'}
                    </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Provider:</strong>{' '}
                        {selectedProject.providerCompanyName || 'Not specified'}
                    </Typography>
                    </Grid>
                    {selectedProject.clientType && (
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                        <strong>Client Type:</strong>{' '}
                        {selectedProject.clientType}
                        </Typography>
                    </Grid>
                    )}
                    {selectedProject.projectUrl && (
                    <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                        <strong>Project URL:</strong>{' '}
                        <Typography 
                            component="a" 
                            href={selectedProject.projectUrl} 
                            target="_blank"
                            rel="noopener noreferrer"
                            color="primary"
                            variant="body2"
                        >
                            {selectedProject.projectUrl}
                        </Typography>
                        </Typography>
                    </Grid>
                    )}
                    
                    {/* Technologies */}
                    <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        <strong>Technologies</strong>
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
                    </Grid>
                    
                    {/* Services */}
                    <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        <strong>Services</strong>
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {Array.isArray(selectedProject.services) && selectedProject.services.length > 0 ? (
                        selectedProject.services.map((service) => (
                            <Chip 
                            key={service.id} 
                            label={service.name} 
                            size="small"
                            sx={{
                                backgroundColor: colors.primary[500],
                                color: 'white',
                                '&:hover': {
                                backgroundColor: colors.primary[700],
                                color: 'white',
                                },
                            }}
                            />
                        ))
                        ) : (
                        <Typography variant="body2">No services specified</Typography>
                        )}
                    </Box>
                    </Grid>
                </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
                <Box></Box>
                <Box>
                    <Button onClick={handleProjectDialogClose} variant="outlined" sx={{ mr: 1 }}>
                    Close
                    </Button>
                    <Button
                    startIcon={<EditIcon />}
                    variant="contained"
                    onClick={() => {
                        handleProjectDialogClose();
                        handleEditProject(selectedProject.projectId, { stopPropagation: () => {} });
                    }}
                    >
                    Edit Project
                    </Button>
                </Box>
                </DialogActions>
            </>
            )}
        </Dialog>

        {/* Edit Project Dialog */}
        <Dialog 
            open={editProjectDialogOpen} 
            onClose={handleEditProjectDialogClose}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle sx={{ fontWeight: 'bold' }}>Edit Project</DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            name="projectName"
                            label="Project Name"
                            value={editProjectFormData.projectName}
                            onChange={handleProjectInputChange}
                            fullWidth
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="description"
                            label="Description"
                            value={editProjectFormData.description}
                            onChange={handleProjectInputChange}
                            fullWidth
                            multiline
                            rows={4}
                            margin="normal"
                        />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="startDate"
                            label="Start Date"
                            type="date"
                            value={editProjectFormData.startDate ? new Date(editProjectFormData.startDate).toISOString().split('T')[0] : ''}
                            onChange={handleProjectInputChange}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="completionDate"
                            label="Completion Date"
                            type="date"
                            value={editProjectFormData.completionDate ? new Date(editProjectFormData.completionDate).toISOString().split('T')[0] : ''}
                            onChange={handleProjectInputChange}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="projectUrl"
                            label="Project URL"
                            value={editProjectFormData.projectUrl}
                            onChange={handleProjectInputChange}
                            fullWidth
                            margin="normal"
                        />
                    </Grid>
                
                    
                    {/* Technologies Section */}
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                            Technologies Used
                        </Typography>
                        <Autocomplete
                            multiple
                            id="technologies-autocomplete"
                            options={technologyOptions}
                            freeSolo
                            value={editProjectFormData.technologiesUsed || []}
                            onChange={(event, newValue) => {
                                setEditProjectFormData(prev => ({
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
                                    placeholder={editProjectFormData.technologiesUsed?.length > 0 ? "" : "Add technologies..."}
                                    fullWidth
                                />
                            )}
                            filterOptions={(options, params) => {
                                const filtered = options.filter(option => 
                                    option.toLowerCase().includes(params.inputValue.toLowerCase())
                                );
                                
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
                
                {editProjectError && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {editProjectError}
                    </Alert>
                )}
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={handleEditProjectDialogClose} color="inherit">
                    Cancel
                </Button>
                <Button 
                    onClick={handleSubmitProjectEdit} 
                    color="primary" 
                    variant="contained"
                    disabled={editProjectLoading}
                >
                    {editProjectLoading ? 'Saving...' : 'Save Changes'}
                </Button>
            </DialogActions>
        </Dialog>

        {/* Review Dialog */}
        <Dialog
            open={reviewDialogOpen}
            onClose={handleCloseReviewDialog}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle sx={{ fontWeight: 'bold' }}>
                Post Review{reviewProject ? ` for ${reviewProject.providerCompanyName}` : ''}
            </DialogTitle>
            <DialogContent dividers>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Share your experience working with this provider on the project: {reviewProject?.projectName}
                    </Typography>
                </Box>
                
                <FormControl fullWidth sx={{ mb: 3 }}>
                    <FormLabel sx={{ mb: 1, fontWeight: 500 }}>Rating</FormLabel>
                    <Rating
                        name="rating"
                        value={reviewData.rating}
                        onChange={handleRatingChange}
                        precision={1}
                        size="large"
                        sx={{ color: 'primary.main' }}
                    />
                </FormControl>
                
                <FormControl fullWidth>
                    <FormLabel sx={{ mb: 1, fontWeight: 500 }}>Review</FormLabel>
                    <TextField
                        name="reviewText"
                        value={reviewData.reviewText}
                        onChange={handleReviewInputChange}
                        fullWidth
                        multiline
                        rows={4}
                        placeholder="Share details of your experience working with this provider..."
                        variant="outlined"
                    />
                </FormControl>
                
                {reviewError && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {reviewError}
                    </Alert>
                )}
                
                {reviewSuccess && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                        Review submitted successfully!
                    </Alert>
                )}
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={handleCloseReviewDialog} color="inherit" disabled={reviewSubmitting}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmitReview}
                    color="primary"
                    variant="contained"
                    disabled={reviewSubmitting}
                    startIcon={reviewSubmitting ? null : <StarIcon />}
                >
                    {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                </Button>
            </DialogActions>
        </Dialog>
    </Box>
);
};

export default ProjectsPage;