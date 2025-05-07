import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider, 
  Button, 
  Alert, 
  CircularProgress,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  IconButton,
  Link,
  Collapse,
  List,
  ListItemButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import UserService from '../../services/UserService';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import MailIcon from '@mui/icons-material/Mail';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import UserInvitationService from '../../services/UserInvitationService';
import { alpha } from '@mui/material/styles';

const SettingsPage = () => {
  const { user, token, updateUser } = useAuth();
  const [isEmailVerified, setIsEmailVerified] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success', 'error', or null
  const [statusMessage, setStatusMessage] = useState('');
  const navigate = useNavigate();
  
  // Password change state
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState(null);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  // Company invitations state
  const [invitations, setInvitations] = useState([]);
  const [invitationsLoading, setInvitationsLoading] = useState(false);
  const [invitationsError, setInvitationsError] = useState('');
  const [respondedInvitations, setRespondedInvitations] = useState({});
  const [invitationSuccess, setInvitationSuccess] = useState('');
  const [invitationsDialogOpen, setInvitationsDialogOpen] = useState(false);

  useEffect(() => {
    const checkEmailVerification = async () => {
      if (!token) return;
      
      try {
        const response = await UserService.checkEmailVerification(token);
        setIsEmailVerified(response.emailConfirmed);
      } catch (error) {
        console.error('Error checking email verification:', error);
      }
    };

    checkEmailVerification();
  }, [token]);

  // Keep the event listener for email verification updates
  useEffect(() => {
    const handleEmailVerified = () => {
      // Update the UI when email is verified
      setIsEmailVerified(true);
      setStatus('success');
      setStatusMessage('Your email has been verified successfully!');
    };
    
    window.addEventListener('emailVerified', handleEmailVerified);
    
    return () => {
      window.removeEventListener('emailVerified', handleEmailVerified);
    };
  }, []);

  const handleResendVerificationEmail = async () => {
    setIsLoading(true);
    setStatus(null);
    
    try {
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // No returnUrl parameter
      await UserService.sendConfirmationEmail(token);
      
      setStatus('success');
      setStatusMessage('Verification email has been sent successfully! Please check your inbox.');
    } catch (error) {
      console.error('Failed to resend verification email:', error);
      setStatus('error');
      setStatusMessage('Failed to send verification email. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordSection = () => {
    setShowPasswordSection(!showPasswordSection);
    // Reset form when toggling
    if (!showPasswordSection) {
      resetPasswordForm();
    }
  };

  const resetPasswordForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordStatus(null);
    setIsPasswordLoading(true);

    // Validate passwords
    if (newPassword.length < 8) {
      setPasswordStatus('error');
      setPasswordMessage('New password must be at least 8 characters long');
      setIsPasswordLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordStatus('error');
      setPasswordMessage('New passwords do not match');
      setIsPasswordLoading(false);
      return;
    }

    try {
      await UserService.changePassword(currentPassword, newPassword, token);
      setPasswordStatus('success');
      setPasswordMessage('Password changed successfully!');
      // Reset only the form fields after successful change, but keep the success message
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordStatus('error');
      setPasswordMessage(error.message || 'Failed to change password. Please check your current password and try again.');
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  // Company invitations functions
  const fetchInvitations = async () => {
    setInvitationsLoading(true);
    setInvitationsError('');
    try {
      const data = await UserInvitationService.getMyInvitations(token);
      setInvitations(data);
    } catch (err) {
      setInvitationsError(err.message || 'Failed to load invitations');
    } finally {
      setInvitationsLoading(false);
    }
  };

  const handleOpenInvitationsDialog = async () => {
    setInvitationsDialogOpen(true);
    await fetchInvitations();
  };

  const handleAcceptInvitation = async (invitationId, companyName, companyId) => {
    setInvitationsLoading(true);
    setInvitationsError('');
    try {
      await UserInvitationService.acceptInvitation({ invitationId }, token);
      
      // Update the responded invitations map with accept status
      setRespondedInvitations(prev => ({
        ...prev,
        [invitationId]: { 
          status: 'accepted', 
          companyName 
        }
      }));
      
      // Update the user object directly by adding the new company
      if (user && user.companies) {
        const newCompany = {
          companyId: companyId,
          companyName: companyName
        };
        
        const updatedCompanies = [...user.companies, newCompany];
        const updatedUser = {
          ...user,
          companies: updatedCompanies
        };
        
        updateUser(updatedUser);
      }
      
      setInvitationSuccess(`Invitation from ${companyName} accepted successfully!`);
    } catch (err) {
      setInvitationsError(err.message || 'Failed to accept invitation');
    } finally {
      setInvitationsLoading(false);
    }
  };

  const handleRejectInvitation = async (invitationId, companyName) => {
    setInvitationsLoading(true);
    setInvitationsError('');
    try {
      await UserInvitationService.rejectInvitation({ invitationId }, token);
      
      // Update the responded invitations map with reject status
      setRespondedInvitations(prev => ({
        ...prev,
        [invitationId]: { 
          status: 'rejected', 
          companyName 
        }
      }));
      
      setInvitationSuccess(`Invitation from ${companyName} rejected.`);
    } catch (err) {
      setInvitationsError(err.message || 'Failed to reject invitation');
    } finally {
      setInvitationsLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Account Settings
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Profile Information
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body1">
              <strong>Name:</strong> {user?.firstName} {user?.lastName}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body1">
              <strong>Username:</strong> {user?.userName}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body1">
              <strong>Email:</strong> {user?.email}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {isEmailVerified ? (
              <MarkEmailReadIcon color="success" sx={{ mr: 1 }} />
            ) : (
              <EmailIcon color="warning" sx={{ mr: 1 }} />
            )}
            <Typography variant="h6">
              Email Verification
            </Typography>
          </Box>
          
          <Divider sx={{ mb: 2 }} />
          
          {isEmailVerified ? (
            <Alert severity="success" sx={{ mb: 2 }}>
              Your email address has been successfully verified.
            </Alert>
          ) : (
            <>
              <Alert severity="warning" sx={{ mb: 2 }}>
                Your email address is not verified. Some features may be limited until you verify your email.
              </Alert>
              
              <Button
                variant="contained"
                color="primary"
                onClick={handleResendVerificationEmail}
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <EmailIcon />}
              >
                {isLoading ? 'Sending...' : 'Resend Verification Email'}
              </Button>
              
              {status === 'success' && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  {statusMessage}
                </Alert>
              )}
              
              {status === 'error' && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {statusMessage}
                </Alert>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LockIcon sx={{ mr: 1 }} />
            <Typography variant="h6">
              Password Settings
            </Typography>
          </Box>
          
          <Divider sx={{ mb: 2 }} />

          <Button
            variant="outlined"
            color="primary"
            onClick={togglePasswordSection}
            sx={{ mb: 2 }}
          >
            {showPasswordSection ? 'Hide Password Change Form' : 'Change Password'}
          </Button>

          <Collapse in={showPasswordSection}>
            <Box component="form" onSubmit={handleChangePassword} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                margin="normal"
                label="Current Password"
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        edge="end"
                      >
                        {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={handleForgotPassword}
                sx={{ display: 'block', mb: 2, textAlign: 'right' }}
              >
                Forgot current password?
              </Link>

              <TextField
                fullWidth
                margin="normal"
                label="New Password"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        edge="end"
                      >
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Confirm New Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2, mb: 2 }}
                disabled={isPasswordLoading}
                startIcon={isPasswordLoading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isPasswordLoading ? 'Updating...' : 'Update Password'}
              </Button>
              
              {passwordStatus === 'success' && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  {passwordMessage}
                </Alert>
              )}
              
              {passwordStatus === 'error' && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {passwordMessage}
                </Alert>
              )}
            </Box>
          </Collapse>
        </CardContent>
      </Card>
      
      {/* Company Invitations Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <MailIcon sx={{ mr: 1 }} />
            <Typography variant="h6">
              Company Invitations
            </Typography>
          </Box>
          
          <Divider sx={{ mb: 2 }} />
          
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenInvitationsDialog}
            startIcon={<MailIcon />}
          >
            View Company Invitations
          </Button>
          
          {invitationSuccess && (
            <Alert severity="success" sx={{ mt: 2 }} onClose={() => setInvitationSuccess('')}>
              {invitationSuccess}
            </Alert>
          )}
          
          {invitationsError && (
            <Alert severity="error" sx={{ mt: 2 }} onClose={() => setInvitationsError('')}>
              {invitationsError}
            </Alert>
          )}
          
          {/* Company Invitations Dialog */}
          <Dialog
            open={invitationsDialogOpen}
            onClose={() => setInvitationsDialogOpen(false)}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle>Company Invitations</DialogTitle>
            <DialogContent>
              {invitationsLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                  <CircularProgress />
                </Box>
              )}
              
              {invitations.length === 0 && !invitationsLoading && Object.keys(respondedInvitations).length === 0 ? (
                <Typography variant="body1" align="center" sx={{ py: 3 }}>
                  No invitations found.
                </Typography>
              ) : (
                <List>
                  {invitations.map((invitation) => {
                    const responded = respondedInvitations[invitation.invitationId];
                    
                    if (responded) {
                      return (
                        <Box 
                          key={invitation.invitationId} 
                          sx={{ 
                            p: 2, 
                            my: 1, 
                            border: '1px solid',
                            borderColor: responded.status === 'accepted' ? 'success.light' : 'error.light',
                            borderRadius: 1,
                            bgcolor: responded.status === 'accepted' ? alpha('#4caf50', 0.1) : alpha('#f44336', 0.1)
                          }}
                        >
                          <Typography variant="body1">
                            You have {responded.status} the invitation from <strong>{responded.companyName}</strong>
                          </Typography>
                        </Box>
                      );
                    }
                    
                    return (
                      <ListItemButton 
                        key={invitation.invitationId} 
                        divider 
                        sx={{ flexDirection: 'column', alignItems: 'flex-start' }}
                      >
                        <Typography variant="subtitle1" sx={{ width: '100%', fontWeight: 'bold' }}>
                          {invitation.companyName}
                        </Typography>
                        <Typography variant="caption" sx={{ mb: 1 }}>
                          Sent on {new Date(invitation.sentAt).toLocaleString()}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, width: '100%', mt: 1 }}>
                          <Button 
                            variant="outlined" 
                            color="error" 
                            size="small"
                            disabled={invitationsLoading}
                            onClick={() => handleRejectInvitation(invitation.invitationId, invitation.companyName)}
                          >
                            Reject
                          </Button>
                          <Button 
                            variant="contained" 
                            color="primary" 
                            size="small"
                            disabled={invitationsLoading}
                            onClick={() => handleAcceptInvitation(invitation.invitationId, invitation.companyName, invitation.companyId)}
                          >
                            Accept
                          </Button>
                        </Box>
                      </ListItemButton>
                    );
                  })}
                  
                  {/* Show message when all invitations have been responded to */}
                  {invitations.length === 0 && Object.keys(respondedInvitations).length > 0 && !invitationsLoading && (
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                      <Typography variant="body1" color="text.secondary">
                        You have responded to all invitations.
                      </Typography>
                    </Box>
                  )}
                </List>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => {
                setInvitationsDialogOpen(false);
                // Clear responded invitations when closing dialog
                if (Object.keys(respondedInvitations).length > 0) {
                  setInvitations(prev => prev.filter(inv => !respondedInvitations[inv.invitationId]));
                  setRespondedInvitations({});
                }
              }}>
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SettingsPage;