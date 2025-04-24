import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Avatar, 
  Box, 
  Card, 
  CardContent, 
  Container, 
  Divider, 
  Grid,
  Paper, 
  Typography, 
  Button,
  TextField,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Skeleton
} from '@mui/material';

import { 
  Phone as PhoneIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
  Edit as EditIcon,
  Cancel as CancelIcon,
  LinkedIn as LinkedInIcon,
  Language as WebsiteIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import UserService from '../../services/UserService';
import CompanyService from '../../services/CompanyService';


const UserProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  // For editing fields
  const [editedData, setEditedData] = useState({});
  const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);
  const [error, setError] = useState(null);
  const { user, token, isAdmin } = useAuth();
  const { username } = useParams(); // Get the username from the URL
  const navigate = useNavigate();


//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const data = await UserService.fetchUserProfile(username, currentUser.token);
//         setUserData(data);
//         setEditedData(data);
//         setLoading(false);
//       } catch (error) {
//         setError(error.message);
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [username, currentUser.token]);



useEffect(() => {
  const fetchData = async () => {
    console.log("Fetching user data for:", username);
    console.log("Current user token:", token);
    const data = await UserService.fetchUserProfile(username, token);
    console.log(data);

    // Simulate API call (you can remove this if your real API returns the full data)
    setTimeout(() => {
      const mockData = {
        firstName: data.firstName || "John",
        lastName: data.lastName || "soyadımız",
        photoUrl: data.photoUrl || "https://azurelogo.blob.core.windows.net/profile-photos/profile-photos/dd6811d7-c019-4c06-84b0-c6d7a27455a3/bc72c9da-f8bd-4bc0-9d63-7bfb01e267bc.jpeg",
        phoneNumber: data.phoneNumber || "5123456789",
        userName: data.userName || "abcdefg",
        email: data.email || "john.doe@company.com",
        // companyName: "Acme Solutions",
        // position: "Head of Procurement",
        // companySize: "50-100",
        // industry: ["Technology", "Finance"],
        // location: "Istanbul, Turkey",
        // website: "www.acme-solutions.com",
        linkedIn: data.linkedIn || "linkedin.com/in/johndoe",
        bio: data.bio || "Procurement specialist with 10+ years of experience. Looking for manufacturing partners in the tech sector.",
        // interests: ["Software Development", "Cloud Services", "IoT Solutions"]
      };

      
      // Set the user data and edited data
      setEditedData(mockData);
      setUserData(mockData);

      
      
      setLoading(false);
    }, 1000);
  };

  fetchData();
}, []); // Don't forget this closing bracket!
  const [userCompanies, setUserCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      const companies = await getCompaniesOfUser();
      console.log("Fetched companies:", companies);
      setUserCompanies(companies);
    };
    fetchCompanies();
  }, [userData]);


  const getCompaniesOfUser = async () => {
    try {
      const companies = await CompanyService.getCompaniesOfUser(user.id, token);
      console.log("User companies:", companies);
      return companies;
    } catch (error) {
      console.error("Error fetching user companies:", error);
      return [];
    }
  };

  const handleEditProfile = () => {
    setIsEditing(true);

  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedData(userData); // Reset to original data
  };




  const handleSaveProfile = async () => {
    try {
    
      // Check if anything has actually changed
      const hasChanges = JSON.stringify(userData) !== JSON.stringify(editedData);
      
      if (!hasChanges) {
        // No changes, just exit edit mode without an API call
        console.log("No changes detected, skipping API call");
        setIsEditing(false);
        return;
      }
      // Continue with the update since there are changes
      console.log("Changes detected, updating profile...");
      // Update the user data with edited values
      setUserData({
        ...userData,
        ...editedData,
      });
      console.log("Saving profile data:", editedData);
      // Send all edited data to ensure all changes are saved
      const dataToSend = {
        firstName: editedData.firstName,
        lastName: editedData.lastName,
        phoneNumber: editedData.phoneNumber,
        userName: editedData.userName,
        email: editedData.email,
        // companyName: editedData.companyName,
        // position: editedData.position,
        // companySize: editedData.companySize,
        // industry: editedData.industry,
        // location: editedData.location,
        // website: editedData.website,
        // interests: editedData.interests,
        linkedIn: editedData.linkedIn,
        bio: editedData.bio,
        photoUrl: editedData.photoUrl,
      };
      await UserService.updateUserProfile(dataToSend, token);
      if (selectedPhotoFile && editedData.photoUrl !== userData.photoUrl) {
        await UserService.updateProfilePhoto(selectedPhotoFile, token);
      }
      
      setUserData(editedData);
      setIsEditing(false);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("Error saving profile:", error);
      setError(error.message);
    }
    // In a real implementation, here you would make an API call to save changes
  };

//   const handleSaveProfile = async () => {
//     try {
//       const updatedData = await UserService.updateUserProfile(editedData, currentUser.token);
//       setUserData(updatedData);
//       setIsEditing(false);
//     } catch (error) {
//       setError(error.message);
//     }
//   };
  const handleChange = (field, value) => {
    setEditedData({
      ...editedData,
      [field]: value
    });
  };

  const handlePhotoSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedPhotoFile(file);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        handleChange('photoUrl', event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} lg={3}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Skeleton variant="circular" width={150} height={150} />
              <Skeleton width="80%" height={30} sx={{ mt: 2 }} />
              <Skeleton width="60%" height={20} sx={{ mt: 1 }} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={8} lg={9}>
            <Paper sx={{ p: 2 }}>
              <Skeleton height={50} width="40%" />
              <Skeleton height={30} width="100%" sx={{ mt: 2 }} />
              <Skeleton height={30} width="100%" sx={{ mt: 1 }} />
              <Skeleton height={30} width="60%" sx={{ mt: 1 }} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
  }

  


  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: '100%'
            }}
          >
            <Box 
              sx={{ 
                position: 'relative',
                mb: 2
              }}
            >
              <Avatar 
                src={userData.photoUrl} 
                sx={{ 
                  width: 150, 
                  height: 150,
                  border: '4px solid #f5f5f5'
                }}
              />
              {isEditing && (
                <Box
                  component="label"
                  htmlFor="photo-upload"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: 'primary.main',
                    borderRadius: '50%',
                    padding: '8px',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'primary.dark'
                    }
                  }}
                >
                  <EditIcon sx={{ color: 'white' }} />
                  <input
                    type="file"
                    id="photo-upload"
                    accept="image/*"
                    hidden
                    onChange={handlePhotoSelect}
                  />
                </Box>
              )}
            </Box>
            <Typography variant="h5" gutterBottom>
              {isEditing ? (
                <TextField 
                  value={editedData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  variant="standard"
                  sx={{ mr: 1 }}
                />
              ) : (
                userData.firstName
              )}{' '}
              {isEditing ? (
                <TextField 
                  value={editedData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  variant="standard"
                />
              ) : (
                userData.lastName
              )}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              @{userData.userName}
            </Typography>
            <Typography variant="body1" gutterBottom align="center">
              {userData.position} at {userData.companyName}
            </Typography>
            <Divider sx={{ width: '100%', my: 2 }} />
            <List sx={{ width: '100%' }}>
              <ListItem>
                <ListItemIcon>
                  <PhoneIcon />
                </ListItemIcon>
                <ListItemText primary={`+${userData.phoneNumber}`} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <EmailIcon />
                </ListItemIcon>
                <ListItemText 
                  primary={userData.email} 
                  slotProps={{
                    primary: { 
                      sx: { 
                        wordBreak: 'break-word', 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      } 
                    }
                  }} 
                />
              </ListItem>
              <ListItem>
                {/* <ListItemIcon>
                  <BusinessIcon />
                </ListItemIcon>
                <ListItemText primary={`${userData.companySize} employees`} /> */}
              </ListItem>
              <ListItem>
                {/* <ListItemIcon>
                  <LocationIcon />
                </ListItemIcon>
                <ListItemText primary={userData.location} /> */}
              </ListItem>
            </List>
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <IconButton color="primary" aria-label="linkedin profile">
                <LinkedInIcon />
              </IconButton>
              <IconButton color="primary" aria-label="company website">
                <WebsiteIcon />
              </IconButton>
            </Box>
            {user.userName === username && (
            <Button 
                variant="contained" 
                color="primary" 
                startIcon={<EditIcon />}
                sx={{ mt: 2 }}
                onClick={handleEditProfile}
                fullWidth
                disabled={isEditing}
            >
                Edit Profile
            </Button>
            )}
            
          </Paper>
        </Grid>
        <Grid item xs={12} md={8} lg={9}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h4">
                Profile Information
              </Typography>
              {isEditing ? (
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleSaveProfile}
                >
                  Save Changes
                </Button>
              ) : null}
              {isEditing ? (
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  onClick={handleCancelEdit}
                  startIcon={<CancelIcon />}
                >
                  Cancel
                </Button>
              ) : null}
            </Box>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              {/* Bio */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      About
                    </Typography>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        value={editedData.bio}
                        onChange={(e) => handleChange('bio', e.target.value)}
                      />
                    ) : (
                      <Typography variant="body1">
                        {userData.bio}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>


              <Grid item xs={12}>
                <Paper sx={{ p: 3, mt: 3 }}>
                  <Typography variant="h5" gutterBottom>
                    Companies
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  {userCompanies.length === 0 ? (
                    <Typography variant="body1" color="text.secondary">
                      No companies associated with this user.
                    </Typography>
                  ) : (
                    <Grid container spacing={2}>
                      {userCompanies.map((company) => (
                        <Grid item xs={12} md={6} lg={4} key={company.id}>
                          <Card 
                            sx={{ 
                              height: '100%', 
                              display: 'flex', 
                              flexDirection: 'column',
                              transition: 'transform 0.2s, box-shadow 0.2s',
                              cursor: 'pointer',
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: 6
                              }
                            }}
                            onClick={() => navigate(`/company/${company.companyName}`)}
                          >
                            <CardContent sx={{ flexGrow: 1 }}>
                              <Typography variant="h6" component="div" gutterBottom>
                                {company.companyName}
                              </Typography>
                              {company.location && (
                                <Typography variant="body2" color="text.secondary" gutterBottom> {company.location}</Typography>
                                 
                              )}
                              {company.industry && (
                                <Box sx={{ mt: 1 }}>
                                  <Chip 
                                    label={company.industry} 
                                    size="small" 
                                    sx={{ mr: 1, mb: 1 }} 
                                  />
                                </Box>
                              )}
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}


export default UserProfilePage;
