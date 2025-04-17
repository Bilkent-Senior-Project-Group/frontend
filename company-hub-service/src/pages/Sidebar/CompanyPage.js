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
  ListItemIcon,
  Stack,
  LinearProgress,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Star, Map, Users, DollarSign, Phone, Mail, Globe, Check, Calendar } from 'lucide-react';
import { colors } from '../../theme/theme';
import CompanyService  from '../../services/CompanyService';
import { useAuth } from '../../contexts/AuthContext';
import CompanyProfileDTO from '../../DTO/company/CompanyProfileDTO';
import { useMemo } from 'react';

const CompanyPage = () => {
  const { companyName } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState({
    companyId: null,
    name: '',
    description: '',
    services: [],
    verified: false,
    projects: [],
    location: -1,
    website: '',
    partnerships: [],
    companySize: '',
    foundedYear: new Date().getFullYear(),
    address: '',
    phone: '',
    email: '',
    overallRating: 0,
  });
  const [activeTab, setActiveTab] = useState(0);
  const {token} = useAuth();

  const fetchCompany = async () => {
    try {
      const companyData = await CompanyService.getCompany(companyName, token);
      console.log("Backend Company Data:", companyData);
      const companyProfile = new CompanyProfileDTO(companyData);
      // Use the DTO instead of raw data
      setCompany(companyProfile);
    } catch (error) {
      console.error("Error fetching company:", error.message);
    }
  };
  
  useEffect(() => {
    fetchCompany();
  }, [companyName]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const serviceStats = useMemo(() => {
    const countMap = {};
    let total = 0;
  
    company.projects?.forEach((project) => {
      project.services?.forEach((service) => {
        const key = service.id;
        total++;
        if (countMap[key]) {
          countMap[key].count += 1;
        } else {
          countMap[key] = {
            id: service.id,
            name: service.name,
            count: 1,
          };
        }
      });
    });
  
    return Object.values(countMap).map((service, index) => ({
      ...service,
      percentage: ((service.count / total) * 100).toFixed(1),
    }));
  }, [company]);

  console.log("Service Stats:", serviceStats);

  if (!company) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography>Loading company details...</Typography>
      </Container>
    );
  }

  const reviewMockCompany = {
    rating: 3.6,
    reviews: 132,
  };

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
                  {company.totalReviews > 0 ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                      <Rating value={company.overallRating} readOnly precision={0.1} />
                      <Typography variant="body1" sx={{ ml: 1 }}>
                        {company.overallRating} ({company.totalReviews} reviews)
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body1" sx={{ my: 1 }}>
                      No Reviews
                    </Typography>
                  )}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Map size={16} />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {company.city}, {company.country}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Users size={16} />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {company.companySize}
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
                  href={`mailto:${company.email}`}  // Email link
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contact Company
                </Button>
                <Button 
                  variant="outlined" 
                  size="large"
                  fullWidth
                  href={company.website?.startsWith('http') ? company.website : `https://${company.website}`}  // Website link with http check
                  target="_blank"
                  rel="noopener noreferrer"
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
                  About us
                </Typography>
                <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                  {company.description}
                </Typography>
        
                {company.projects && company.projects.length > 0 && (
                <>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  Projects Overview
                </Typography>
                <Stack spacing={3}>
                    {serviceStats.map((project, index) => (
                    <Box key={index}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ color: colors.neutral[700] }}>
                          {project.name}
                        </Typography>
                        <Typography variant="subtitle1" sx={{ color: colors.primary[600] }}>
                          {project.percentage}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={project.percentage}
                        sx={{
                          height: 10,
                          borderRadius: 5,
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: project.color,
                          },
                        }}
                      />
                    </Box>
                  ))}
                </Stack>
                </>
                )}
              
                {company.services && company.services.length > 0 && (
                <>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mt: 4 }}>
                  Services Breakdown
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <PieChart width={300} height={300}>
                    <Pie
                      data={company.services}
                      cx={150}
                      cy={100}
                      innerRadius={60}
                      outerRadius={80}
                      dataKey="percentage"
                      nameKey="serviceName"
                    >
                      {company.services.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={[
                            colors.primary[500],
                            colors.primary[400],
                            colors.primary[300],
                            colors.primary[600], // Add more colors if needed
                          ][index % 4]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </PieChart>
                </Box>
                </>
                )}

                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mt: 4 }}>
                  Partnerships
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {company.partnerships.map((client, index) => (
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
                          secondary={company.foundedYear} 
                        />
                      </ListItem>
                    </List>
                    
                    <Divider sx={{ my: 2 }} />
                    
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
                  {/* {company.services.map((service, index) => (
                    <ListItem key={index} disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Check size={18} color={colors.primary[500]} />
                      </ListItemIcon>
                      <ListItemText primary={service} />
                    </ListItem>
                  ))} */}
                  
                </List>
              </Grid>
            </Grid>
          )}
          
          {/* Portfolio Tab */}
          {activeTab === 2 && (
            <Grid container spacing={4}>
              <Grid item xs={12}>
                {company.projects && company.projects.length > 0 ? (
                  <Grid container spacing={3}>
                    {company.projects.map((project, index) => (
                      <Grid item xs={12} md={6} key={index}>
                        <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" gutterBottom>
                              {project.projectName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                              {project.description}
                            </Typography>
                            {(project.startDate || project.completionDate) && (
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Calendar size={16} color={colors.neutral[500]} />
                                <Typography variant="body2" sx={{ ml: 1 }} color="text.secondary">
                                  {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Unknown'} - 
                                  {project.completionDate ? new Date(project.completionDate).toLocaleDateString() : 'Present'}
                                </Typography>
                              </Box>
                            )}
                            {project.clientCompanyName && (
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                <strong>Client Company Name:</strong> {project.clientCompanyName}
                              </Typography>
                            )}
                            {project.providerCompanyName && (
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                <strong>Provider Company Name:</strong> {project.providerCompanyName}
                              </Typography>
                            )}
                            {project.services && project.services.length > 0 && (
                              <Box sx={{ mt: 2 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                  <strong>Services:</strong>
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                  {project.services.map((service, serviceIndex) => (
                                    <Chip 
                                      key={serviceIndex} 
                                      label={service.name} 
                                      size="small" 
                                      sx={{ 
                                        backgroundColor: colors.primary[500], 
                                        color: 'white',
                                        '&:hover': {
                                          backgroundColor: colors.primary[700],
                                          color: 'white',
                                        },
                                      }}
                                    />
                                  ))}
                                </Box>
                              </Box>
                            )}
                          </CardContent>
                          {project.projectUrl && (
                            <Box sx={{ p: 2, pt: 0 }}>
                              <Button 
                                variant="outlined" 
                                size="small" 
                                href={project.projectUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Visit Project
                              </Button>
                            </Box>
                          )}
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    No portfolio projects available.
                  </Typography>
                )}
              </Grid>
            </Grid>
          )}
          {activeTab === 3 && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  Reviews
                </Typography>
                <List disablePadding>
                  {/* {company.testimonials.map((testimonial, index) => (
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
                  ))} */}
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
                  href={`mailto:${company.email}`}  // Email link
                  target="_blank"
                  rel="noopener noreferrer"
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