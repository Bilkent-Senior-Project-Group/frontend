// src/layouts/RootLayout.jsx
import React, { useState } from 'react';
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
  Typography
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
  HelpCircle as HelpCircleIcon   // Rename import to HelpCircleIcon  
} from 'lucide-react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { styled, alpha } from '@mui/material/styles';
import { Menu as MenuIcon } from 'lucide-react';
import { Tooltip } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import AuthService from '../services/AuthService';

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
  const { user, logout } = useAuth();

  // Sample companies data
  const companies = user?.companies || [];

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
    const token = localStorage.getItem('token');
    try{
      await AuthService.logout(token);
      console.log('Logged out successfully');
    }
    catch (error) {
      console.error('Error logging out:', error);
    }        
    handleUserMenuClose();
    logout();
    navigate('/login');
  };

  const handleSettingsClick = () => {
    handleUserMenuClose();
    navigate('/settings');
  };
  
  const handleAddMenuOpen = (event) => {
    setAddMenuAnchorEl(event.currentTarget);
  };

  const handleAddMenuClose = () => {
    setAddMenuAnchorEl(null);
  };

  const handleAddCompany = () => {
    navigate('/add-company');
    handleAddMenuClose();
  };

  const handleAddProject = () => {
    navigate('/add-project');
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
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              mr: 3
            }}
            onClick={() => navigate('/home')}
          >
            <Building size={24} />
            <Typography variant="h6">
              COMPEDIA
            </Typography>
          </Box>

          {/* Search Bar */}
          <Paper
            component="form"
            sx={{ 
              p: '2px 4px', 
              display: 'flex', 
              alignItems: 'center', 
              width: 400,
              flexGrow: 0
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Enter some description"
              inputProps={{ 'aria-label': 'search' }}
            />
            <IconButton type="button" sx={{ p: '10px', color: 'success.main' }}>
              <Search />
            </IconButton>
          </Paper>

          <Box sx={{ flexGrow: 1 }} />

          {/* Notification and Add Menu */}
          <IconButton>
            <Badge badgeContent={4} color="error">
              <Bell />
            </Badge>
          </IconButton>

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
          <MenuItem onClick={handleAddCompany}>
            <ListItemIcon>
              <Building size={18} />
            </ListItemIcon>
            <Typography variant="inherit">Add Company</Typography>
          </MenuItem>
          <MenuItem onClick={handleAddProject}>
            <ListItemIcon>
              <FileTextIcon size={18} />
            </ListItemIcon>
            <Typography variant="inherit">Add Project</Typography>
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
            mt: '64px', // Add margin-top to account for AppBar height
          },
        }}
      >

        {/* Main navigation list */}
        <List sx={{ flex: 1 }}>
          {/* Homepage */}
          <Tooltip title={isDrawerCollapsed ? "Homepage" : ""} placement="right">
            <ListItem 
              button 
              onClick={() => navigate('/home')}
              selected={location.pathname === '/home'}
              sx={{ 
                minHeight: 48,
                px: 2.5,
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
              button 
              onClick={() => navigate('/discover')}
              selected={location.pathname === '/discover'}
              sx={{ 
                minHeight: 48,
                px: 2.5,
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

          {/* Companies section */}
          <Tooltip title={isDrawerCollapsed ? "My Companies" : ""} placement="right">
            <ListItem 
              button 
              onClick={() => setCompaniesOpen(!companiesOpen)}
              sx={{ 
                minHeight: 48,
                px: 2.5,
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
                        onClick={() => navigate(`/company/${company.companyName.replace(/\s+/g, '')}/profile`)}
                        sx={{ 
                          pl: 6,
                          py: 0.5,
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
                        onClick={() => navigate(`/company/${company.companyName.replace(/\s+/g, '')}/people`)}
                        sx={{ 
                          pl: 6,
                          py: 0.5,
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
                    </List>
                  </Collapse>
                </React.Fragment>
              ))}
            </List>
          </Collapse>
        </List>
      </Drawer>

      {/* Main content area */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* AppBar */}
        <AppBar 
          position="static" 
          color="default" 
          elevation={0}
          sx={{ 
            borderBottom: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper'
          }}
        >
          <Toolbar>
            <Paper
              component="form"
              sx={{ 
                p: '2px 4px', 
                display: 'flex', 
                alignItems: 'center', 
                width: 400,
                ml: 2
              }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Enter some description"
                inputProps={{ 'aria-label': 'search' }}
              />
              <IconButton type="button" sx={{ p: '10px', color: 'success.main' }}>
                <Search />
              </IconButton>
            </Paper>
            <Box sx={{ flexGrow: 1 }} />
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

        {/* Main content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            bgcolor: 'background.default',
            height: '100%'
          }}
        >
          <Box sx={{ p: 3 }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RootLayout;