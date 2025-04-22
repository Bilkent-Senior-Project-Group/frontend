import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
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
import CompanyService from '../../services/CompanyService.js';
import CompanyProfileDTO from '../../DTO/company/CompanyProfileDTO.js';
import ProjectDTO from '../../DTO/project/ProjectDTO.js'

const ProjectsPage = () => {
  const { companyName } = useParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { token } = useAuth();

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

  const handleViewProject = (projectId) => {
    // navigate(`/company/projects/${companyName}/${projectId}`);
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
    return project.clientCompanyName || 'No partner company';
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
          backgroundColor: '#ffebee',  // Light red color
          borderRadius: 1,
          color: '#c62828'  // Dark red color
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
                                    providerCompany: companyName // This comes from useParams
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
                        onClick={() => navigate('/create-project', {
                            state: {
                                providerCompany: companyName // This comes from useParams
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
                                    }
                                }}
                                onClick={() => handleViewProject(project.projectId)}
                            >
                                <CardContent>
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
                                        {project.description}
                                    </Typography>
                                    
                                    <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
                                        {project.technologiesUsed.slice(0, 3).map((tech, index) => (
                                            <Chip 
                                                key={index} 
                                                label={tech} 
                                                size="small" 
                                                variant="outlined"
                                                sx={{ fontSize: '0.7rem' }}
                                            />
                                        ))}
                                        {project.technologiesUsed.length > 3 && (
                                            <Chip 
                                                label={`+${project.technologiesUsed.length - 3}`} 
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
                                                Started:
                                            </Typography>
                                            <Typography variant="body2">
                                                {formatDate(project.startDate)}
                                            </Typography>
                                        </Box>
                                        
                                        {project.isCompleted && (
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Completed:
                                                </Typography>
                                                <Typography variant="body2">
                                                    {formatDate(project.completionDate)}
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