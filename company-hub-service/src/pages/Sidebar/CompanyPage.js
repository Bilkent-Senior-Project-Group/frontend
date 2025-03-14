
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
  Rating,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Map, Users, DollarSign, Phone, Mail, Globe, Check, Calendar } from 'lucide-react';
import { colors } from '../../theme/theme';
import CompanyService  from '../../services/CompanyService';


// Mock data for a single company
const mockCompanyDetails = {
  id: 1,
  name: 'Naked Development',
  rating: 4.7,
  reviews: 53,
  priceRange: '$150 - $199 / hr',
  teamSize: '10 - 49',
  location: 'Irvine, CA',
  phone: '+1 (123) 456-7890',
  email: 'contact@nakeddevelopment.com',
  website: 'www.nakeddevelopment.com',
  founded: 2014,
  services: ['Mobile App Development', 'UX/UI Design', 'Application Management'],
  description: 'A mobile app development company specializing in delivering custom-built, high-quality mobile applications. With generally positive feedback, over 70% of reviewers commend their attention to detail, project management, and ability to enhance user engagement.',
  longDescription: `Naked Development is a mobile app development company specializing in delivering custom-built, high-quality mobile applications. With generally positive feedback, over 70% of reviewers commend their attention to detail, project management, and ability to enhance user engagement.

The company focuses on creating innovative solutions tailored to each client's specific needs. Their development process includes thorough planning, agile implementation, rigorous testing, and ongoing support.

Their team consists of experienced developers, designers, and project managers who work collaboratively to ensure projects are delivered on time and within budget. The company prides itself on transparent communication and maintaining close relationships with clients throughout the development process.`,
  expertise: [
    { skill: 'iOS Development', level: 95 },
    { skill: 'Android Development', level: 90 },
    { skill: 'React Native', level: 85 },
    { skill: 'Flutter', level: 80 },
    { skill: 'UX/UI Design', level: 85 }
  ],
  clients: ['Tesla', 'Amazon', 'Microsoft', 'Google', 'Facebook'],
  portfolioItems: [
    { name: 'Health Tracker App', description: 'A comprehensive health monitoring application', completionDate: '2021' },
    { name: 'E-commerce Platform', description: 'Full-featured mobile shopping experience',completionDate: '2021' },
    { name: 'Social Media App', description: 'Innovative social networking platform', completionDate: '2021' }
  ],
  testimonials: [
    { author: 'John Smith, CEO at TechCorp', content: 'Working with Naked Development was a pleasure. They delivered our app on time and exceeded our expectations.', rating: 5 },
    { author: 'Jane Doe, Product Manager at StartupX', content: 'Great team to work with! Very responsive and professional.', rating: 4 },
    { author: 'Robert Johnson, CTO at Enterprise Solutions', content: 'Excellent technical skills and project management. Would work with them again.', rating: 5 }
  ],
  verified: true
};

const CompanyPage = () => {
  const { companyName } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  const fetchCompany = async () => {
    try {
      const companyData = await CompanyService.getCompany(companyName);
      console.log("Backend Company Data:", companyData);
      // setCompany(companyData);
    } catch (error) {
      console.error("Error fetching company:", error.message);
    }
  };
  
  useEffect(() => {
    fetchCompany();
    setCompany (mockCompanyDetails);
  }, [companyName]);

  // useEffect(() => {
  //   // In a real app, you would fetch the company details from your API
  //   // For this example, we're using mock data
  //   setCompany(mockCompanyDetails);
  // }, [companyName]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!company) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography>Loading company details...</Typography>
      </Container>
    );
  }

  return (
    <Box>
      {/* Company Header */}
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
            ← Back to results
          </Button>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: 2,
                    backgroundColor: colors.neutral[200],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 3
                  }}
                >
                  Logo
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
                      {company.name}
                    </Typography>
                    {company.verified && (
                      <Chip 
                        label="Verified" 
                        size="small" 
                        color="primary"
                        sx={{ ml: 2 }} 
                      />
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                    <Rating value={company.rating} readOnly precision={0.1} />
                    <Typography variant="body1" sx={{ ml: 1 }}>
                      {company.rating} ({company.reviews} reviews)
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Map size={16} />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {company.location}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Users size={16} />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {company.teamSize} employees
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <DollarSign size={16} />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {company.priceRange}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
                <Button 
                  variant="contained" 
                  size="large"
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  Contact Company
                </Button>
                <Button 
                  variant="outlined" 
                  size="large"
                  fullWidth
                >
                  Visit Website
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Tabs & Content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="company tabs">
            <Tab label="Overview" />
            <Tab label="Services" />
            <Tab label="Portfolio" />
            <Tab label="Reviews" />
            <Tab label="Contact" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box>
          {/* Overview Tab */}
          {activeTab === 0 && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  About {company.name}
                </Typography>
                <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                  {company.longDescription}
                </Typography>
                
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mt: 4 }}>
                  Key Expertise
                </Typography>
                {company.expertise.map((skill, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body1">{skill.skill}</Typography>
                      <Typography variant="body1">{skill.level}%</Typography>
                    </Box>
                    <Box 
                      sx={{ 
                        height: 8, 
                        backgroundColor: colors.neutral[200],
                        borderRadius: 4,
                        overflow: 'hidden'
                      }}
                    >
                      <Box 
                        sx={{ 
                          height: '100%', 
                          width: `${skill.level}%`,
                          backgroundColor: colors.primary[500],
                          borderRadius: 4
                        }}
                      />
                    </Box>
                  </Box>
                ))}
                
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mt: 4 }}>
                  Key Clients
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {company.clients.map((client, index) => (
                    <Chip key={index} label={client} />
                  ))}
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card elevation={1}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Company Information
                    </Typography>
                    <List disablePadding>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Globe size={18} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Website" 
                          secondary={company.website} 
                        />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Mail size={18} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Email" 
                          secondary={company.email} 
                        />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Phone size={18} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Phone" 
                          secondary={company.phone} 
                        />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Calendar size={18} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Founded" 
                          secondary={company.founded} 
                        />
                      </ListItem>
                    </List>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="h6" gutterBottom>
                      Services Offered
                    </Typography>
                    <List disablePadding>
                      {company.services.map((service, index) => (
                        <ListItem key={index} disableGutters>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <Check size={18} color={colors.primary[500]} />
                          </ListItemIcon>
                          <ListItemText primary={service} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
          
          {/* Services Tab */}
          {activeTab === 1 && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  Services Offered
                </Typography>
                <List disablePadding>
                  {company.services.map((service, index) => (
                    <ListItem key={index} disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Check size={18} color={colors.primary[500]} />
                      </ListItemIcon>
                      <ListItemText primary={service} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          )}
          
          {/* Portfolio Tab */}
          {activeTab === 2 && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  Portfolio
                </Typography>
                <List disablePadding>
                  {company.portfolioItems.map((item, index) => (
                    <ListItem key={index} disableGutters>
                      <ListItemText 
                        primary={item.name} 
                        secondary={item.description} 
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          )}
          
          {/* Reviews Tab */}
          {activeTab === 3 && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  Reviews
                </Typography>
                <List disablePadding>
                  {company.testimonials.map((testimonial, index) => (
                    <ListItem key={index} disableGutters>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Rating value={testimonial.rating} readOnly precision={0.1} />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {testimonial.rating}
                        </Typography>
                      </Box>
                      <Typography variant="body1" paragraph>
                        "{testimonial.content}"
                      </Typography>
                      <Typography variant="body2">
                        - {testimonial.author}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          )}
          
          {/* Contact Tab */}
          {activeTab === 4 && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  Contact {company.name}
                </Typography>
                <Typography variant="body1" paragraph>
                  For inquiries or to request a quote, please contact {company.name} directly.
                </Typography>
                <Button 
                  variant="contained" 
                  size="large"
                >
                  Contact Company
                </Button>
              </Grid>
            </Grid>
          )}
        </Box>
      </Container>
    </Box>
  );
}

export default CompanyPage;