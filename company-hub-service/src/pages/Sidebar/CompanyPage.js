import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Divider,
  Rating,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Stack,
  LinearProgress,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Avatar,
  TextField,
  FormHelperText,
  Autocomplete
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { Star, Map, Users, DollarSign, Phone, Mail, Globe, Check, Calendar, Upload, Edit, Plus, Trash2 } from 'lucide-react';
import { colors } from '../../theme/theme';
import CompanyService from '../../services/CompanyService';
import ProjectService from '../../services/ProjectService';
import ReviewService from '../../services/ReviewService';
import { useAuth } from '../../contexts/AuthContext';
import CompanyProfileDTO from '../../DTO/company/CompanyProfileDTO';
import { useMemo } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/apiConfig';
import { alpha } from '@mui/material/styles';

const CompanyPage = () => {
  const { companyName } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState({
    companyId: null,
    name: '',
    description: '',
    services: [],
    verified: false,
    projects: [],
    location: -1,
    website: '',
    partnerships: [],
    companySize: '',
    foundedYear: new Date().getFullYear(),
    address: '',
    phone: '',
    email: '',
    overallRating: 0,
    totalReviews: 0,
  });
  const [people, setPeople] = useState([]);
  
  const [activeTab, setActiveTab] = useState(0);
  const { token, user } = useAuth();
  const [userCompanies, setUserCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [logoUploadOpen, setLogoUploadOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [deleteLogoConfirmOpen, setDeleteLogoConfirmOpen] = useState(false);
  const [deletingLogo, setDeletingLogo] = useState(false);
  const [deleteLogoError, setDeleteLogoError] = useState('');
  const [deleteLogoSuccess, setDeleteLogoSuccess] = useState(false);

  // New state for project dialog
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [canEditProject, setCanEditProject] = useState(false);
  const [editProjectDialogOpen, setEditProjectDialogOpen] = useState(false);
  const [editProjectFormData, setEditProjectFormData] = useState({
    projectName: '',
    description: '',
    technologiesUsed: [],
    clientType: '',
    projectUrl: '',
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

  // New state for services by industry
  const [servicesByIndustry, setServicesByIndustry] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [activeIndustryTab, setActiveIndustryTab] = useState(0);

  // New state for project completion status
  const [projectCompletionStatus, setProjectCompletionStatus] = useState({});

  // Fetch user's companies to determine ownership
  const fetchUserCompanies = async () => {
    if (!user || !token) {
      setUserCompanies([]);
      return;
    }
    
    try {
      const userCompaniesData = await CompanyService.getCompaniesOfUser(user.id, token);
      console.log("User's companies:", userCompaniesData);
      setUserCompanies(userCompaniesData);
    } catch (error) {
      console.error("Error fetching user's companies:", error.message);
      setUserCompanies([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user owns this company using the list of companies
  const isCompanyOwner = useMemo(() => {
    if (!company.companyId || userCompanies.length === 0) {
      return false;
    }
    
    return userCompanies.some(
      userCompany => userCompany.companyId === company.companyId
    );
  }, [company.companyId, userCompanies]);

  const fetchCompany = async () => {
    try {
      const companyData = await CompanyService.getCompany(companyName, token);
      console.log("Backend Company Data:", companyData);
      
      // Process projects to ensure technologies are in the right format
      if (companyData.projects && companyData.projects.length > 0) {
        companyData.projects = companyData.projects.map(project => ({
          ...project,
          technologiesUsed: typeof project.technologiesUsed === 'string'
            ? project.technologiesUsed.split(',').map(tech => tech.trim()).filter(tech => tech !== '')
            : (Array.isArray(project.technologiesUsed) ? project.technologiesUsed : [])
        }));
      }
      
      const companyProfile = new CompanyProfileDTO(companyData);
      setCompany(companyProfile);
      
      const data = await CompanyService.getCompanyPeople(companyProfile.companyId, token);
      setPeople(data);
      console.log("Backend Company People Data:", data);
      
      // Fetch reviews for the company
      try {
        const reviewsData = await ReviewService.getReviewsByCompany(companyProfile.companyId, token);
        console.log("Company Reviews:", reviewsData);
        
        // Update company object with reviews
        setCompany(prev => ({
          ...prev,
          reviews: reviewsData
        }));
      } catch (reviewError) {
        console.error("Error fetching company reviews:", reviewError.message);
      }
      
    } catch (error) {
      console.error("Error fetching company:", error.message);
    }
  };

  useEffect(() => {
    fetchCompany();
    fetchUserCompanies();
  }, [companyName, user, token]);

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

  // For debugging - remove in production
  useEffect(() => {
    console.log("Company ID:", company.companyId);
    console.log("User companies:", userCompanies);
    console.log("Is company owner:", isCompanyOwner);
  }, [company.companyId, userCompanies, isCompanyOwner]);

  // Function to check project completion status
  const checkProjectCompletionStatus = async (projectId) => {
    if (!company.companyId || !token) return;
    
    try {
      // Check if current company is the client or provider for this project
      const selectedProject = company.projects.find(p => p.projectId === projectId);
      if (!selectedProject) return;
      
      const isClient = selectedProject.clientCompanyName === company.name;
      
      let response;
      if (isClient) {
        response = await ProjectService.isProjectCompletedByClient(projectId, token);
      } else {
        response = await ProjectService.isProjectCompletedByProvider(projectId, token);
        console.log("Provider response:", response);
      }
      
      setProjectCompletionStatus(prev => ({
        ...prev,
        [projectId]: {
          ...prev[projectId],
          [isClient ? 'client' : 'provider']: response.isCompleted
        }
      }));
      
      return response.isCompleted;
    } catch (error) {
      console.error("Error checking project completion status:", error);
      return false;
    }
  };

  // Function to mark project as completed
  const handleMarkProjectAsCompleted = async (projectId, event) => {
    // Prevent triggering card click
    event.stopPropagation();
    
    try {
      await ProjectService.markProjectAsCompleted(projectId, token);
      
      // Refetch project completion status
      await checkProjectCompletionStatus(projectId);
      
      // Refresh company data to update project status
      await fetchCompany();
      
    } catch (error) {
      console.error("Error marking project as completed:", error);
    }
  };

  // Load completion status for all projects when company data changes
  useEffect(() => {
    if (!company.projects || company.projects.length === 0) return;
    
    const loadCompletionStatus = async () => {
      const projectStatusPromises = company.projects.map(async (project) => {
        // Check client side completion
        try {
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
  }, [company.projects, token]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleLogoUploadOpen = () => {
    setLogoUploadOpen(true);
    setUploadError('');
    setSelectedFile(null);
    setUploadSuccess(false);
    // Clear delete-related messages too
    setDeleteLogoError('');
    setDeleteLogoSuccess(false);
  };

  const handleLogoUploadClose = () => {
    setLogoUploadOpen(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.includes('png')) {
        setUploadError('Only PNG files are allowed');
        setSelectedFile(null);
      } else {
        setSelectedFile(file);
        setUploadError('');
      }
    }
  };

  const handleCreateProject = () => {
    navigate(`/create-project`, {
      state: {
        clientCompany: company.name
      }
    });
  };

  const handleViewUserProfile = (userName) => {
    navigate(`/profile/${userName}`);
  };

  const hasReviews = useMemo(() => {
    return company.totalReviews > 0;
  }, [company.totalReviews]);

  const handleLogoUpload = async () => {
    if (!selectedFile) {
      setUploadError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      await CompanyService.uploadLogo(company.companyId, selectedFile, token);
      setUploadSuccess(true);
      setTimeout(() => {
        fetchCompany();
        handleLogoUploadClose();
      }, 1500);
    } catch (error) {
      setUploadError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteLogoOpen = () => {
    setDeleteLogoConfirmOpen(true);
    setDeleteLogoError('');
    setDeleteLogoSuccess(false);
  };

  const handleDeleteLogoClose = () => {
    setDeleteLogoConfirmOpen(false);
  };

  const handleDeleteLogo = async () => {
    setDeletingLogo(true);
    setDeleteLogoError('');
    
    try {
      await CompanyService.deleteLogo(company.companyId, token);
      setDeleteLogoSuccess(true);
      setTimeout(() => {
        fetchCompany();
        handleLogoUploadClose(); // Close the upload dialog entirely
      }, 1500);
    } catch (error) {
      setDeleteLogoError(error.message);
    } finally {
      setDeletingLogo(false);
    }
  };

  // Project card click handler
  const handleProjectCardClick = (project) => {
    // Create a copy of the project with processed technologies
    const processedProject = {
      ...project,
      // Ensure technologies are always an array of strings
      technologiesUsed: Array.isArray(project.technologiesUsed)
        ? project.technologiesUsed.map(tech => tech.trim()).filter(tech => tech !== '')
        : (typeof project.technologiesUsed === 'string'
          ? project.technologiesUsed.split(',').map(tech => tech.trim()).filter(tech => tech !== '')
          : [])
    };
    
    console.log('Processed technologies:', processedProject.technologiesUsed);
    
    setSelectedProject(processedProject);
    
    // Check if the current company is associated with this project
    const isProjectAssociated = 
      project.clientCompanyName === company.name || 
      project.providerCompanyName === company.name;
    
    setCanEditProject(isCompanyOwner && isProjectAssociated);
    setProjectDialogOpen(true);
  };

  const handleProjectDialogClose = () => {
    setProjectDialogOpen(false);
    setSelectedProject(null);
  };

  const handleEditProjectClick = () => {
    // Prepare form data from selected project
    const formData = {
      projectName: selectedProject.projectName || '',
      description: selectedProject.description || '',
      technologiesUsed: Array.isArray(selectedProject.technologiesUsed) 
        ? [...selectedProject.technologiesUsed] 
        : [],
      clientType: selectedProject.clientType || '',
      projectUrl: selectedProject.projectUrl || '',
      startDate: selectedProject.startDate || '',
      completionDate: selectedProject.completionDate || '',
      services: Array.isArray(selectedProject.services) 
        ? selectedProject.services.map(service => ({
            id: service.id,
            name: service.name
          }))
        : []
    };
    
    setEditProjectFormData(formData);
    
    // Set selected services for the checkboxes
    setSelectedServices(
      Array.isArray(selectedProject.services) 
        ? selectedProject.services.map(service => service.id) 
        : []
    );
    
    setProjectDialogOpen(false);
    setEditProjectDialogOpen(true);
    setEditProjectError('');
  };

  const handleEditProjectDialogClose = () => {
    setEditProjectDialogOpen(false);
  };

  const handleProjectInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditProjectFormData({
      ...editProjectFormData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmitProjectEdit = async () => {
    if (!selectedProject || !selectedProject.projectId) {
      setEditProjectError('Project ID is missing');
      return;
    }

    setEditProjectLoading(true);
    setEditProjectError('');

    try {
      // Format the data to match the backend requirements
      const formattedProjectData = {
        projectId: selectedProject.projectId,
        projectName: editProjectFormData.projectName,
        description: editProjectFormData.description,
        // Join technologies array into a comma-separated string
        technologiesUsed: Array.isArray(editProjectFormData.technologiesUsed) 
          ? editProjectFormData.technologiesUsed.join(',') 
          : '',
        clientType: editProjectFormData.clientType || '',
        startDate: editProjectFormData.startDate || null,
        completionDate: editProjectFormData.completionDate || null,
        projectUrl: editProjectFormData.projectUrl || '',
        // Extract only the service IDs
        services: Array.isArray(editProjectFormData.services) 
          ? editProjectFormData.services.map(service => service.id)
          : []
      };

      console.log('Sending formatted project data:', formattedProjectData);

      // Use ProjectService to update the project
      await ProjectService.updateProject(formattedProjectData, token);

      // Refresh company data to get updated projects
      await fetchCompany();
      
      setEditProjectDialogOpen(false);
    } catch (error) {
      console.error("Error updating project:", error);
      setEditProjectError(error.message || 'Failed to update project');
    } finally {
      setEditProjectLoading(false);
    }
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

  const serviceStats = useMemo(() => {
    const countMap = {};
    let total = 0;

    company.projects?.forEach((project) => {
      project.services?.forEach((service) => {
        const key = service.id;
        total++;
        if (countMap[key]) {
          countMap[key].count += 1;
        } else {
          countMap[key] = {
            id: service.id,
            name: service.name,
            count: 1,
          };
        }
      });
    });

    return Object.values(countMap).map((service, index) => ({
      ...service,
      percentage: ((service.count / total) * 100).toFixed(1),
    }));
  }, [company]);

  if (!company) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography>Loading company details...</Typography>
      </Container>
    );
  }

  
  const getStatusColor = (isCompleted) => {
    return isCompleted ? 'success' : 'primary';
  };
  const tabs = [
    { label: "Overview", id: 0 },
    { label: "Portfolio", id: 1 }
  ];

  // Only add People tab if user is not the company owner
  if (!isCompanyOwner) {
    tabs.push({ label: "People", id: 2 });
  }

  // Add Reviews tab only if there are reviews
  if (hasReviews) {
    tabs.push({ label: "Reviews", id: isCompanyOwner ? 2 : 3 });
  }

  // Add Contact tab at the end
  tabs.push({ 
    label: "Contact", 
    id: isCompanyOwner 
      ? (hasReviews ? 3 : 2) 
      : (hasReviews ? 4 : 3) 
  });

  return (
    <Box>
      <Box
        sx={{
          backgroundColor: colors.neutral[100],
          py: 4,
          borderBottom: `1px solid ${colors.neutral[300]}`,
        }}
      >
        <Container maxWidth="lg">
          <Button variant="text" onClick={handleBack} sx={{ mb: 2 }}>
            ← Back to results
          </Button>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: 2,
                    backgroundColor: colors.neutral[200],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 3,
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  {company.logoUrl ? (
                    <>
                      <img
                        src={company.logoUrl}
                        alt={`${company.name} logo`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            'https://azurelogo.blob.core.windows.net/company-logos/defaultcompany.png';
                        }}
                      />
                      {isCompanyOwner && (
                        <Box sx={{ 
                          position: 'absolute', 
                          bottom: 0, 
                          right: 0, 
                          display: 'flex' 
                        }}>
                          <Tooltip title="Change logo">
                            <IconButton
                              size="small"
                              onClick={handleLogoUploadOpen}
                              sx={{
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                '&:hover': {
                                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                },
                              }}
                            >
                              <Edit size={16} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      )}
                    </>
                  ) : (
                    <>
                      <Typography variant="body2" color="text.secondary">
                        Logo
                      </Typography>
                      {isCompanyOwner && (
                        <Tooltip title="Upload logo">
                          <IconButton
                            size="small"
                            onClick={handleLogoUploadOpen}
                            sx={{
                              position: 'absolute',
                              bottom: 0,
                              right: 0,
                              backgroundColor: 'rgba(255, 255, 255, 0.8)',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              },
                            }}
                          >
                            <Upload size={16} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </>
                  )}
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography
                      variant="h4"
                      component="h1"
                      sx={{ fontWeight: 600 }}
                    >
                      {company.name}
                    </Typography>
                    {company.verified && (
                      <Chip
                        label="Verified"
                        size="small"
                        color="primary"
                        sx={{ ml: 2 }}
                      />
                    )}
                  </Box>
                  {company.totalReviews > 0 ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                      <Rating
                        value={company.overallRating}
                        readOnly
                        precision={0.1}
                      />
                      <Typography variant="body1" sx={{ ml: 1 }}>
                         ({company.totalReviews} reviews)
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body1" sx={{ my: 1 }}>
                      No Reviews
                    </Typography>
                  )}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Map size={16} />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {company.city}, {company.country}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Users size={16} />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {company.companySize}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  justifyContent: 'center',
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{ mb: 2 }}
                  href={`mailto:${company.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contact Company
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  fullWidth
                  href={
                    company.website?.startsWith('http')
                      ? company.website
                      : `https://${company.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Website
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Dialog open={logoUploadOpen} onClose={handleLogoUploadClose}>
        <DialogTitle>
          {company.logoUrl ? 'Change Company Logo' : 'Upload Company Logo'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ my: 2 }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {company.logoUrl 
                ? 'Upload a new logo for your company or delete the current one. Only PNG files are supported for uploads.'
                : 'Upload a new logo for your company. Only PNG files are supported.'}
            </Typography>

            <input
              accept="image/png"
              style={{ display: 'none' }}
              id="logo-upload-button"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="logo-upload-button">
              <Button
                variant="outlined"
                component="span"
                startIcon={<Upload size={16} />}
              >
                Select PNG File
              </Button>
            </label>

            {selectedFile && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Selected file: {selectedFile.name}
                </Typography>
              </Box>
            )}

            {uploadError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {uploadError}
              </Alert>
            )}

            {uploadSuccess && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Logo uploaded successfully!
              </Alert>
            )}
            
            {deleteLogoError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {deleteLogoError}
              </Alert>
            )}

            {deleteLogoSuccess && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Logo deleted successfully!
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', px: 3 }}>
          <Box>
            {company.logoUrl && (
              <Button
                onClick={handleDeleteLogo}
                color="error"
                disabled={deletingLogo || uploading}
                startIcon={<Trash2 size={16} />}
              >
                {deletingLogo ? 'Deleting...' : 'Delete Logo'}
              </Button>
            )}
          </Box>
          <Box>
            <Button onClick={handleLogoUploadClose} sx={{ mr: 1 }}>Cancel</Button>
            <Button
              onClick={handleLogoUpload}
              variant="contained"
              disabled={!selectedFile || uploading || deletingLogo}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteLogoConfirmOpen} onClose={handleDeleteLogoClose}>
        <DialogTitle>Delete Company Logo</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Are you sure you want to delete the company logo? This action cannot be undone.
          </Typography>
          {deleteLogoError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {deleteLogoError}
            </Alert>
          )}
          {deleteLogoSuccess && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Logo deleted successfully!
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteLogoClose}>Cancel</Button>
          <Button
            onClick={handleDeleteLogo}
            variant="contained"
            color="error"
            disabled={deletingLogo}
          >
            {deletingLogo ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

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
                    <Calendar size={16} color={colors.neutral[500]} />
                    <Typography
                      variant="body2"
                      sx={{ ml: 1 }}
                      color="text.secondary"
                    >
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
                {canEditProject && (
                  <Button
                    startIcon={<Edit size={16} />}
                    variant="contained"
                    onClick={handleEditProjectClick}
                  >
                    Edit Project
                  </Button>
                )}
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
            
            <Grid item xs={12}>
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

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ 
          borderBottom: 1, 
          borderColor: 'divider', 
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="company tabs">
            {tabs.map((tab) => (
              <Tab key={tab.id} label={tab.label} />
            ))}
          </Tabs>
          
          {isCompanyOwner && (
            <Button
              variant="outlined"
              startIcon={<Edit size={16} />}
              onClick={() => {
                navigate(`/company/edit-company/${company.companyName.replace(/\s+/g, '')}`)
              }}
              size="small"
            >
              Edit Company
            </Button>
          )}
        </Box>

        <Box>
          {activeTab === 0 && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  About us
                </Typography>
                <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                  {company.description}
                </Typography>

                {company.services && company.services.length > 0 && (
                  <>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mt: 4 }}>
                      Services Breakdown
                    </Typography>
                    <Box sx={{ 
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      mb: 4
                    }}>
                      {/* Chart container */}
                      <Box sx={{ 
                        width: '100%',
                        display: 'flex', 
                        justifyContent: 'center',
                        mb: 4
                      }}>
                        <PieChart width={300} height={220}>
                          <Pie
                            data={company.services}
                            cx={150}
                            cy={100}
                            innerRadius={60}
                            outerRadius={90}
                            dataKey="percentage"
                            nameKey="serviceName"
                            labelLine={false}
                          >
                            {company.services.map((_, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={[
                                  colors.primary[500],
                                  colors.primary[400],
                                  colors.primary[300],
                                  colors.primary[600],
                                ][index % 4]}
                              />
                            ))}
                          </Pie>
                          <RechartsTooltip 
                            formatter={(value, name) => [`${value}%`, name]} 
                            contentStyle={{ backgroundColor: 'white', borderRadius: '4px', padding: '8px' }}
                          />
                        </PieChart>
                      </Box>

                      {/* Legend container - without borders and with larger text */}
                      <Box sx={{ 
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        maxWidth: '600px',
                        gap: 3
                      }}>
                        {company.services.map((service, index) => (
                          <Box 
                            key={index} 
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              padding: '4px 8px',
                              minWidth: '150px'
                            }}
                          >
                            <Box sx={{ 
                              width: 16, 
                              height: 16, 
                              borderRadius: '50%',
                              backgroundColor: [
                                colors.primary[500],
                                colors.primary[400],
                                colors.primary[300],
                                colors.primary[600],
                              ][index % 4],
                              mr: 1.5
                            }} />
                            <Typography variant="subtitle2" sx={{ fontSize: '1rem' }}>
                              {service.serviceName}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </>
                )}
              </Grid>

              <Grid item xs={12} md={4}>
                {company.projects && company.projects.length > 0 && (
                  <>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                      Projects Overview
                    </Typography>
                    <Stack spacing={3}>
                      {serviceStats.map((project, index) => (
                        <Box key={index}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="subtitle1" sx={{ color: colors.neutral[700] }}>
                              {project.name}
                            </Typography>
                            <Typography variant="subtitle1" sx={{ color: colors.primary[600] }}>
                              {project.percentage}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={project.percentage}
                            sx={{
                              height: 10,
                              borderRadius: 5,
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: project.color,
                              },
                            }}
                          />
                        </Box>
                      ))}
                    </Stack>
                  </>
                )}
              </Grid>
            </Grid>
          )}

          {activeTab === 1 && (
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}> 
                  {isCompanyOwner && (
                    <Button
                      variant="contained"
                      startIcon={<Plus size={16} />}
                      onClick={handleCreateProject}
                    >
                      Create Project
                    </Button>
                  )}
                </Box>

                {company.projects && company.projects.filter(project => 
                  // Only show projects where this company is the provider
                  project.providerCompanyName === company.name
                ).length > 0 ? (
                  <Grid container spacing={3}>
                    {company.projects
                      .filter(project => project.providerCompanyName === company.name)
                      .map((project, index) => (
                        <Grid item xs={12} md={6} key={index}>
                          <Card
                            elevation={2}
                            sx={{ 
                              height: '100%', 
                              display: 'flex', 
                              flexDirection: 'column',
                              cursor: 'pointer',
                              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: 4
                              }
                            }}
                            onClick={() => handleProjectCardClick(project)}
                          >
                            <CardContent sx={{ flexGrow: 1 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                <Typography variant="h6" gutterBottom>
                                  {project.projectName}
                                </Typography>
                                <Chip 
                                  label={project.isCompleted ? 'Completed' : 'Ongoing'} 
                                  color={getStatusColor(project.isCompleted)} 
                                  size="small" 
                                />
                              </Box>
                              
                              {/* New completion status display */}
                              {projectCompletionStatus[project.projectId] && project.isOnCompedia && (
                                <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                                  <Chip 
                                    icon={<Check size={14} />}
                                    label={projectCompletionStatus[project.projectId].client ? "Client Completed" : "Awaiting Client Completion"}
                                    size="small"
                                    variant={projectCompletionStatus[project.projectId].client ? "filled" : "outlined"}
                                    color={projectCompletionStatus[project.projectId].client ? "success" : "warning"}
                                    sx={{ 
                                      fontWeight: projectCompletionStatus[project.projectId].client ? 'bold' : 'normal',
                                      borderWidth: projectCompletionStatus[project.projectId].client ? 2 : 1,
                                    }}
                                  />
                                  <Chip 
                                    icon={<Check size={14} />}
                                    label={projectCompletionStatus[project.projectId].provider ? "Provider Completed" : "Awaiting Provider Completion"}
                                    size="small"
                                    variant={projectCompletionStatus[project.projectId].provider ? "filled" : "outlined"}
                                    color={projectCompletionStatus[project.projectId].provider ? "success" : "warning"}
                                    sx={{ 
                                      fontWeight: projectCompletionStatus[project.projectId].provider ? 'bold' : 'normal',
                                      borderWidth: projectCompletionStatus[project.projectId].provider ? 2 : 1,
                                    }}
                                  />
                                </Box>
                              )}
                              
                              <Typography variant="body2" color="text.secondary" paragraph>
                                {project.description}
                              </Typography>
                              {(project.startDate || project.completionDate) && (
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  <Calendar size={16} color={colors.neutral[500]} />
                                  <Typography
                                    variant="body2"
                                    sx={{ ml: 1 }}
                                    color="text.secondary"
                                  >
                                    {project.startDate
                                      ? new Date(project.startDate).toLocaleDateString()
                                      : 'Unknown'}{' '}
                                    -{' '}
                                    {project.completionDate
                                      ? new Date(project.completionDate).toLocaleDateString()
                                      : 'Present'}
                                  </Typography>
                                </Box>
                              )}
                              {project.clientCompanyName && (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ mb: 1 }}
                                >
                                  <strong>Client:</strong>{' '}
                                  {project.clientCompanyName}
                                </Typography>
                              )}
                              {/* Removed provider company name display since it's redundant */}
                              {project.services && project.services.length > 0 && (
                                <Box sx={{ mt: 2 }}>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 1 }}
                                  >
                                    <strong>Services:</strong>
                                  </Typography>
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {project.services.map((service, serviceIndex) => (
                                      <Chip
                                        key={serviceIndex}
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
                                    ))}
                                  </Box>
                                </Box>
                              )}
                              {project.technologiesUsed && project.technologiesUsed.length > 0 && (
                                <Box sx={{ mt: 2 }}>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 1 }}
                                  >
                                    <strong>Technologies:</strong>
                                  </Typography>
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {Array.isArray(project.technologiesUsed) 
                                      ? project.technologiesUsed.map((tech, techIndex) => (
                                        <Chip
                                          key={techIndex}
                                          label={tech}
                                          size="small"
                                          sx={{
                                            backgroundColor: colors.primary[300],
                                            color: 'white',
                                          }}
                                        />
                                      ))
                                      : typeof project.technologiesUsed === 'string' 
                                        ? project.technologiesUsed.split(',').map((tech, techIndex) => (
                                          <Chip
                                            key={techIndex}
                                            label={tech.trim()}
                                            size="small"
                                            sx={{
                                              backgroundColor: colors.primary[300],
                                              color: 'white',
                                            }}
                                          />
                                        ))
                                        : null
                                    }
                                  </Box>
                                </Box>
                              )}
                            </CardContent>
                            <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                              {project.projectUrl && (
                                <Button
                                  variant="outlined"
                                  size="small"
                                  href={project.projectUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Visit Project
                                </Button>
                              )}
                              
                              {/* Mark as Completed Button for company owners */}
                              {isCompanyOwner && project.isOnCompedia && (
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  {/* Show Mark as Completed button only if not already marked as completed by this company */}
                                  {(!projectCompletionStatus[project.projectId] || 
                                    (project.providerCompanyName === company.name && !projectCompletionStatus[project.projectId]?.provider) ||
                                    (project.clientCompanyName === company.name && !projectCompletionStatus[project.projectId]?.client)) && (
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
                                </Box>
                              )}
                            </Box>
                          </Card>
                        </Grid>
                      ))}
                  </Grid>
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    No portfolio projects available.
                  </Typography>
                )}
              </Grid>
            </Grid>
          )}
          
          {!isCompanyOwner && activeTab === 2 && (
            <Grid container spacing={4}>
              <Grid item xs={12}>
                {people && people.length > 0 ? (
                  <Grid container spacing={3}>
                    {people.map((member, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card 
                          elevation={1} 
                          sx={{ 
                            cursor: 'pointer',
                            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: 3
                            }
                          }}
                          onClick={() => handleViewUserProfile(member.userName)}
                        >
                          <CardContent sx={{ textAlign: 'center', py: 3 }}>
                            <Avatar
                              src={member.profilePictureUrl}
                              alt={`${member.firstName} ${member.lastName}`}
                              sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
                            />
                            <Typography variant="h6" gutterBottom>
                              {member.firstName} {member.lastName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {member.role || 'Member'}
                            </Typography>
                            {member.title && (
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                {member.title}
                              </Typography>
                            )}
                            <Button
                              variant="text"
                              size="small"
                              sx={{ mt: 2 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewUserProfile(member.userName);
                              }}
                            >
                              View Profile
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    No members available for this company.
                  </Typography>
                )}
              </Grid>
            </Grid>
          )}

          {hasReviews && activeTab === (isCompanyOwner ? 2 : 3) && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  Reviews
                </Typography>
                {company.reviews && company.reviews.length > 0 ? (
                  <List disablePadding>
                    {company.reviews.map((review) => (
                      <Card 
                        key={review.reviewId} 
                        sx={{ 
                          mb: 3,
                          borderRadius: 2,
                          boxShadow: (theme) => `0 6px 16px -8px ${alpha(theme.palette.mode === 'light' ? '#1c273133' : '#000000')}`,
                          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: (theme) => `0 8px 20px -6px ${alpha(theme.palette.mode === 'light' ? '#1c273133' : '#000000', 0.15)}`
                          },
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Box>
                              <Typography variant="h6" fontWeight="600" sx={{ mb: 0.5 }}>
                                Project: {review.projectName}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar 
                                  sx={{ 
                                    width: 28, 
                                    height: 28, 
                                    bgcolor: (theme) => theme.palette.primary.main,
                                    fontSize: '0.875rem'
                                  }}
                                >
                                  {review.userName.charAt(0).toUpperCase()}
                                </Avatar>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                  {review.userName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                  • {new Date(review.datePosted).toLocaleDateString()}
                                </Typography>
                              </Box>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                              <Rating 
                                value={review.rating} 
                                readOnly 
                                precision={0.5} 
                                size="small" 
                                sx={{ mb: 0.5 }}
                              />
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  display: 'block',
                                  fontWeight: 500,
                                  color: (theme) => review.rating >= 4 
                                    ? theme.palette.success.main
                                    : review.rating >= 3 
                                      ? theme.palette.warning.main
                                      : theme.palette.error.main
                                }}
                              >
                                {review.rating >= 4.5 ? 'Excellent' : 
                                 review.rating >= 4 ? 'Very Good' : 
                                 review.rating >= 3 ? 'Good' :
                                 review.rating >= 2 ? 'Fair' : 'Poor'}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Divider sx={{ my: 2 }} />
                          
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              lineHeight: 1.6,
                              color: 'text.primary',
                              fontSize: '1rem',
                              fontStyle: 'italic',
                              '&::before': { 
                                content: '""',
                                display: 'inline-block',
                                verticalAlign: 'middle',
                                mr: 1,
                                width: 3,
                                height: 20,
                                backgroundColor: 'primary.main',
                                borderRadius: 1
                              }
                            }}
                          >
                            {review.reviewText}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </List>
                ) : (
                  <Box 
                    sx={{ 
                      textAlign: 'center', 
                      py: 6, 
                      borderRadius: 2, 
                      backgroundColor: (theme) => alpha(theme.palette.primary.light, 0.05),
                      border: '1px dashed',
                      borderColor: 'divider'
                    }}
                  >
                    <Typography variant="body1" color="text.secondary">
                      No reviews available for this company yet.
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          )}

          {activeTab === (isCompanyOwner 
            ? (hasReviews ? 3 : 2) 
            : (hasReviews ? 4 : 3)) && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
               
                <Typography variant="body1" paragraph>
                  For inquiries or to request a quote, please contact {company.name} directly.
                </Typography>
                
                <List disablePadding>
                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Globe size={18} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Website" 
                      secondary={
                        <Typography 
                          component="a" 
                          href={company.website?.startsWith('http') ? company.website : `https://${company.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          color="primary"
                        >
                          {company.website}
                        </Typography>
                      } 
                    />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Mail size={18} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Email" 
                      secondary={
                        <Typography 
                          component="a" 
                          href={`mailto:${company.email}`} 
                          color="primary"
                        >
                          {company.email}
                        </Typography>
                      } 
                    />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Phone size={18} />
                    </ListItemIcon>
                    <ListItemText primary="Phone" secondary={company.phone} />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          )}
          
        </Box>
      </Container>
    </Box>
  );
};

export default CompanyPage;