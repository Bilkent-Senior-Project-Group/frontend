import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Grid, Card, CardContent, 
  CardActionArea, Dialog, DialogTitle, DialogContent, 
  DialogActions, Button, Box, Divider, Paper, Chip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { colors } from '../../../theme/theme';

import ProjectService from '../../../services/ProjectService';
import CompanyService from '../../../services/CompanyService';

const ProjectRequestsPage = () => {
  const { companyName } = useParams();
  const [projectRequests, setProjectRequests] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  // Fetch project requests
  useEffect(() => {
    const fetchProjectRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        const companyData = await CompanyService.getCompany(companyName, token);
        const response = await ProjectService.getProjectRequests(companyData.companyId, token);
        // Properly handle the response to ensure we're using the correct data structure
        const requestsData = Array.isArray(response) ? response : 
                           (Array.isArray(response.data) ? response.data : []);
        setProjectRequests(requestsData);
      } catch (err) {
        console.error("Error fetching project requests:", err);
        setError("Failed to load project requests. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectRequests();
  }, [companyName, token]);

  const handleCardClick = (project) => {
    setSelectedProject(project);
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
        // Send true as request body for approve
        await ProjectService.approveProjectRequest(selectedProject.requestId, token, true);
      } else {
        // Send false as request body for decline
        await ProjectService.declineProjectRequest(selectedProject.requestId, token, false);
      }
      
      // Refresh the project requests list
      const companyData = await CompanyService.getCompany(companyName, token);
      const response = await ProjectService.getProjectRequests(companyData.companyId, token);
      const requestsData = Array.isArray(response) ? response : 
                        (Array.isArray(response.data) ? response.data : []);
      setProjectRequests(requestsData);
      
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

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Project Requests
      </Typography>
      
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
                <CardActionArea onClick={() => handleCardClick(project)}>
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

      {/* Project Details Dialog */}
      <Dialog 
        open={detailsOpen} 
        onClose={handleDetailsClose}
        maxWidth="md"
        fullWidth
      >
        {selectedProject && (
          <>
            <DialogTitle sx={{ fontWeight: 'bold' }}>
              Project Request Details
            </DialogTitle>
            <DialogContent dividers>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {selectedProject.projectName || 'Unnamed Project'}
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" paragraph>
                  {selectedProject.description || 'No description provided.'}
                </Typography>
              </Box>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Client Company
                    </Typography>
                    <Typography variant="body1">
                      {selectedProject.clientCompanyName || 'Not specified'}
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
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={handleCancelAction}
      >
        <DialogTitle>
          {actionType === 'approve' ? 'Approve Project Request?' : 'Decline Project Request?'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {actionType === 'approve' 
              ? 'Are you sure you want to approve this project request? This action cannot be undone.'
              : 'Are you sure you want to decline this project request? This action cannot be undone.'
            }
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelAction} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmAction} 
            color={actionType === 'approve' ? 'success' : 'error'}
            variant="contained"
            autoFocus
          >
            {actionType === 'approve' ? 'Yes, Approve' : 'Yes, Decline'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProjectRequestsPage;