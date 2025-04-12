import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  Stack
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Add as AddIcon, 
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext.js';
import { colors } from '../../theme/theme.js';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    // This will be replaced with actual API call when backend is ready
    const fetchProjects = async () => {
      try {
        setLoading(true);
        // Simulated data for now - using your ProjectDTO structure
        const mockProjects = [
          {
            ProjectId: 1,
            ProjectName: 'E-commerce Platform',
            Description: 'A modern e-commerce solution with integrated payment processing',
            TechnologiesUsed: ['React', 'Node.js', 'MongoDB'],
            Industry: 'Retail',
            Impact: 'Increased sales by 30%',
            StartDate: '2024-03-15T00:00:00Z',
            CompletionDate: '2025-01-15T00:00:00Z',
            IsOnCompedia: true,
            IsCompleted: true,
            ProjectUrl: 'https://ecommerce-example.com',
            ClientType: 'External',
            ClientCompanyName: 'Retail Solutions Inc.',
            ProviderCompanyName: 'Your Company'
          },
          {
            ProjectId: 2,
            ProjectName: 'CRM System',
            Description: 'Customer relationship management system with analytics dashboard',
            TechnologiesUsed: ['Angular', 'C#', 'SQL Server'],
            Industry: 'Business Services',
            Impact: 'Improved customer retention by 25%',
            StartDate: '2024-10-01T00:00:00Z',
            CompletionDate: null,
            IsOnCompedia: false,
            IsCompleted: false,
            ProjectUrl: 'https://crm-example.com',
            ClientType: 'External',
            ClientCompanyName: 'Business Services Ltd',
            ProviderCompanyName: 'Your Company'
          },
          {
            ProjectId: 3,
            ProjectName: 'Mobile Banking App',
            Description: 'Secure mobile banking application with biometric authentication',
            TechnologiesUsed: ['Flutter', 'Firebase', 'Swift'],
            Industry: 'Finance',
            Impact: 'Reduced transaction time by 40%',
            StartDate: '2024-11-01T00:00:00Z',
            CompletionDate: null,
            IsOnCompedia: false,
            IsCompleted: false,
            ProjectUrl: 'https://banking-example.com',
            ClientType: 'External',
            ClientCompanyName: 'FinTech Solutions',
            ProviderCompanyName: 'Your Company'
          },
        ];
        
        // Simulate API delay
        setTimeout(() => {
          setProjects(mockProjects);
          setLoading(false);
        }, 800);
        
        // When backend is ready, replace with:
        // const response = await ProjectService.getCompanyProjects(token);
        // setProjects(response.data);
      } catch (err) {
        setError('Failed to load projects. Please try again later.');
        setLoading(false);
        console.error('Error fetching projects:', err);
      }
    };

    fetchProjects();
  }, [token]);

  const handleViewProject = (projectId) => {
    navigate(`/company/projects/${projectId}`);
  };

  const handleEditProject = (projectId, e) => {
    e.stopPropagation(); // Prevent triggering the card click
    // navigate(`/company/projects/edit-project/${projectId}`);
    navigate(`/company/projects/edit-project`);
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
    // Simplified for now to just show one partner company
    return project.ClientCompanyName || 'No partner company';
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
          backgroundColor: colors.error.light,
          borderRadius: 1,
          color: colors.error.dark
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
                        Projects
                    </Typography>
                    <Box>
                        <Button 
                            onClick={() => navigate('/company/projects/project-requests')} 
                            variant="outlined" 
                            startIcon={<VisibilityIcon />}
                            sx={{ mr: 2 }}
                        >
                            View Project Requests
                        </Button>
                        <Button 
                            onClick={() => navigate('/create-project')}
                            variant="contained" 
                            startIcon={<AddIcon />}
                        >
                            Add Project
                        </Button>
                    </Box>
                    </Box>
                </Container>
            </Box>

            {/* Projects List */}
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
                        component={Link}
                        to="/projects/add" 
                        variant="contained" 
                        startIcon={<AddIcon />}
                    >
                        Add Your First Project
                    </Button>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {projects.map((project) => (
                        <Grid item xs={12} md={6} lg={4} key={project.ProjectId}>
                            <Card 
                                elevation={1} 
                                sx={{ 
                                    height: '100%',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 3
                                    }
                                }}
                                onClick={() => handleViewProject(project.ProjectId)}
                            >
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                        <Chip 
                                            label={project.IsCompleted ? 'Completed' : 'Ongoing'} 
                                            color={getStatusColor(project.IsCompleted)} 
                                            size="small" 
                                        />
                                        <IconButton 
                                            size="small"
                                            onClick={(e) => handleEditProject(project.ProjectId, e)}
                                            sx={{ 
                                                color: colors.neutral[500],
                                                '&:hover': { color: colors.primary[500] } 
                                            }}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                    
                                    <Typography variant="h6" component="div" sx={{ fontWeight: 500, mb: 1 }}>
                                        {project.ProjectName}
                                    </Typography>
                                    
                                    <Typography 
                                        variant="body2" 
                                        color="text.secondary" 
                                        sx={{ 
                                            mb: 2,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                        }}
                                    >
                                        {project.Description}
                                    </Typography>
                                    
                                    <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
                                        {project.TechnologiesUsed.slice(0, 3).map((tech, index) => (
                                            <Chip 
                                                key={index} 
                                                label={tech} 
                                                size="small" 
                                                variant="outlined"
                                                sx={{ fontSize: '0.7rem' }}
                                            />
                                        ))}
                                        {project.TechnologiesUsed.length > 3 && (
                                            <Chip 
                                                label={`+${project.TechnologiesUsed.length - 3}`} 
                                                size="small" 
                                                variant="outlined"
                                                sx={{ fontSize: '0.7rem' }}
                                            />
                                        )}
                                    </Stack>
                                    
                                    <Divider sx={{ my: 2 }} />
                                    
                                    <Box sx={{ mt: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Partner Company:
                                            </Typography>
                                            <Typography variant="body2" noWrap sx={{ maxWidth: '60%', textAlign: 'right' }}>
                                                {getPartnerCompanyName(project)}
                                            </Typography>
                                        </Box>
                                        
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Industry:
                                            </Typography>
                                            <Typography variant="body2">
                                                {project.Industry}
                                            </Typography>
                                        </Box>
                                        
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Started:
                                            </Typography>
                                            <Typography variant="body2">
                                                {formatDate(project.StartDate)}
                                            </Typography>
                                        </Box>
                                        
                                        {project.IsCompleted && (
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Completed:
                                                </Typography>
                                                <Typography variant="body2">
                                                    {formatDate(project.CompletionDate)}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    </Box>
);
};

export default ProjectsPage;