import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Rating,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
  IconButton,
} from '@mui/material';
import { Search, MapPin, Users, Building, ChevronRight, X } from 'lucide-react';
import { colors } from '../../theme/theme';
import { useNavigate } from 'react-router-dom';
import CompanyService from '../../services/CompanyService';
import { useAuth } from "../../contexts/AuthContext";
import earthBackground from '../../assets/images/earth-from-space.jpg'; 
import feature1Image from '../../assets/images/feature1.jpg';
import feature2Image from '../../assets/images/feature2.jpg';
import feature3Image from '../../assets/images/feature3.jpg';
import featuredCompaniesBackground from '../../assets/images/featured-companies-bg.jpg'; // You'll need to add this image

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('all');
  const [featuredCompanies, setFeaturedCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Generate random rating for demo purposes (remove in production)
  const getRandomRating = () => {
    return (Math.random() * 2 + 3).toFixed(1); // Random rating between 3.0 and 5.0
  };

  // Mock featured company data (replace with actual API data later)
  const mockFeaturedCompanies = [
    {
      CompanyId: 1,
      name: "TechSolutions Inc",
      location: "San Francisco, CA",
      companySize: "50-200 employees",
      foundedYear: 2010,
      description: "Leading provider of cloud-based solutions and digital transformation services for enterprises across multiple industries.",
      specialties: "Cloud Computing, DevOps, Digital Transformation, AI Solutions",
      logo: null
    },
    {
      CompanyId: 2,
      name: "HealthPlus Systems",
      location: "Boston, MA",
      companySize: "200-500 employees",
      foundedYear: 2005,
      description: "Healthcare technology company specializing in patient management systems and telemedicine solutions.",
      specialties: "Healthcare IT, Telemedicine, Patient Data Management",
      logo: null
    },
    {
      CompanyId: 3,
      name: "FinanceWise Partners",
      location: "New York, NY",
      companySize: "100-250 employees",
      foundedYear: 2012,
      description: "Financial advisory firm offering wealth management and investment services to individuals and businesses.",
      specialties: "Wealth Management, Investment Advisory, Retirement Planning",
      logo: null
    },
    {
      CompanyId: 4,
      name: "GreenEnergy Solutions",
      location: "Austin, TX",
      companySize: "20-100 employees",
      foundedYear: 2015,
      description: "Sustainable energy consulting and implementation services for residential and commercial properties.",
      specialties: "Solar Energy, Sustainability Consulting, Energy Efficiency",
      logo: null
    },
    {
      CompanyId: 5,
      name: "Marketing Innovators",
      location: "Chicago, IL",
      companySize: "50-150 employees",
      foundedYear: 2008,
      description: "Full-service digital marketing agency specializing in brand strategy, content marketing, and performance analytics.",
      specialties: "Digital Marketing, Content Strategy, SEO, Social Media Marketing",
      logo: null
    },
    {
      CompanyId: 6,
      name: "Global Logistics Partners",
      location: "Seattle, WA",
      companySize: "500+ employees",
      foundedYear: 2001,
      description: "End-to-end logistics and supply chain solutions for businesses of all sizes, with global reach and local expertise.",
      specialties: "Supply Chain Management, Freight Forwarding, Inventory Management, Distribution",
      logo: null
    }
  ];

  // Sample industries data - replace with actual data from API
  const industries = [
    {
      name: "Technology",
      services: ["Software Development", "IT Consulting", "Cloud Computing", "Cybersecurity"]
    },
    {
      name: "Healthcare",
      services: ["Medical Services", "Health Insurance", "Pharmaceuticals", "Medical Devices"]
    },
    {
      name: "Finance",
      services: ["Banking", "Investment Services", "Insurance", "Financial Planning"]
    },
    {
      name: "Manufacturing",
      services: ["Product Manufacturing", "Supply Chain Management", "Quality Control", "Industrial Design"]
    },
    {
      name: "Marketing",
      services: ["Digital Marketing", "Market Research", "Advertising", "Public Relations"]
    },
    {
      name: "Education",
      services: ["Online Learning", "Educational Technology", "Academic Consulting", "Training Services"]
    }
  ];

  useEffect(() => {
    // Fetch featured companies when component mounts
    fetchFeaturedCompanies();
  }, []);

  const fetchFeaturedCompanies = async () => {
    try {
      setLoading(true);
      // Replace with mock data for now
      // In production, use: const companies = await CompanyService.getFeaturedCompanies();
      setTimeout(() => {
        setFeaturedCompanies(mockFeaturedCompanies);
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error("Failed to fetch featured companies:", err);
      setError(err.message || "Failed to load featured companies. Please try again later.");
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search logic
    if (searchQuery.trim()) {
      const locationParam = location !== 'all' ? `&location=${encodeURIComponent(location)}` : '';
      navigate(`/search-results?q=${encodeURIComponent(searchQuery)}${locationParam}`);
    }
  };

  const handleSeeMore = () => {
    if (!user) {
      setLoginDialogOpen(true);
    } else {
      navigate('/companies');
    }
  };

  const handleLoginRedirect = () => {
    setLoginDialogOpen(false);
    navigate('/login');
  };

  const handleSignupRedirect = () => {
    setLoginDialogOpen(false);
    navigate('/signup');
  };

  // Function to display company specialties as chips
  const renderSpecialties = (specialtiesString) => {
    if (!specialtiesString) return null;
    
    // Split the specialties string into an array
    const specialties = specialtiesString.split(',').map(s => s.trim()).filter(s => s);
    
    return (
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
        {specialties.slice(0, 3).map((specialty, index) => (
          <Chip 
            key={index} 
            label={specialty} 
            size="small" 
            sx={{ 
              bgcolor: colors.primary[600],
              color: 'white',
              borderRadius: '16px'
            }} 
          />
        ))}
        {specialties.length > 3 && (
          <Chip 
            label={`+${specialties.length - 3} more`} 
            size="small" 
            variant="outlined" 
            sx={{ borderRadius: '16px' }}
          />
        )}
      </Box>
    );
  };

  // Function to get company size as a readable string
  const getCompanySizeText = (size) => {
    if (!size) return 'Unknown size';
    return size;
  };

  // Function to get first two letters for logo placeholder
  const getNameInitials = (name) => {
    if (!name) return '??';
    const words = name.split(' ');
    if (words.length === 1) {
      return name.substring(0, 2).toUpperCase();
    }
    return (words[0].charAt(0) + (words[1] ? words[1].charAt(0) : words[0].charAt(1))).toUpperCase();
  };

  // Features section content
  const features = [
    {
      title: "AI-Powered Search Technology",
      description: "Our platform leverages state-of-the-art Natural Language Processing and Large Language Models (LLMs) to understand the context and intent of your searches.",
      points: ["Context-aware search understanding", "Natural language query processing", "Intelligent results ranking"]
    },
    {
      title: "Comprehensive Company Profiles",
      description: "Create detailed, structured company profiles that showcase your business's unique attributes. Our platform enables companies to present both fundamental details and complex information in an organized, accessible format."
    },
    {
      title: "Project Management System",
      description: "Facilitate seamless collaboration between clients and service providers with our integrated project management tools.",
      points: ["Project submission and tracking", "Real-time status updates", "Project completion verification", "Performance evaluation system"]
    }
  ];

  return (
    <Box>
      {/* Hero Section with Earth Background */}
      <Box 
        sx={{ 
          position: 'relative',
          backgroundImage: `url(${earthBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '80vh',
          minHeight: '500px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 6
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ maxWidth: 800, mx: 'auto', textAlign: 'center' }}>
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
                mb: 3,
                color: 'white',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
              }}
            >
              Discover the Right Company for Your Needs
            </Typography>
            
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 4,
                color: colors.neutral[100],
                fontWeight: 400,
                textShadow: '1px 1px 3px rgba(0,0,0,0.5)'
              }}
            >
              Enter skills, projects, company name, or describe what you're looking for
            </Typography>

            <Paper
              component="form"
              onSubmit={handleSearch}
              elevation={5}
              sx={{
                p: '4px',
                display: 'flex',
                alignItems: 'center',
                flexDirection: { xs: 'column', sm: 'row' },
                maxWidth: 700,
                mx: 'auto',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '8px',
                overflow: 'hidden'
              }}
            >
              <TextField
                fullWidth
                placeholder="What are you looking for?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  flexGrow: 1,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { border: 'none' },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color={colors.neutral[400]} />
                    </InputAdornment>
                  ),
                }}
              />
              
              <FormControl 
                variant="outlined" 
                sx={{ 
                  minWidth: { xs: '100%', sm: 150 },
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  borderLeft: { xs: 'none', sm: `1px solid ${colors.neutral[300]}` }
                }}
              >
                <Select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  displayEmpty
                  renderValue={(selected) => {
                    if (selected === 'all') {
                      return (
                        <Box sx={{ display: 'flex', alignItems: 'center', color: colors.neutral[500] }}>
                          <MapPin size={16} style={{ marginRight: '8px' }} />
                          All Locations
                        </Box>
                      );
                    }
                    return (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <MapPin size={16} style={{ marginRight: '8px' }} />
                        {selected}
                      </Box>
                    );
                  }}
                >
                  <MenuItem value="all">All Locations</MenuItem>
                  <MenuItem value="New York">New York</MenuItem>
                  <MenuItem value="San Francisco">San Francisco</MenuItem>
                  <MenuItem value="London">London</MenuItem>
                  <MenuItem value="Tokyo">Tokyo</MenuItem>
                  <MenuItem value="Berlin">Berlin</MenuItem>
                </Select>
              </FormControl>
              
              <Button 
                variant="contained" 
                size="large"
                type="submit"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: { xs: 0, sm: '0 4px 4px 0' },
                  width: { xs: '100%', sm: 'auto' }
                }}
              >
                Search
              </Button>
            </Paper>

            <Typography 
              variant="body2" 
              sx={{ 
                mt: 2,
                color: colors.neutral[100],
                textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
              }}
            >
              Use natural language to describe what you're looking for - our AI will understand
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Companies with Accounts Section - centered title */}
      <Box sx={{ bgcolor: 'white', py: 8 }}>
        <Container maxWidth="lg" sx={{ mb: 0 }}>
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography 
              variant="h3" 
              component="h2"
              sx={{ 
                fontWeight: 700,
                color: colors.neutral[800],
                mb: 2
              }}
            >
              Our Network of Companies
            </Typography>
            <Typography 
              variant="body1"
              sx={{ 
                color: colors.neutral[600],
                maxWidth: '800px',
                mx: 'auto',
                fontSize: '1.1rem'
              }}
            >
              Join thousands of companies who have trusted our platform to showcase their services and connect with clients
            </Typography>
            
            {/* Logo cloud - this would typically be populated from your backend */}
            <Box sx={{ 
              mt: 4, 
              display: 'flex', 
              flexWrap: 'wrap', 
              justifyContent: 'center',
              gap: 3
            }}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
                <Box 
                  key={index}
                  sx={{ 
                    width: { xs: '33%', sm: '20%', md: '12%' }, 
                    height: 60, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    filter: 'grayscale(100%)',
                    opacity: 0.7,
                    transition: 'all 0.3s',
                    '&:hover': {
                      filter: 'grayscale(0%)',
                      opacity: 1
                    }
                  }}
                >
                  {/* Placeholder for company logos */}
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: 1,
                      backgroundColor: colors.primary[50],
                      color: colors.primary[500],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                    }}
                  >
                    C{index}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Featured Companies Section - with background photo */}
      <Box sx={{ 
        position: 'relative',
        py: 10, 
        color: 'white',
        backgroundImage: `url(${featuredCompaniesBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(23, 55, 94, 0.85)',
          zIndex: -1,
        }
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography 
              variant="h3" 
              component="h2"
              sx={{ 
                fontWeight: 700,
                color: 'white',
                mb: 2,
                textShadow: '1px 1px 3px rgba(0,0,0,0.3)'
              }}
            >
              Featured Companies
            </Typography>
            <Typography 
              variant="body1"
              sx={{ 
                color: 'rgba(255, 255, 255, 0.9)',
                maxWidth: '800px',
                mx: 'auto',
                fontSize: '1.1rem',
                textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
              }}
            >
              Discover and connect with our highlighted service providers across various industries
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 5 }}>
            <Button 
              variant="outlined" 
              endIcon={<ChevronRight size={16} />}
              onClick={handleSeeMore}
              sx={{ 
                color: 'white',
                borderColor: 'rgba(255,255,255,0.6)',
                backgroundColor: 'rgba(255,255,255,0.1)',
                px: 3,
                py: 1,
                backdropFilter: 'blur(4px)',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.2)'
                }
              }}
            >
              See all companies
            </Button>
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress sx={{ color: 'white' }} />
            </Box>
          ) : error ? (
            <Typography color="error" align="center">{error}</Typography>
          ) : featuredCompanies.length === 0 ? (
            <Typography align="center" sx={{ py: 4, color: '#e2e8f0' }}>
              No featured companies available at this time.
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {featuredCompanies.slice(0, 6).map((company) => (
                <Grid item xs={12} sm={6} md={4} key={company.CompanyId}>
                  <Card 
                    elevation={4}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
                        cursor: 'pointer'
                      },
                    }}
                    onClick={() => navigate(`/company/${company.name.replace(/\s+/g, '')}`)}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: 2,
                            backgroundColor: colors.primary[50],
                            color: colors.primary[800],
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 2,
                            fontWeight: 'bold',
                            fontSize: '1.2rem',
                            flexShrink: 0,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                          }}
                        >
                          {getNameInitials(company.name)}
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: colors.neutral[800] }}>
                            {company.name || 'Unnamed Company'}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Rating 
                              value={parseFloat(getRandomRating())} 
                              precision={0.1} 
                              readOnly 
                              size="small"
                              sx={{ color: colors.primary[600] }}
                            />
                            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                              {getRandomRating()}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <MapPin size={16} color={colors.neutral[500]} />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {company.location || 'Location not specified'}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Users size={16} color={colors.neutral[500]} />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          {getCompanySizeText(company.companySize)}
                        </Typography>
                      </Box>
                      
                      {company.foundedYear > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Building size={16} color={colors.neutral[500]} />
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            Founded: {company.foundedYear}
                          </Typography>
                        </Box>
                      )}
                      
                      {company.description && (
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          paragraph
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            minHeight: '40px',
                            mb: 2
                          }}
                        >
                          {company.description}
                        </Typography>
                      )}

                      {renderSpecialties(company.specialties)}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>

      {/* Industries Section - centered title */}
      <Box sx={{ bgcolor: 'white', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography 
              variant="h3" 
              component="h2"
              sx={{ 
                fontWeight: 700,
                color: colors.neutral[800],
                mb: 2
              }}
            >
              Browse by Industries
            </Typography>
            <Typography 
              variant="body1"
              sx={{ 
                color: colors.neutral[600],
                maxWidth: '800px',
                mx: 'auto',
                fontSize: '1.1rem'
              }}
            >
              Explore specialized service providers categorized by industry sectors
            </Typography>
          </Box>
          
          <Grid container spacing={3}>
            {industries.map((industry, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography 
                      variant="h5" 
                      component="h3" 
                      gutterBottom
                      sx={{ 
                        fontWeight: 600,
                        color: colors.primary[700],
                        pb: 1,
                        borderBottom: `2px solid ${colors.primary[300]}`
                      }}
                    >
                      {industry.name}
                    </Typography>
                    
                    <Box sx={{ mt: 2 }}>
                      {industry.services.map((service, sIndex) => (
                        <Box 
                          key={sIndex}
                          sx={{
                            py: 1,
                            pl: 1,
                            borderBottom: sIndex < industry.services.length - 1 ? `1px solid ${colors.neutral[200]}` : 'none',
                            '&:hover': {
                              backgroundColor: colors.neutral[50],
                              cursor: 'pointer'
                            }
                          }}
                          onClick={() => navigate(`/search-results?industry=${encodeURIComponent(industry.name)}&service=${encodeURIComponent(service)}`)}
                        >
                          <Typography variant="body1">
                            {service}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section - Redesigned with improved visuals and layout */}
      <Box sx={{ bgcolor: '#f5f8fa', py: 12 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h3" 
              component="h2"
              sx={{ 
                fontWeight: 700,
                color: colors.neutral[800],
                mb: 2
              }}
            >
              Platform Features
            </Typography>
            <Typography 
              variant="body1"
              sx={{ 
                color: colors.neutral[600],
                maxWidth: '700px',
                mx: 'auto',
                fontSize: '1.1rem'
              }}
            >
              Discover how our intelligent platform helps you find and connect with the right companies
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Feature 1: AI-Powered Search */}
      <Box sx={{ bgcolor: '#0a1929', py: 10, color: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ pr: { md: 5 } }}>
                <Box 
                  sx={{ 
                    display: 'inline-block', 
                    bgcolor: 'rgba(255,255,255,0.25)', 
                    px: 2, 
                    py: 0.5, 
                    borderRadius: 1,
                    mb: 3
                  }}
                >
                  <Typography variant="subtitle2" sx={{ 
                    fontWeight: 600, 
                    letterSpacing: 1,
                    color: '#ffffff'
                  }}>
                    INTELLIGENT SEARCH
                  </Typography>
                </Box>
                
                <Typography 
                  variant="h3" 
                  component="h2"
                  sx={{ 
                    fontWeight: 700,
                    mb: 3,
                    color: '#ffffff',
                    lineHeight: 1.2
                  }}
                >
                  AI-Powered Search Technology
                </Typography>
                
                <Typography 
                  variant="body1" 
                  paragraph
                  sx={{ 
                    fontSize: '1.1rem',
                    lineHeight: 1.7,
                    color: '#e2e8f0',
                    mb: 4
                  }}
                >
                  Our platform leverages state-of-the-art Natural Language Processing and Large Language Models (LLMs) to understand the context and intent of your searches, delivering more accurate and relevant results.
                </Typography>
                
                <Box sx={{ mt: 4 }}>
                  {features[0].points.map((point, pIndex) => (
                    <Box 
                      key={pIndex}
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        mb: 2.5
                      }}
                    >
                      <Box 
                        sx={{ 
                          width: 28, 
                          height: 28, 
                          borderRadius: '50%', 
                          bgcolor: '#90cdf4',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2,
                          flexShrink: 0,
                          color: '#1a365d',
                          fontWeight: 'bold'
                        }}
                      >
                        {pIndex + 1}
                      </Box>
                      <Typography 
                        variant="body1"
                        sx={{ 
                          color: '#e2e8f0',
                          fontSize: '1.05rem',
                        }}
                      >
                        {point}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box 
                sx={{
                  height: { xs: 300, md: 400 },
                  width: '100%',
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
                  position: 'relative'
                }}
              >
                <img 
                  src={feature1Image}
                  alt="AI-Powered Search Technology"
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Feature 2: Company Profiles */}
      <Box sx={{ bgcolor: '#f5f8fa', py: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center" direction={{ xs: 'column-reverse', md: 'row' }}>
            <Grid item xs={12} md={6}>
              <Box 
                sx={{
                  height: { xs: 300, md: 400 },
                  width: '100%',
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
                  position: 'relative'
                }}
              >
                <img 
                  src={feature2Image}
                  alt="Comprehensive Company Profiles"
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ pl: { md: 5 } }}>
                <Box 
                  sx={{ 
                    display: 'inline-block', 
                    bgcolor: colors.primary[100], 
                    px: 2, 
                    py: 0.5, 
                    borderRadius: 1,
                    mb: 3
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, letterSpacing: 1, color: colors.primary[700] }}>
                    DETAILED PROFILES
                  </Typography>
                </Box>
                
                <Typography 
                  variant="h3" 
                  component="h2"
                  sx={{ 
                    fontWeight: 700,
                    mb: 3,
                    color: colors.neutral[800],
                    lineHeight: 1.2
                  }}
                >
                  Comprehensive Company Profiles
                </Typography>
                
                <Typography 
                  variant="body1" 
                  paragraph
                  sx={{ 
                    fontSize: '1.1rem',
                    lineHeight: 1.7,
                    color: colors.neutral[700],
                    mb: 4
                  }}
                >
                  Create detailed, structured company profiles that showcase your business's unique attributes. Our platform enables companies to present both fundamental details and complex information in an organized, accessible format.
                </Typography>
                
                {/* <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {['Detailed Information', 'Media Galleries', 'Service Offerings', 'Client Testimonials', 'Company Analytics'].map((benefit, index) => (
                    <Chip 
                      key={index}
                      label={benefit}
                      sx={{ 
                        bgcolor: colors.primary[50],
                        color: colors.primary[700],
                        fontWeight: 500,
                        px: 1,
                        '& .MuiChip-label': {
                          px: 1,
                        }
                      }}
                    />
                  ))}
                </Box> */}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Feature 3: Project Management */}
      <Box sx={{ bgcolor: '#0a1929', py: 10, color: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ pr: { md: 5 } }}>
                <Box 
                  sx={{ 
                    display: 'inline-block', 
                    bgcolor: 'rgba(255,255,255,0.25)', 
                    px: 2, 
                    py: 0.5, 
                    borderRadius: 1,
                    mb: 3
                  }}
                >
                  <Typography variant="subtitle2" sx={{ 
                    fontWeight: 600, 
                    letterSpacing: 1,
                    color: '#ffffff'
                  }}>
                    COLLABORATION TOOLS
                  </Typography>
                </Box>
                
                <Typography 
                  variant="h3" 
                  component="h2"
                  sx={{ 
                    fontWeight: 700,
                    mb: 3,
                    color: '#ffffff',
                    lineHeight: 1.2
                  }}
                >
                  Project Management System
                </Typography>
                
                <Typography 
                  variant="body1" 
                  paragraph
                  sx={{ 
                    fontSize: '1.1rem',
                    lineHeight: 1.7,
                    color: '#e2e8f0',
                    mb: 4
                  }}
                >
                  Facilitate seamless collaboration between clients and service providers with our integrated project management tools. Track progress, exchange feedback, and ensure successful project completion.
                </Typography>
                
                <Box sx={{ mt: 4 }}>
                  {features[2].points.map((point, pIndex) => (
                    <Box 
                      key={pIndex}
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        mb: 2.5
                      }}
                    >
                      <Box 
                        sx={{ 
                          width: 28, 
                          height: 28, 
                          borderRadius: '50%', 
                          bgcolor: '#90cdf4',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2,
                          flexShrink: 0,
                          color: '#1a365d',
                          fontWeight: 'bold'
                        }}
                      >
                        {pIndex + 1}
                      </Box>
                      <Typography 
                        variant="body1"
                        sx={{ 
                          color: '#e2e8f0',
                          fontSize: '1.05rem',
                        }}
                      >
                        {point}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box 
                sx={{
                  height: { xs: 300, md: 400 },
                  width: '100%',
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
                  position: 'relative'
                }}
              >
                <img 
                  src={feature3Image}
                  alt="Project Management System"
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Bottom Call-to-Action Section - restore to previous state */}
      <Box sx={{ py: 10, bgcolor: colors.neutral[50] }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography 
              variant="h3" 
              component="h2"
              sx={{ 
                fontWeight: 700,
                color: colors.neutral[800],
                mb: 2
              }}
            >
              Ready to Transform Your Business Connections?
            </Typography>
            <Typography 
              variant="body1"
              sx={{ 
                color: colors.neutral[600],
                maxWidth: '800px',
                mx: 'auto',
                fontSize: '1.1rem',
                mb: 4
              }}
            >
              Join our platform today and experience the power of intelligent company search
            </Typography>
          </Box>
          
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="large"
                  onClick={() => navigate('/signup')}
                  sx={{ 
                    px: 4, 
                    py: 1.5, 
                    fontWeight: 600 
                  }}
                >
                  Create an Account
                </Button>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  size="large"
                  onClick={() => navigate('/companies')}
                  sx={{ 
                    px: 4, 
                    py: 1.5
                  }}
                >
                  Browse Companies
                </Button>
              </Box>

              <Box sx={{ mt: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ display: 'flex', mr: 3 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Box 
                      key={star}
                      component="span" 
                      sx={{ 
                        color: colors.primary[500],
                        fontSize: '24px',
                        lineHeight: 1
                      }}
                    >
                      ★
                    </Box>
                  ))}
                </Box>
                <Typography variant="body2" sx={{ color: colors.neutral[600] }}>
                  <strong>4.9/5</strong> based on <strong>1,200+</strong> user reviews
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box 
                sx={{
                  bgcolor: 'white',
                  p: 4,
                  borderRadius: 2,
                  boxShadow: 3,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '5px',
                    background: `linear-gradient(90deg, ${colors.primary[500]} 0%, ${colors.primary[300]} 100%)`
                  }}
                />
                
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  What our users are saying
                </Typography>
                
                <Box sx={{ mt: 3 }}>
                  <Typography 
                    variant="body1" 
                    paragraph
                    sx={{ 
                      fontStyle: 'italic',
                      color: colors.neutral[700]
                    }}
                  >
                    "This platform has completely transformed how we find service providers. 
                    The AI-powered search understands exactly what we're looking for, 
                    and the detailed company profiles make it easy to evaluate potential partners."
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        bgcolor: colors.primary[100],
                        color: colors.primary[600],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        mr: 2
                      }}
                    >
                      JD
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Jane Doe
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        CTO, TechFirm Inc.
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 3 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box sx={{ textAlign: 'center', px: 2 }}>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 700, 
                        color: colors.primary[600] 
                      }}
                    >
                      5,000+
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Companies
                    </Typography>
                  </Box>
                  
                  <Box sx={{ textAlign: 'center', px: 2 }}>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 700, 
                        color: colors.primary[600] 
                      }}
                    >
                      50+
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Industries
                    </Typography>
                  </Box>
                  
                  <Box sx={{ textAlign: 'center', px: 2 }}>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 700, 
                        color: colors.primary[600] 
                      }}
                    >
                      10M+
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Searches
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Login Dialog */}
      <Dialog
        open={loginDialogOpen}
        onClose={() => setLoginDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 2
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Login Required</Typography>
          <IconButton onClick={() => setLoginDialogOpen(false)} aria-label="close">
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Please log in or sign up to access more companies and unlock all features of Compedia.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={handleSignupRedirect} variant="outlined" fullWidth>
            Sign Up
          </Button>
          <Button onClick={handleLoginRedirect} variant="contained" fullWidth>
            Log In
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HomePage;