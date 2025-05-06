// src/layouts/RootLayout.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider,
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Paper,
  Badge,
  Collapse,
  Menu,
  MenuItem,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List as MuiList,
  ListItemButton,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  Home, 
  Compass, 
  Settings, 
  LogOut, 
  Building,
  Search,
  Bell,
  User,
  ChevronDown,
  ChevronRight,
  Users as UsersIcon,
  FileText as FileTextIcon,
  Plus as PlusIcon,       // Rename import to PlusIcon
  ChevronUp as ChevronUpIcon,   // Rename import to ChevronUpIcon
  HelpCircle as HelpCircleIcon,   // Rename import to HelpCircleIcon  
  ActivityIcon as AnalyticsIcon,
  Shield as ShieldIcon,  // Add this for admin icon
  Mail as MailIcon,  // Add this import for invitation icon
} from 'lucide-react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { styled, alpha } from '@mui/material/styles';
import { Menu as MenuIcon } from 'lucide-react';
import { Tooltip } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import UserInvitationService from '../services/UserInvitationService';

const DRAWER_WIDTH = 240;
const MINI_DRAWER_WIDTH = 65;

const RootLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [companiesOpen, setCompaniesOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openCompanyId, setOpenCompanyId] = useState(null);
  const [addMenuAnchorEl, setAddMenuAnchorEl] = useState(null);  // Add this line
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(false);
  const { user, logout, updateUser } = useAuth();
  
  const isAdmin = user?.email === "admin@admin.com";  // Check if user is admin
  console.log('Is Admin:', isAdmin);

  // Sample companies data
  const companies = user?.companies || [];

  const [invitationsDialogOpen, setInvitationsDialogOpen] = useState(false);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [respondedInvitations, setRespondedInvitations] = useState({}); // Add this state variable

  const toggleDrawer = () => {
    setIsDrawerCollapsed(!isDrawerCollapsed);
  };

  const handleCompanyClick = (companyId) => {
    if (openCompanyId === companyId) {
      setOpenCompanyId(null);
    } else {
      setOpenCompanyId(companyId);
    }
  };

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
    handleUserMenuClose();
    navigate('/login');
  };

  const handleSettingsClick = () => {
    handleUserMenuClose();
    navigate('/settings');
  };

  const handleUserProfileClick = () => {
    handleUserMenuClose();
    navigate('/profile/' + user.userName);
  };
  
  const handleAddMenuOpen = (event) => {
    setAddMenuAnchorEl(event.currentTarget);
  };

  const handleAddMenuClose = () => {
    setAddMenuAnchorEl(null);
  };

  const handleCreateCompany = () => {
    navigate('/create-company');
    handleAddMenuClose();
  };

  const handleCreateProject = () => {
    navigate('/create-project');
    handleAddMenuClose();
  };

  const handleGetPremium = () => {
    navigate('/premium');
    handleAddMenuClose();
  };

  const handleSupport = () => {
    navigate('/support');
    handleAddMenuClose();
  };

  const handleViewInvitations = async () => {
    handleAddMenuClose();
    setInvitationsDialogOpen(true);
    await fetchInvitations();
  };
  
  const fetchInvitations = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const data = await UserInvitationService.getMyInvitations(token);
      setInvitations(data);
    } catch (err) {
      setError(err.message || 'Failed to load invitations');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAcceptInvitation = async (invitationId, companyName, companyId) => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      // Fix: Send invitationId as an object property, not a raw string
      await UserInvitationService.acceptInvitation(invitationId, token);
      
      // Update the responded invitations map with accept status
      setRespondedInvitations(prev => ({
        ...prev,
        [invitationId]: { 
          status: 'accepted', 
          companyName 
        }
      }));
      
    // Instead of fetching the updated profile, we'll update the user object directly
    // by adding the new company to the companies list
    if (user && user.companies) {
      // Create a new company object from the invitation data
      const newCompany = {
        companyId: companyId, // Use response companyId if available
        companyName: companyName
      };
      
      // Create a new companies array with the new company added
      const updatedCompanies = [...user.companies, newCompany];
      
      // Create updated user object with the new companies list
      const updatedUser = {
        ...user,
        companies: updatedCompanies
      };
      
      // Update the user context with the new data
      updateUser(updatedUser);
    }
      setSuccessMessage(`Invitation from ${companyName} accepted successfully!`);
      setSnackbarOpen(true);
    } catch (err) {
      setError(err.message || 'Failed to accept invitation');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };
  
  const handleRejectInvitation = async (invitationId, companyName) => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      // Fix: Send invitationId as an object property, not a raw string
      await UserInvitationService.rejectInvitation(invitationId, token);
      
      // Update the responded invitations map with reject status
      setRespondedInvitations(prev => ({
        ...prev,
        [invitationId]: { 
          status: 'rejected', 
          companyName 
        }
      }));
      
      setSuccessMessage(`Invitation from ${companyName} rejected.`);
      setSnackbarOpen(true);
    } catch (err) {
      setError(err.message || 'Failed to reject invitation');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* AppBar */}
      <AppBar 
        position="fixed" 
        color="default" 
        elevation={0}
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper'
        }}
      >
        <Toolbar>
          {/* Menu Icon and Logo */}
            <IconButton 
            edge="start" 
            onClick={toggleDrawer} 
            sx={{ mr: 2 }}
            >
            <MenuIcon />
            </IconButton>

            <Box sx={{ flexGrow: 1 }} />

            <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              justifyContent: 'center',
              flexGrow: 1
            }}
            onClick={() => navigate('/home')}
            >
            <Building size={24} />
            <Typography variant="h6">
              COMPEDIA
            </Typography>
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            {/* New Add Menu */}
          <IconButton 
            sx={{ ml: 1 }}
            onClick={handleAddMenuOpen}
          >
            <PlusIcon />
          </IconButton>
          <Menu
            anchorEl={addMenuAnchorEl}
            open={Boolean(addMenuAnchorEl)}
            onClose={handleAddMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
          <MenuItem onClick={handleCreateCompany}>
            <ListItemIcon>
              <Building size={18} />
            </ListItemIcon>
            <Typography variant="inherit">Add Company</Typography>
          </MenuItem>
          <MenuItem onClick={handleCreateProject}>
            <ListItemIcon>
              <FileTextIcon size={18} />
            </ListItemIcon>
            <Typography variant="inherit">Add Project</Typography>
          </MenuItem>
          {/* New menu item for company invitations */}
          <MenuItem onClick={handleViewInvitations}>
            <ListItemIcon>
              <MailIcon size={18} />
            </ListItemIcon>
            <Typography variant="inherit">Company Invitations</Typography>
          </MenuItem>
          <MenuItem onClick={handleGetPremium}>
            <ListItemIcon>
              <ChevronUpIcon size={18} />
            </ListItemIcon>
            <Typography variant="inherit">Get Premium</Typography>
          </MenuItem>
          <MenuItem onClick={handleSupport}>
            <ListItemIcon>
              <HelpCircleIcon size={18} />
            </ListItemIcon>
            <Typography variant="inherit">Support</Typography>
          </MenuItem>
          </Menu>



          {/* Notification and User Menu */}
          <IconButton>
            <Badge badgeContent={4} color="error">
              <Bell />
            </Badge>
          </IconButton>
          <IconButton 
            sx={{ ml: 1 }}
            onClick={handleUserMenuOpen}
          >
            <User />
          </IconButton>

          {/* User Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleUserMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleUserProfileClick}>
              <ListItemIcon>
                <User size={18} />
              </ListItemIcon>
              <Typography variant="inherit">Profile</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleSettingsClick}>
              <ListItemIcon>
                <Settings size={18} />
              </ListItemIcon>
              <Typography variant="inherit">Settings</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogOut size={18} />
              </ListItemIcon>
              <Typography variant="inherit">Logout</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: isDrawerCollapsed ? MINI_DRAWER_WIDTH : DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: isDrawerCollapsed ? MINI_DRAWER_WIDTH : DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'divider',
            position: 'relative',
            transition: 'width 0.2s ease',
            overflowX: 'hidden',
          },
        }}
      >

        {/* Main navigation list */}
        <List sx={{ flex: 1, pt: '64px' }}>
          {/* Homepage */}
          <Tooltip title={isDrawerCollapsed ? "Homepage" : ""} placement="right">
            <ListItem 
              button="true"
              onClick={() => navigate('/home')}
              selected={location.pathname === '/home'}
              sx={{ 
                minHeight: 48,
                px: 2.5,
                cursor: 'pointer',
                justifyContent: isDrawerCollapsed ? 'center' : 'initial'
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: 0, 
                mr: isDrawerCollapsed ? 0 : 2,
                justifyContent: 'center'
              }}>
                <Home />
              </ListItemIcon>
              {!isDrawerCollapsed && <ListItemText primary="Homepage" />}
            </ListItem>
          </Tooltip>

          {/* Discover */}
          <Tooltip title={isDrawerCollapsed ? "Discover" : ""} placement="right">
            <ListItem 
              button="true"
              onClick={() => navigate('/discover')}
              selected={location.pathname === '/discover'}
              sx={{ 
                minHeight: 48,
                px: 2.5,
                cursor: 'pointer',
                justifyContent: isDrawerCollapsed ? 'center' : 'initial'
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: 0, 
                mr: isDrawerCollapsed ? 0 : 2,
                justifyContent: 'center'
              }}>
                <Compass />
              </ListItemIcon>
              {!isDrawerCollapsed && <ListItemText primary="Discover" />}
            </ListItem>
          </Tooltip>
          
          {/* Admin Dashboard - Only shown if user is admin */}
          {isAdmin && (
            <Tooltip title={isDrawerCollapsed ? "Admin Dashboard" : ""} placement="right">
              <ListItem 
                button="true"
                onClick={() => navigate('/admin')}
                selected={location.pathname.startsWith('/admin')}
                sx={{ 
                  minHeight: 48,
                  px: 2.5,
                  cursor: 'pointer',
                  justifyContent: isDrawerCollapsed ? 'center' : 'initial'
                }}
              >
                <ListItemIcon sx={{ 
                  minWidth: 0, 
                  mr: isDrawerCollapsed ? 0 : 2,
                  justifyContent: 'center'
                }}>
                  <ShieldIcon />
                </ListItemIcon>
                {!isDrawerCollapsed && <ListItemText primary="Admin Dashboard" />}
              </ListItem>
            </Tooltip>
          )}

          {/* Companies section */}
          <Tooltip title={isDrawerCollapsed ? "My Companies" : ""} placement="right">
            <ListItem 
              button="true"
              onClick={() => setCompaniesOpen(!companiesOpen)}
              sx={{ 
                minHeight: 48,
                px: 2.5,
                cursor: 'pointer',
                justifyContent: isDrawerCollapsed ? 'center' : 'initial'
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: 0, 
                mr: isDrawerCollapsed ? 0 : 2,
                justifyContent: 'center'
              }}>
                <Building size={20} />
              </ListItemIcon>
              {!isDrawerCollapsed && (
                <>
                  <ListItemText primary="My Companies" />
                  {companiesOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </>
              )}
            </ListItem>
          </Tooltip>
          
          <Collapse in={companiesOpen && !isDrawerCollapsed} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {companies.map((company) => (
                <React.Fragment key={company.companyId}>
                  <ListItem
                    button
                    onClick={() => handleCompanyClick(company.companyId)}
                    sx={{ 
                      pl: 4,
                      py: 0.5,
                      cursor: 'pointer'
                    }}
                  >
                    <ListItemIcon>
                      <Building size={18} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={company.companyName}
                      primaryTypographyProps={{ 
                        fontSize: '0.9rem',
                        color: 'text.secondary'
                      }}
                    />
                    {openCompanyId === company.companyId ? 
                      <ChevronDown size={16} /> : 
                      <ChevronRight size={16} />
                    }
                  </ListItem>
                  
                  <Collapse in={openCompanyId === company.companyId} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      <ListItem
                        button
                        onClick={() => navigate(`/company/${company.companyName.replace(/\s+/g, '')}`)}
                        sx={{ 
                          pl: 6,
                          py: 0.5,
                          cursor: 'pointer'
                        }}
                      >
                        <ListItemIcon>
                          <FileTextIcon size={16} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Profile"
                          primaryTypographyProps={{ 
                            fontSize: '0.85rem',
                            color: 'text.secondary'
                          }}
                        />
                      </ListItem>

                      <ListItem
                        button
                        onClick={() => navigate(`/company/people/${company.companyName.replace(/\s+/g, '')}`)}
                        sx={{ 
                          pl: 6,
                          py: 0.5,
                          cursor: 'pointer'
                        }}
                      >
                        <ListItemIcon>
                          <UsersIcon size={16} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="People"
                          primaryTypographyProps={{ 
                            fontSize: '0.85rem',
                            color: 'text.secondary'
                          }}
                        />
                      </ListItem>

                      <ListItem
                        button
                        onClick={() => navigate(`/company/projects/${company.companyName.replace(/\s+/g, '')}`)}
                        sx={{ 
                          pl: 6,
                          py: 0.5,
                          cursor: 'pointer'
                        }}
                      >
                        <ListItemIcon>
                          <FileTextIcon size={16} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Projects"
                          primaryTypographyProps={{ 
                            fontSize: '0.85rem',
                            color: 'text.secondary'
                          }}
                        />
                      </ListItem>
                      <ListItem
                        button
                        onClick={() => navigate(`/company/analytics/${company.companyName.replace(/\s+/g, '')}`)}
                        sx={{ 
                          pl: 6,
                          py: 0.5,
                          cursor: 'pointer'
                        }}
                      >
                        <ListItemIcon>
                          <AnalyticsIcon size={16} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Analytics"
                          primaryTypographyProps={{ 
                            fontSize: '0.85rem',
                            color: 'text.secondary'
                          }}
                        />
                      </ListItem>
                    </List>
                  </Collapse>
                </React.Fragment>
              ))}
            </List>
          </Collapse>
        </List>
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          bgcolor: 'background.default',
          height: '100%',
          pt: '64px', // Add padding-top for app bar
        }}
      >
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>

      {/* New: Company Invitations Dialog */}
      <Dialog
        open={invitationsDialogOpen}
        onClose={() => setInvitationsDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Company Invitations</DialogTitle>
        <DialogContent>
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress />
            </Box>
          )}
          
          {invitations.length === 0 && !loading && Object.keys(respondedInvitations).length === 0 ? (
            <Typography variant="body1" align="center" sx={{ py: 3 }}>
              No invitations found.
            </Typography>
          ) : (
            <MuiList>
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
                        disabled={loading}
                        onClick={() => handleRejectInvitation(invitation.invitationId, invitation.companyName)}
                      >
                        Reject
                      </Button>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        size="small"
                        disabled={loading}
                        onClick={() => handleAcceptInvitation(invitation.invitationId, invitation.companyName, invitation.companyId)}
                      >
                        Accept
                      </Button>
                    </Box>
                  </ListItemButton>
                );
              })}
              
              {/* Show message when all invitations have been responded to */}
              {invitations.length === 0 && Object.keys(respondedInvitations).length > 0 && !loading && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    You have responded to all invitations.
                  </Typography>
                </Box>
              )}
            </MuiList>
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

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={error ? "error" : "success"} 
          sx={{ width: '100%' }}
        >
          {error || successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RootLayout;