import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Avatar, 
  Divider,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar
} from '@mui/material';
import { Email as EmailIcon, Phone as PhoneIcon, Person as PersonIcon, Add as AddIcon } from '@mui/icons-material';
import CompanyService from '../../services/CompanyService';
import UserInvitationService from '../../services/UserInvitationService';
import CompanyProfileDTO from '../../DTO/company/CompanyProfileDTO';

const CompanyPeoplePage = () => {
  const { companyName } = useParams();
  const navigate = useNavigate();
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {token} = useAuth();
  
  const [openInviteDialog, setOpenInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [companyId, setCompanyId] = useState(null);

  const handleViewUserProfile = (userName) => {
    if (userName) {
      navigate(`/profile/${userName}`);
    }
  };

  useEffect(() => {
    const fetchCompanyPeople = async () => {
      try {
        setLoading(true);
        const companyData = await CompanyService.getCompany(companyName, token);
        console.log("Backend Company Data:", companyData);
        const companyProfile = new CompanyProfileDTO(companyData);
        setCompanyId(companyProfile.companyId);
        const data = await CompanyService.getCompanyPeople(companyProfile.companyId, token);
        setPeople(data);
        console.log("Backend Company People Data:", data);
        setError(null);
      } catch (err) {
        console.error('Error fetching company people:', err);
        setError('Failed to load company personnel. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyPeople();
  }, [companyName, token]);

  const handleOpenInviteDialog = () => {
    setOpenInviteDialog(true);
    setInviteEmail('');
    setInviteError(null);
  };

  const handleCloseInviteDialog = () => {
    setOpenInviteDialog(false);
  };

  const handleInviteSubmit = async () => {
    if (!inviteEmail) {
      setInviteError('Email is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
      setInviteError('Please enter a valid email address');
      return;
    }

    try {
      setInviteLoading(true);
      await UserInvitationService.inviteUser(inviteEmail, companyId, token);
      setInviteLoading(false);
      handleCloseInviteDialog();
      setSnackbarMessage('Invitation sent successfully!');
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Error sending invitation:', err);
      setInviteLoading(false);
      setInviteError('Failed to send invitation. Please try again.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 0 }}>
          {companyName} - People
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleOpenInviteDialog}
        >
          Invite User
        </Button>
      </Box>
      
      {people.length === 0 ? (
        <Alert severity="info">No personnel information available for this company.</Alert>
      ) : (
        <Grid container spacing={3}>
          {people.map((person) => (
            <Grid item xs={12} sm={6} md={4} key={person.id}>
              <Card 
                elevation={2} 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                    cursor: 'pointer'
                  }
                }}
                onClick={() => handleViewUserProfile(person.userName)}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar 
                      sx={{ 
                        width: 56, 
                        height: 56, 
                        bgcolor: 'primary.main',
                        mr: 2
                      }}
                      src={person.profilePictureUrl}
                    >
                      {person.firstName && person.lastName 
                        ? person.firstName.charAt(0).toUpperCase() + person.lastName.charAt(0).toUpperCase() 
                        : <PersonIcon />}
                    </Avatar>
                    <Typography variant="h6" component="div">
                      {person.firstName && person.lastName 
                        ? `${person.firstName} ${person.lastName}` 
                        : "No Name Available"}
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 1.5 }} />
                  
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <EmailIcon 
                        sx={{ 
                          mr: 1, 
                          color: 'text.secondary',
                          cursor: person.email ? 'pointer' : 'default' 
                        }} 
                        onClick={(e) => {
                          e.stopPropagation();
                          person.email && window.open(`mailto:${person.email}`)
                        }}
                      />
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          cursor: person.email ? 'pointer' : 'default',
                          textDecoration: 'none',
                          '&:hover': {
                            color: 'text.secondary'
                          }
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          person.email && window.open(`mailto:${person.email}`)
                        }}
                      >
                        {person.email || "Email not available"}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {person.phoneNumber || "Phone number not available"}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Button 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewUserProfile(person.userName);
                      }}
                    >
                      View Profile
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openInviteDialog} onClose={handleCloseInviteDialog}>
        <DialogTitle>Invite User to {companyName}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            error={!!inviteError}
            helperText={inviteError}
            disabled={inviteLoading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInviteDialog} disabled={inviteLoading}>Cancel</Button>
          <Button 
            onClick={handleInviteSubmit} 
            variant="contained" 
            disabled={inviteLoading}
          >
            {inviteLoading ? 'Sending...' : 'Send Invitation'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default CompanyPeoplePage;