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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tab,
  Tabs,
  Link as MuiLink,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Link as LinkIcon, 
  Briefcase, 
  Star, 
  Clock, 
  CheckCircle, 
  Code,
  Activity,
  Award,
  Edit as EditIcon
} from 'lucide-react';
import { colors } from '../../../../src/theme/theme.js';
import ProjectService from '../../../services/ProjectService.js';
import { useAuth } from '../../../contexts/AuthContext.js';
import ProjectDTO from '../../../DTO/project/ProjectDTO.js';

const Project = () => {
  const [companyName, projectId] = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const { token } = useAuth();

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        
        const response = await ProjectService.getProjectById(projectId, token);
        const projectData = new ProjectDTO(response.data);
        setLoading(false);
        setProject(projectData);
      } catch (err) {
        setError('Failed to load project details. Please try again later.');
        setLoading(false);
        console.error('Error fetching project details:', err);
      }
    };

    fetchProjectDetails();
  }, [companyName, projectId, token]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleBack = () => {
    navigate(`/company/projects/${companyName.replace(/\s+/g, '')}`);
  };

  const handleEdit = () => {
    
    // navigate(`/company/projects/edit-project/${projectId}`);
    navigate(`/company/projects/edit-project`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
          <Typography>Loading project details...</Typography>
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

  if (!project) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography>Project not found.</Typography>
      </Container>
    );
  }

  return (
    <Box>
      {/* Project Header */}
      <Box 
        sx={{ 
          backgroundColor: colors.neutral[100],
          py: 4,
          borderBottom: `1px solid ${colors.neutral[300]}`
        }}
      >
        <Container maxWidth="lg">
          <Button 
            variant="text" 
            onClick={handleBack}
            sx={{ mb: 2 }}
          >
            ← Back to Projects
          </Button>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
                      {project.ProjectName}
                    </Typography>
                    <Chip 
                      label={project.IsCompleted ? 'Completed' : 'Ongoing'} 
                      color={project.IsCompleted ? 'success' : 'primary'} 
                      size="small" 
                    />
                    {project.IsOnCompedia && (
                      <Chip 
                        label="Published on Compedia" 
                        size="small" 
                        color="secondary" 
                      />
                    )}
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Calendar size={16} />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        Started: {formatDate(project.StartDate)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Clock size={16} />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {project.IsCompleted 
                          ? `Completed: ${formatDate(project.CompletionDate)}` 
                          : 'In Progress'}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Briefcase size={16} />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        Industry: {project.Industry}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Button 
                  variant="outlined"
                  startIcon={<EditIcon size={16} />}
                  onClick={handleEdit}
                >
                  Edit Project
                </Button>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
                {project.ProjectUrl && (
                  <Button 
                    variant="contained" 
                    size="large"
                    fullWidth
                    startIcon={<LinkIcon size={18} />}
                    href={project.ProjectUrl?.startsWith('http') ? project.ProjectUrl : `https://${project.ProjectUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ mb: 2 }}
                  >
                    Visit Project
                  </Button>
                )}
                
                {project.ClientCompanyName && (
                  <Button 
                    variant="outlined" 
                    size="large"
                    fullWidth
                    onClick={() => navigate(`/companies/${encodeURIComponent(project.ClientCompanyName)}`)}
                  >
                    View Partner Company
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Tabs & Content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="project tabs">
            <Tab label="Overview" />
            <Tab label="Technical Details" />
            <Tab label="Impact & Outcomes" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box>
          {/* Overview Tab */}
          {activeTab === 0 && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  Project Description
                </Typography>
                <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                  {project.Description}
                </Typography>
                
                {project.Impact && (
                  <>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mt: 4 }}>
                      Business Impact
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {project.Impact}
                    </Typography>
                  </>
                )}
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card elevation={1}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Project Information
                    </Typography>
                    <List disablePadding>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Briefcase size={18} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Client Type" 
                          secondary={project.ClientType || 'Not specified'} 
                        />
                      </ListItem>
                      
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Star size={18} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Partner Company" 
                          secondary={project.ClientCompanyName || 'Not specified'} 
                        />
                      </ListItem>
                      
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Calendar size={18} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Start Date" 
                          secondary={formatDate(project.StartDate)} 
                        />
                      </ListItem>
                      
                      {project.CompletionDate && (
                        <ListItem disableGutters>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <CheckCircle size={18} />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Completion Date" 
                            secondary={formatDate(project.CompletionDate)} 
                          />
                        </ListItem>
                      )}
                      
                      {project.ProjectUrl && (
                        <ListItem disableGutters>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <LinkIcon size={18} />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Project URL" 
                            secondary={
                              <MuiLink 
                                href={project.ProjectUrl} 
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {project.ProjectUrl}
                              </MuiLink>
                            } 
                          />
                        </ListItem>
                      )}
                    </List>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="h6" gutterBottom>
                      Provider Information
                    </Typography>
                    <List disablePadding>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Briefcase size={18} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Provider Company" 
                          secondary={project.ProviderCompanyName || 'Not specified'} 
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
          
          {/* Technical Details Tab */}
          {activeTab === 1 && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  Technologies Used
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
                  {project.TechnologiesUsed.map((tech, index) => (
                    <Chip 
                      key={index} 
                      label={tech} 
                      icon={<Code size={16} />}
                      sx={{ px: 1 }}
                    />
                  ))}
                </Box>
                
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mt: 4 }}>
                  Technical Overview
                </Typography>
                <Typography variant="body1" paragraph>
                  {project.Description}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card elevation={1}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Development Information
                    </Typography>
                    <List disablePadding>
                      {project.TechnologiesUsed && project.TechnologiesUsed.length > 0 && (
                        <ListItem disableGutters>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <Code size={18} />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Primary Tech Stack" 
                            secondary={project.TechnologiesUsed.slice(0, 3).join(', ')} 
                          />
                        </ListItem>
                      )}
                      
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Calendar size={18} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Development Duration" 
                          secondary={project.CompletionDate 
                            ? `${Math.ceil((new Date(project.CompletionDate) - new Date(project.StartDate)) / (1000 * 60 * 60 * 24 * 30))} months` 
                            : 'Ongoing'}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
          
          {/* Impact & Outcomes Tab */}
          {activeTab === 2 && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  Business Impact
                </Typography>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="body1" paragraph>
                    {project.Impact || 'No impact data available for this project.'}
                  </Typography>
                </Box>
                
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mt: 4 }}>
                  Industry Context
                </Typography>
                <Typography variant="body1" paragraph>
                  This project was developed for the {project.Industry} industry.
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card elevation={1}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Key Metrics
                    </Typography>
                    <List disablePadding>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Activity size={18} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Project Status" 
                          secondary={project.IsCompleted ? 'Completed' : 'In Progress'} 
                        />
                      </ListItem>
                      
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Award size={18} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Compedia Status" 
                          secondary={project.IsOnCompedia ? 'Published on Compedia' : 'Not Published'}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Project;