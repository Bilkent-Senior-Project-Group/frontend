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
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Avatar
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { Star, Map, Users, DollarSign, Phone, Mail, Globe, Check, Calendar, Upload, Edit, Plus, Trash2 } from 'lucide-react';
import { colors } from '../../theme/theme';
import CompanyService from '../../services/CompanyService';
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
    totalReviews: 0,
  });
  const [people, setPeople] = useState([]);
  
  const [activeTab, setActiveTab] = useState(0);
  const { token, user } = useAuth();
  const [userCompanies, setUserCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [logoUploadOpen, setLogoUploadOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [deleteLogoConfirmOpen, setDeleteLogoConfirmOpen] = useState(false);
  const [deletingLogo, setDeletingLogo] = useState(false);
  const [deleteLogoError, setDeleteLogoError] = useState('');
  const [deleteLogoSuccess, setDeleteLogoSuccess] = useState(false);

  // Fetch user's companies to determine ownership
  const fetchUserCompanies = async () => {
    if (!user || !token) {
      setUserCompanies([]);
      return;
    }
    
    try {
      const userCompaniesData = await CompanyService.getCompaniesOfUser(user.id, token);
      console.log("User's companies:", userCompaniesData);
      setUserCompanies(userCompaniesData);
    } catch (error) {
      console.error("Error fetching user's companies:", error.message);
      setUserCompanies([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user owns this company using the list of companies
  const isCompanyOwner = useMemo(() => {
    if (!company.companyId || userCompanies.length === 0) {
      return false;
    }
    
    return userCompanies.some(
      userCompany => userCompany.companyId === company.companyId
    );
  }, [company.companyId, userCompanies]);

  const fetchCompany = async () => {
    try {
      const companyData = await CompanyService.getCompany(companyName, token);
      console.log("Backend Company Data:", companyData);
      const companyProfile = new CompanyProfileDTO(companyData);
      setCompany(companyProfile);
      const data = await CompanyService.getCompanyPeople(companyProfile.companyId, token);
      setPeople(data);
      console.log("Backend Company People Data:", data);
    } catch (error) {
      console.error("Error fetching company:", error.message);
    }
  };

  useEffect(() => {
    fetchCompany();
    fetchUserCompanies();
  }, [companyName, user, token]);

  // For debugging - remove in production
  useEffect(() => {
    console.log("Company ID:", company.companyId);
    console.log("User companies:", userCompanies);
    console.log("Is company owner:", isCompanyOwner);
  }, [company.companyId, userCompanies, isCompanyOwner]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleLogoUploadOpen = () => {
    setLogoUploadOpen(true);
    setUploadError('');
    setSelectedFile(null);
    setUploadSuccess(false);
    // Clear delete-related messages too
    setDeleteLogoError('');
    setDeleteLogoSuccess(false);
  };

  const handleLogoUploadClose = () => {
    setLogoUploadOpen(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.includes('png')) {
        setUploadError('Only PNG files are allowed');
        setSelectedFile(null);
      } else {
        setSelectedFile(file);
        setUploadError('');
      }
    }
  };

  const handleCreateProject = () => {
    navigate(`/create-project`, {
      state: {
        providerCompany: company.name
      }
    });
  };

  const handleViewUserProfile = (userName) => {
    navigate(`/profile/${userName}`);
  };

  const hasReviews = useMemo(() => {
    return company.totalReviews > 0;
  }, [company.totalReviews]);

  const handleLogoUpload = async () => {
    if (!selectedFile) {
      setUploadError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      await CompanyService.uploadLogo(company.companyId, selectedFile, token);
      setUploadSuccess(true);
      setTimeout(() => {
        fetchCompany();
        handleLogoUploadClose();
      }, 1500);
    } catch (error) {
      setUploadError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteLogoOpen = () => {
    setDeleteLogoConfirmOpen(true);
    setDeleteLogoError('');
    setDeleteLogoSuccess(false);
  };

  const handleDeleteLogoClose = () => {
    setDeleteLogoConfirmOpen(false);
  };

  const handleDeleteLogo = async () => {
    setDeletingLogo(true);
    setDeleteLogoError('');
    
    try {
      await CompanyService.deleteLogo(company.companyId, token);
      setDeleteLogoSuccess(true);
      setTimeout(() => {
        fetchCompany();
        handleLogoUploadClose(); // Close the upload dialog entirely
      }, 1500);
    } catch (error) {
      setDeleteLogoError(error.message);
    } finally {
      setDeletingLogo(false);
    }
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

  if (!company) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography>Loading company details...</Typography>
      </Container>
    );
  }

  
  const getStatusColor = (isCompleted) => {
    return isCompleted ? 'success' : 'primary';
  };
  const tabs = [
    { label: "Overview", id: 0 },
    { label: "Portfolio", id: 1 }
  ];

  // Only add People tab if user is not the company owner
  if (!isCompanyOwner) {
    tabs.push({ label: "People", id: 2 });
  }

  // Add Reviews tab only if there are reviews
  if (hasReviews) {
    tabs.push({ label: "Reviews", id: isCompanyOwner ? 2 : 3 });
  }

  // Add Contact tab at the end
  tabs.push({ 
    label: "Contact", 
    id: isCompanyOwner 
      ? (hasReviews ? 3 : 2) 
      : (hasReviews ? 4 : 3) 
  });

  return (
    <Box>
      <Box
        sx={{
          backgroundColor: colors.neutral[100],
          py: 4,
          borderBottom: `1px solid ${colors.neutral[300]}`,
        }}
      >
        <Container maxWidth="lg">
          <Button variant="text" onClick={handleBack} sx={{ mb: 2 }}>
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
                    mr: 3,
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  {company.logoUrl ? (
                    <>
                      <img
                        src={company.logoUrl}
                        alt={`${company.name} logo`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            'https://azurelogo.blob.core.windows.net/company-logos/defaultcompany.png';
                        }}
                      />
                      {isCompanyOwner && (
                        <Box sx={{ 
                          position: 'absolute', 
                          bottom: 0, 
                          right: 0, 
                          display: 'flex' 
                        }}>
                          <Tooltip title="Change logo">
                            <IconButton
                              size="small"
                              onClick={handleLogoUploadOpen}
                              sx={{
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                '&:hover': {
                                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                },
                              }}
                            >
                              <Edit size={16} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      )}
                    </>
                  ) : (
                    <>
                      <Typography variant="body2" color="text.secondary">
                        Logo
                      </Typography>
                      {isCompanyOwner && (
                        <Tooltip title="Upload logo">
                          <IconButton
                            size="small"
                            onClick={handleLogoUploadOpen}
                            sx={{
                              position: 'absolute',
                              bottom: 0,
                              right: 0,
                              backgroundColor: 'rgba(255, 255, 255, 0.8)',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              },
                            }}
                          >
                            <Upload size={16} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </>
                  )}
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography
                      variant="h4"
                      component="h1"
                      sx={{ fontWeight: 600 }}
                    >
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
                      <Rating
                        value={company.overallRating}
                        readOnly
                        precision={0.1}
                      />
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
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  justifyContent: 'center',
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{ mb: 2 }}
                  href={`mailto:${company.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contact Company
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  fullWidth
                  href={
                    company.website?.startsWith('http')
                      ? company.website
                      : `https://${company.website}`
                  }
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

      <Dialog open={logoUploadOpen} onClose={handleLogoUploadClose}>
        <DialogTitle>
          {company.logoUrl ? 'Change Company Logo' : 'Upload Company Logo'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ my: 2 }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {company.logoUrl 
                ? 'Upload a new logo for your company or delete the current one. Only PNG files are supported for uploads.'
                : 'Upload a new logo for your company. Only PNG files are supported.'}
            </Typography>

            <input
              accept="image/png"
              style={{ display: 'none' }}
              id="logo-upload-button"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="logo-upload-button">
              <Button
                variant="outlined"
                component="span"
                startIcon={<Upload size={16} />}
              >
                Select PNG File
              </Button>
            </label>

            {selectedFile && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Selected file: {selectedFile.name}
                </Typography>
              </Box>
            )}

            {uploadError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {uploadError}
              </Alert>
            )}

            {uploadSuccess && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Logo uploaded successfully!
              </Alert>
            )}
            
            {deleteLogoError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {deleteLogoError}
              </Alert>
            )}

            {deleteLogoSuccess && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Logo deleted successfully!
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', px: 3 }}>
          <Box>
            {company.logoUrl && (
              <Button
                onClick={handleDeleteLogo}
                color="error"
                disabled={deletingLogo || uploading}
                startIcon={<Trash2 size={16} />}
              >
                {deletingLogo ? 'Deleting...' : 'Delete Logo'}
              </Button>
            )}
          </Box>
          <Box>
            <Button onClick={handleLogoUploadClose} sx={{ mr: 1 }}>Cancel</Button>
            <Button
              onClick={handleLogoUpload}
              variant="contained"
              disabled={!selectedFile || uploading || deletingLogo}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteLogoConfirmOpen} onClose={handleDeleteLogoClose}>
        <DialogTitle>Delete Company Logo</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Are you sure you want to delete the company logo? This action cannot be undone.
          </Typography>
          {deleteLogoError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {deleteLogoError}
            </Alert>
          )}
          {deleteLogoSuccess && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Logo deleted successfully!
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteLogoClose}>Cancel</Button>
          <Button
            onClick={handleDeleteLogo}
            variant="contained"
            color="error"
            disabled={deletingLogo}
          >
            {deletingLogo ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ 
          borderBottom: 1, 
          borderColor: 'divider', 
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="company tabs">
            {tabs.map((tab) => (
              <Tab key={tab.id} label={tab.label} />
            ))}
          </Tabs>
          
          {isCompanyOwner && (
            <Button
              variant="outlined"
              startIcon={<Edit size={16} />}
              onClick={() => navigate(`/company/edit-company/${company.name}`)}
              size="small"
            >
              Edit Company
            </Button>
          )}
        </Box>

        <Box>
          {activeTab === 0 && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  About us
                </Typography>
                <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                  {company.description}
                </Typography>

                {company.services && company.services.length > 0 && (
                  <>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mt: 4 }}>
                      Services Breakdown
                    </Typography>
                    <Box sx={{ 
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      mb: 4
                    }}>
                      {/* Chart container */}
                      <Box sx={{ 
                        width: '100%',
                        display: 'flex', 
                        justifyContent: 'center',
                        mb: 4
                      }}>
                        <PieChart width={300} height={220}>
                          <Pie
                            data={company.services}
                            cx={150}
                            cy={100}
                            innerRadius={60}
                            outerRadius={90}
                            dataKey="percentage"
                            nameKey="serviceName"
                            labelLine={false}
                          >
                            {company.services.map((_, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={[
                                  colors.primary[500],
                                  colors.primary[400],
                                  colors.primary[300],
                                  colors.primary[600],
                                ][index % 4]}
                              />
                            ))}
                          </Pie>
                          <RechartsTooltip 
                            formatter={(value, name) => [`${value}%`, name]} 
                            contentStyle={{ backgroundColor: 'white', borderRadius: '4px', padding: '8px' }}
                          />
                        </PieChart>
                      </Box>

                      {/* Legend container - without borders and with larger text */}
                      <Box sx={{ 
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        maxWidth: '600px',
                        gap: 3
                      }}>
                        {company.services.map((service, index) => (
                          <Box 
                            key={index} 
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              padding: '4px 8px',
                              minWidth: '150px'
                            }}
                          >
                            <Box sx={{ 
                              width: 16, 
                              height: 16, 
                              borderRadius: '50%',
                              backgroundColor: [
                                colors.primary[500],
                                colors.primary[400],
                                colors.primary[300],
                                colors.primary[600],
                              ][index % 4],
                              mr: 1.5
                            }} />
                            <Typography variant="subtitle2" sx={{ fontSize: '1rem' }}>
                              {service.serviceName}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </>
                )}
              </Grid>

              <Grid item xs={12} md={4}>
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
              </Grid>
            </Grid>
          )}

          {activeTab === 1 && (
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}> 
                  {isCompanyOwner && (
                    <Button
                      variant="contained"
                      startIcon={<Plus size={16} />}
                      onClick={handleCreateProject}
                    >
                      Create Project
                    </Button>
                  )}
                </Box>

                {company.projects && company.projects.filter(project => 
                  // Only show projects where this company is the provider
                  project.providerCompanyName === company.name
                ).length > 0 ? (
                  <Grid container spacing={3}>
                    {company.projects
                      .filter(project => project.providerCompanyName === company.name)
                      .map((project, index) => (
                        <Grid item xs={12} md={6} key={index}>
                          <Card
                            elevation={2}
                            sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                          >
                            <CardContent sx={{ flexGrow: 1 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                <Typography variant="h6" gutterBottom>
                                  {project.projectName}
                                </Typography>
                                <Chip 
                                  label={project.isCompleted ? 'Completed' : 'Ongoing'} 
                                  color={getStatusColor(project.isCompleted)} 
                                  size="small" 
                                />
                              </Box>
                              
                              <Typography variant="body2" color="text.secondary" paragraph>
                                {project.description}
                              </Typography>
                              {(project.startDate || project.completionDate) && (
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  <Calendar size={16} color={colors.neutral[500]} />
                                  <Typography
                                    variant="body2"
                                    sx={{ ml: 1 }}
                                    color="text.secondary"
                                  >
                                    {project.startDate
                                      ? new Date(project.startDate).toLocaleDateString()
                                      : 'Unknown'}{' '}
                                    -{' '}
                                    {project.completionDate
                                      ? new Date(project.completionDate).toLocaleDateString()
                                      : 'Present'}
                                  </Typography>
                                </Box>
                              )}
                              {project.clientCompanyName && (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ mb: 1 }}
                                >
                                  <strong>Client:</strong>{' '}
                                  {project.clientCompanyName}
                                </Typography>
                              )}
                              {/* Removed provider company name display since it's redundant */}
                              {project.services && project.services.length > 0 && (
                                <Box sx={{ mt: 2 }}>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 1 }}
                                  >
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
          
          {!isCompanyOwner && activeTab === 2 && (
            <Grid container spacing={4}>
              <Grid item xs={12}>
                {people && people.length > 0 ? (
                  <Grid container spacing={3}>
                    {people.map((member, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card 
                          elevation={1} 
                          sx={{ 
                            cursor: 'pointer',
                            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: 3
                            }
                          }}
                          onClick={() => handleViewUserProfile(member.userName)}
                        >
                          <CardContent sx={{ textAlign: 'center', py: 3 }}>
                            <Avatar
                              src={member.profilePictureUrl}
                              alt={`${member.firstName} ${member.lastName}`}
                              sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
                            />
                            <Typography variant="h6" gutterBottom>
                              {member.firstName} {member.lastName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {member.role || 'Member'}
                            </Typography>
                            {member.title && (
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                {member.title}
                              </Typography>
                            )}
                            <Button
                              variant="text"
                              size="small"
                              sx={{ mt: 2 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewUserProfile(member.userName);
                              }}
                            >
                              View Profile
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    No members available for this company.
                  </Typography>
                )}
              </Grid>
            </Grid>
          )}

          {hasReviews && activeTab === (isCompanyOwner ? 2 : 3) && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  Reviews
                </Typography>
                <List disablePadding></List>
              </Grid>
            </Grid>
          )}

          {activeTab === (isCompanyOwner 
            ? (hasReviews ? 3 : 2) 
            : (hasReviews ? 4 : 3)) && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
               
                <Typography variant="body1" paragraph>
                  For inquiries or to request a quote, please contact {company.name} directly.
                </Typography>
                
                <List disablePadding>
                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Globe size={18} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Website" 
                      secondary={
                        <Typography 
                          component="a" 
                          href={company.website?.startsWith('http') ? company.website : `https://${company.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          color="primary"
                        >
                          {company.website}
                        </Typography>
                      } 
                    />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Mail size={18} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Email" 
                      secondary={
                        <Typography 
                          component="a" 
                          href={`mailto:${company.email}`} 
                          color="primary"
                        >
                          {company.email}
                        </Typography>
                      } 
                    />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Phone size={18} />
                    </ListItemIcon>
                    <ListItemText primary="Phone" secondary={company.phone} />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          )}
          
        </Box>
      </Container>
    </Box>
  );
};

export default CompanyPage;