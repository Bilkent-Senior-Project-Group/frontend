import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Toolbar,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';

import {
  Building,
  Home,
  Compass,
  Search,
  MapPin,
  Menu as MenuIcon
} from 'lucide-react';

export default function FakeHomepage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const DRAWER_WIDTH = 240;
  const MINI_DRAWER_WIDTH = 72;
  
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  
  const redirectToLogin = () => {
    alert("Redirecting to login/signup page");
    // In a real implementation, you would use navigation here
    // navigate('/login');
  };

  // New function to reset to homepage view
  const goToHomepage = () => {
    setShowSearchResults(false);
    setShowLoginPrompt(false);
    setSearchQuery('');
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchResults(true);
      setTimeout(() => {
        setShowLoginPrompt(true);
      }, 1500);
    }
  };
  
  // Fake company data for search results
  const fakeCompanies = [
    {
      CompanyId: 1,
      Name: "Tech Innovations Inc.",
      Location: "San Francisco, USA",
      Services: ["Software Development", "Cloud Solutions", "AI Implementation"],
      Distance: 1.7
    },
    {
      CompanyId: 2,
      Name: "Global Marketing Partners",
      Location: "New York, USA",
      Services: ["Digital Marketing", "Brand Strategy", "Social Media"],
      Distance: 1.5
    },
    {
      CompanyId: 3,
      Name: "EcoSolutions Group",
      Location: "Berlin, Germany",
      Services: ["Renewable Energy", "Sustainability Consulting", "Green Tech"],
      Distance: 1.3
    }
  ];
  
  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* AppBar */}
      <AppBar 
        position="fixed" 
        color="default" 
        elevation={0}
        sx={{ 
          zIndex: theme => theme.zIndex.drawer + 1,
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
            onClick={goToHomepage} // Added onClick handler here
          >
            <Building size={24} />
            <Typography variant="h6">
              COMPEDIA       
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Login/Signup Button */}
          <Button 
            variant="contained" 
            color="primary"
            onClick={redirectToLogin}
            sx={{ ml: 2 }}
          >
            Login / Sign up
          </Button>
        </Toolbar>
      </AppBar>

      {/* Sidebar - Set to temporary drawer that's closed by default */}
      <Drawer
        variant="temporary"
        open={isDrawerOpen}
        onClose={toggleDrawer}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'divider',
            position: 'relative',
            borderRadius: 0,
          },
        }}
      >
        {/* Main navigation list */}
        <List sx={{ flex: 1, pt: '64px' }}>
          {/* Homepage */}
          <ListItem 
            button 
            onClick={goToHomepage} // Changed from redirectToLogin to goToHomepage
            sx={{ 
              minHeight: 48,
              px: 2.5,
              cursor: 'pointer',
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: 2, justifyContent: 'center' }}>
              <Home />
            </ListItemIcon>
            <ListItemText primary="Homepage" />
          </ListItem>

          {/* Discover */}
          <ListItem 
            button 
            onClick={redirectToLogin}
            sx={{ 
              minHeight: 48,
              px: 2.5,
              cursor: 'pointer',
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: 2, justifyContent: 'center' }}>
              <Compass />
            </ListItemIcon>
            <ListItemText primary="Discover" />
          </ListItem>

          {/* Companies section - empty placeholder */}
          <ListItem 
            button 
            onClick={redirectToLogin}
            sx={{ 
              minHeight: 48,
              px: 2.5,
              cursor: 'pointer',
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: 2, justifyContent: 'center' }}>
              <Building size={20} />
            </ListItemIcon>
            <ListItemText primary="My Companies" />
          </ListItem>
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
          pt: '64px',
        }}
      >
        {!showSearchResults ? (
          // Homepage content
          <Box>
            <Box 
              sx={{ 
                backgroundColor: theme => theme.palette.mode === 'light' ? '#f5f5f5' : '#333',
                py: 8,
                borderBottom: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Container maxWidth="md">
                <Typography 
                  variant="h3" 
                  sx={{ 
                    mb: 3, 
                    fontWeight: 700,
                    textAlign: 'center' 
                  }}
                >
                  Find and Connect with Companies
                </Typography>
                <Typography 
                  variant="h6" 
                  color="text.secondary" 
                  sx={{ 
                    mb: 5,
                    textAlign: 'center' 
                  }}
                >
                  Discover, research, and connect with businesses from around the world
                </Typography>
                
                <Paper
                  component="form"
                  onSubmit={handleSearch}
                  elevation={2}
                  sx={{
                    p: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    maxWidth: 600,
                    mx: 'auto',
                    mb: 2
                  }}
                >
                  <TextField
                    fullWidth
                    placeholder="Search for companies, industries, or services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { border: 'none' },
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button 
                    variant="contained" 
                    size="large"
                    type="submit"
                    sx={{
                      px: 4,
                      py: 1.5,
                    }}
                  >
                    Search
                  </Button>
                </Paper>
              </Container>
            </Box>
            
            <Container maxWidth="lg" sx={{ py: 6 }}>
              <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
                Explore Companies
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card 
                    elevation={1}
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      height: '100%',
                      borderRadius: 2,
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 3
                      }
                    }}
                    onClick={redirectToLogin}
                  >
                    <Box sx={{ 
                      bgcolor: 'primary.light', 
                      color: 'primary.contrastText',
                      p: 2,
                      borderRadius: 1,
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Building size={40} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      Create a Company
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Add your business to our platform and connect with potential clients and partners worldwide.
                    </Typography>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Card 
                    elevation={1}
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      height: '100%',
                      borderRadius: 2,
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 3
                      }
                    }}
                    onClick={redirectToLogin}
                  >
                    <Box sx={{ 
                      bgcolor: 'secondary.light', 
                      color: 'secondary.contrastText',
                      p: 2,
                      borderRadius: 1,
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Compass size={40} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      Discover Companies
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Find businesses that match your needs with our advanced search and filtering capabilities.
                    </Typography>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Card 
                    elevation={1}
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      height: '100%',
                      borderRadius: 2,
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 3
                      }
                    }}
                    onClick={redirectToLogin}
                  >
                    <Box sx={{ 
                      bgcolor: 'success.light', 
                      color: 'success.contrastText',
                      p: 2,
                      borderRadius: 1,
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <MapPin size={40} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      Browse by Location
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Explore businesses by location and connect with companies in your area or around the world.
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </Container>
          </Box>
        ) : (
          // Search results page
          <Box>
            <Box sx={{ 
              backgroundColor: theme => theme.palette.grey[100],
              py: 4,
              borderBottom: `1px solid ${theme => theme.palette.divider}`
            }}>
              <Container maxWidth="lg">
                <Paper
                  component="form"
                  onSubmit={handleSearch}
                  elevation={1}
                  sx={{
                    p: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    maxWidth: 600,
                    mx: 'auto',
                    mb: 2
                  }}
                >
                  <TextField
                    fullWidth
                    placeholder="What are you looking for?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { border: 'none' },
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button 
                    variant="contained" 
                    size="large"
                    type="submit"
                    sx={{
                      px: 4,
                      py: 1.5,
                    }}
                  >
                    Search
                  </Button>
                </Paper>
              </Container>
            </Box>

            <Container maxWidth="lg" sx={{ py: 4 }}>
              <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
                Top Companies for "{searchQuery}"
              </Typography>

              {/* Results */}
              <Box>
                {fakeCompanies.map((company) => (
                  <Card
                    key={company.CompanyId}
                    elevation={1}
                    sx={{
                      mb: 3,
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      cursor: 'pointer',
                      transition: 'transform 0.1s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.01)',
                        boxShadow: 3,
                      },
                    }}
                    onClick={redirectToLogin}
                  >
                    <CardContent>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={9}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {company.Name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            <MapPin size={14} style={{ marginRight: 4, verticalAlign: 'text-bottom' }} />
                            {company.Location}
                          </Typography>
                    
                          {/* Services Display */}
                          {company.Services && company.Services.length > 0 && (
                            <Box sx={{ mb: 2 }}>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {company.Services.map((service) => (
                                  <Chip 
                                    key={service} 
                                    label={service} 
                                    size="small"
                                    sx={{ 
                                      bgcolor: 'primary.50',
                                      color: 'primary.700',
                                      fontWeight: 500,
                                      borderRadius: '16px',
                                    }}
                                  />
                                ))}
                              </Box>
                            </Box>
                          )}
                        </Grid>
                    
                        <Grid item xs={12} md={3} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                          <Box sx={{ display: 'inline-block', backgroundColor: 'primary.50', px: 2, py: 1, borderRadius: 2 }}>
                            <Typography variant="caption" sx={{ color: 'primary.800', fontWeight: 500 }}>
                              Match Score
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                              {Math.round((company.Distance / 2) * 100)}%
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
                
                {/* "Show More" button that redirects to login */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Button 
                    variant="outlined" 
                    size="large" 
                    onClick={redirectToLogin}
                    sx={{ px: 4 }}
                  >
                    Show More Results
                  </Button>
                </Box>
              </Box>
            </Container>
          </Box>
        )}
      </Box>
      
      {/* Login Prompt Dialog */}
      <Dialog
        open={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        aria-labelledby="login-prompt-dialog"
      >
        <DialogTitle id="login-prompt-dialog">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Building size={20} />
            <Typography variant="h6">Create an Account</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Sign up or login to view more details about these companies, save searches, 
            and connect with businesses around the world.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLoginPrompt(false)}>
            Later
          </Button>
          <Button 
            variant="contained" 
            onClick={redirectToLogin} 
            autoFocus
          >
            Login / Sign Up
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}