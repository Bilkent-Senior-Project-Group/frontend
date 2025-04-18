import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Grid, Card, CardContent, 
  CardActionArea, Dialog, DialogTitle, DialogContent, 
  DialogActions, Button, Box, Divider, Paper 
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { colors } from '../../../theme/theme';

// Add this import when ready to integrate with backend
// import ProjectService from '../../../services/ProjectService';

// Mock data for project requests - Remove this when backend is integrated
const mockProjectRequests = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "A full-featured online shopping platform with payment integration",
    requestDate: "2025-04-05",
    clientName: "Retail Solutions Inc.",
    budget: "$45,000",
    duration: "4 months",
    status: "pending"
  },
  {
    id: 2,
    title: "Healthcare Management System",
    description: "Patient records and appointment scheduling system for clinics",
    requestDate: "2025-04-01",
    clientName: "MediCare Group",
    budget: "$60,000",
    duration: "6 months",
    status: "pending"
  },
  {
    id: 3,
    title: "Inventory Management Tool",
    description: "Real-time inventory tracking and management system",
    requestDate: "2025-04-08",
    clientName: "Supply Chain Partners",
    budget: "$32,000",
    duration: "3 months",
    status: "pending"
  }
];

const ProjectRequestsPage = () => {
  const [projectRequests, setProjectRequests] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState('');
  // Add these states for backend integration
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);

  // Fetch project requests - Replace with this code when backend is ready
  useEffect(() => {
    // Current implementation with mock data
    setProjectRequests(mockProjectRequests);

    /* BACKEND INTEGRATION - Uncomment when ready
    const fetchProjectRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await ProjectService.getProjectRequests();
        setProjectRequests(response.data);
      } catch (err) {
        console.error("Error fetching project requests:", err);
        setError("Failed to load project requests. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectRequests();
    */
  }, []);

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

  const handleConfirmAction = () => {
    // Current implementation without backend
    const updatedProjects = projectRequests.filter(
      project => project.id !== selectedProject.id
    );
    
    setProjectRequests(updatedProjects);
    setConfirmDialogOpen(false);
    setDetailsOpen(false);
    
    console.log(`Project ${actionType === 'approve' ? 'approved' : 'declined'}: ${selectedProject.title}`);

    /* BACKEND INTEGRATION - Uncomment when ready
    const updateProjectRequest = async () => {
      setLoading(true);
      try {
        if (actionType === 'approve') {
          await ProjectService.approveProjectRequest(selectedProject.id, token);
        } else {
          await ProjectService.declineProjectRequest(selectedProject.id, token);
        }
        
        // Refresh the project requests list
        const response = await ProjectService.getProjectRequests();
        setProjectRequests(response.data);
        
        // Display success notification
        // You can implement a toast notification here
      } catch (err) {
        console.error(`Error ${actionType === 'approve' ? 'approving' : 'declining'} project:`, err);
        // Display error notification
        setError(`Failed to ${actionType} project. Please try again.`);
      } finally {
        setLoading(false);
        setConfirmDialogOpen(false);
        setDetailsOpen(false);
      }
    };

    updateProjectRequest();
    */
  };

  const handleCancelAction = () => {
    setConfirmDialogOpen(false);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Project Requests
      </Typography>
      
      {projectRequests.length === 0 ? (
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
            <Grid item xs={12} md={6} lg={4} key={project.id}>
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
                      {project.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {project.description}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2">Client: {project.clientName}</Typography>
                      <Typography variant="body2">Budget: {project.budget}</Typography>
                    </Box>
                    <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                      Request Date: {project.requestDate}
                    </Typography>
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
                {selectedProject.title}
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" paragraph>
                  {selectedProject.description}
                </Typography>
              </Box>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Client
                    </Typography>
                    <Typography variant="body1">
                      {selectedProject.clientName}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Request Date
                    </Typography>
                    <Typography variant="body1">
                      {selectedProject.requestDate}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Budget
                    </Typography>
                    <Typography variant="body1">
                      {selectedProject.budget}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Estimated Duration
                    </Typography>
                    <Typography variant="body1">
                      {selectedProject.duration}
                    </Typography>
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