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
  FileText as FileTextIcon
} from 'lucide-react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { styled, alpha } from '@mui/material/styles';

const DRAWER_WIDTH = 240;

const RootLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [companiesOpen, setCompaniesOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openCompanyId, setOpenCompanyId] = useState(null);

  // Sample companies data
  const companies = [
    { id: 1, name: "Company 1" },
    { id: 2, name: "Company 2" },
    { id: 3, name: "Company 3" }
  ];

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

  const handleLogout = () => {
    handleUserMenuClose();
    navigate('/login');
  };

  const handleSettingsClick = () => {
    handleUserMenuClose();
    navigate('/settings');
  };
  

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Drawer
        variant="permanent"
        sx={{
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'divider',
            position: 'relative',
          },
        }}
      >
        {/* Logo section */}
        <Box sx={{ p: 2 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              cursor: 'pointer'
            }}
            onClick={() => navigate('/home')}
          >
            <Building size={24} />
            <Box sx={{ typography: 'h6' }}>COMPEDIA</Box>
          </Box>
        </Box>
        
        <Divider />

        {/* Main navigation list */}
        <List sx={{ flex: 1 }}>
          {/* Regular menu items */}
          <ListItem 
            button 
            onClick={() => navigate('/home')}
            selected={location.pathname === '/home'}
          >
            <ListItemIcon><Home /></ListItemIcon>
            <ListItemText primary="Homepage" />
          </ListItem>

          <ListItem 
            button 
            onClick={() => navigate('/discover')}
            selected={location.pathname === '/discover'}
          >
            <ListItemIcon><Compass /></ListItemIcon>
            <ListItemText primary="Discover" />
          </ListItem>

          {/* Companies section */}
          <ListItem 
            button 
            onClick={() => setCompaniesOpen(!companiesOpen)}
          >
            <ListItemIcon>
              <Building size={20} />
            </ListItemIcon>
            <ListItemText primary="My Companies" />
            {companiesOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </ListItem>
          
          <Collapse in={companiesOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {companies.map((company) => (
                <React.Fragment key={company.id}>
                  <ListItem
                    button
                    onClick={() => handleCompanyClick(company.id)}
                    sx={{ 
                      pl: 4,
                      py: 0.5,
                    }}
                  >
                    <ListItemIcon>
                      <Building size={18} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={company.name}
                      primaryTypographyProps={{ 
                        fontSize: '0.9rem',
                        color: 'text.secondary'
                      }}
                    />
                    {openCompanyId === company.id ? 
                      <ChevronDown size={16} /> : 
                      <ChevronRight size={16} />
                    }
                  </ListItem>
                  
                  {/* Company submenu */}
                  <Collapse in={openCompanyId === company.id} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      <ListItem
                        button
                        onClick={() => navigate(`/company/${company.id}/profile`)}
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
                        onClick={() => navigate(`/company/${company.id}/people`)}
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