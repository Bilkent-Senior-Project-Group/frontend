import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  LinkedIn as LinkedInIcon,
  Language as WebsiteIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import UserService from '../../services/UserService';

const UserProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  // For editing fields
  const [editedData, setEditedData] = useState({});
  const [error, setError] = useState(null);
  const { user, token } = useAuth();
  const { username } = useParams(); // Get the username from the URL


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
        userName: data.username || "abcdefg",
        email: "john.doe@company.com",
        companyName: "Acme Solutions",
        position: "Head of Procurement",
        companySize: "50-100",
        industry: ["Technology", "Finance"],
        location: "Istanbul, Turkey",
        website: "www.acme-solutions.com",
        linkedIn: "linkedin.com/in/johndoe",
        bio: "Procurement specialist with 10+ years of experience. Looking for manufacturing partners in the tech sector.",
        interests: ["Software Development", "Cloud Services", "IoT Solutions"]
      };

      setUserData(mockData);
      setEditedData(mockData); // Initialize editedData with current userData
      setLoading(false);
    }, 1000);
  };

  fetchData();
}, []); // Don't forget this closing bracket!


  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    try{
    
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
    setUserData({...editedData});

    console.log("Saving profile data:", editedData);

    const { firstName, lastName, phoneNumber } = editedData;
    const dataToSend = {
      firstName,
      lastName,
      phoneNumber
    };
    await UserService.updateUserProfile(dataToSend, token);
    setUserData(editedData);
    setIsEditing(false);
    setIsEditing(false);
  }catch (error) {
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
        {/* Left Column - Profile Overview */}
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
            <Avatar 
              src={userData.photoUrl} 
              sx={{ 
                width: 150, 
                height: 150, 
                mb: 2,
                border: '4px solid #f5f5f5'
              }}
            />
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
                  primaryTypographyProps={{ 
                    sx: { 
                      wordBreak: 'break-word', 
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    } 
                  }} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <BusinessIcon />
                </ListItemIcon>
                <ListItemText primary={`${userData.companySize} employees`} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <LocationIcon />
                </ListItemIcon>
                <ListItemText primary={userData.location} />
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

        {/* Right Column - Detailed Information */}
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

              {/* Company Information */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Company Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="textSecondary">
                          Company Name
                        </Typography>
                        {isEditing ? (
                          <TextField 
                            fullWidth 
                            value={editedData.companyName}
                            onChange={(e) => handleChange('companyName', e.target.value)}
                          />
                        ) : (
                          <Typography variant="body1">{userData.companyName}</Typography>
                        )}
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="textSecondary">
                          Your Position
                        </Typography>
                        {isEditing ? (
                          <TextField 
                            fullWidth 
                            value={editedData.position}
                            onChange={(e) => handleChange('position', e.target.value)}
                          />
                        ) : (
                          <Typography variant="body1">{userData.position}</Typography>
                        )}
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="textSecondary">
                          Company Website
                        </Typography>
                        {isEditing ? (
                          <TextField 
                            fullWidth 
                            value={editedData.website}
                            onChange={(e) => handleChange('website', e.target.value)}
                          />
                        ) : (
                          <Typography 
                            variant="body1"
                            sx={{ 
                              wordBreak: 'break-word',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {userData.website}
                          </Typography>
                        )}
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="textSecondary">
                          LinkedIn Profile
                        </Typography>
                        {isEditing ? (
                          <TextField 
                            fullWidth 
                            value={editedData.linkedIn}
                            onChange={(e) => handleChange('linkedIn', e.target.value)}
                          />
                        ) : (
                          <Typography 
                            variant="body1"
                            sx={{ 
                              wordBreak: 'break-word',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {userData.linkedIn}
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Industry and Interests */}
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Industry
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {userData.industry.map((industry, index) => (
                        <Chip 
                          key={index} 
                          label={industry} 
                          color="primary" 
                          variant="outlined" 
                          onDelete={isEditing ? () => {
                            const updatedIndustry = [...editedData.industry];
                            updatedIndustry.splice(index, 1);
                            handleChange('industry', updatedIndustry);
                          } : undefined}
                        />
                      ))}
                      {isEditing && (
                        <Chip 
                          label="+ Add" 
                          color="primary" 
                          variant="outlined" 
                          onClick={() => {
                            // In a real implementation, you would show a dialog to add a new industry
                            const newIndustry = [...editedData.industry, "New Industry"];
                            handleChange('industry', newIndustry);
                          }} 
                        />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Business Interests
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {userData.interests.map((interest, index) => (
                        <Chip 
                          key={index} 
                          label={interest} 
                          color="secondary" 
                          variant="outlined" 
                          onDelete={isEditing ? () => {
                            const updatedInterests = [...editedData.interests];
                            updatedInterests.splice(index, 1);
                            handleChange('interests', updatedInterests);
                          } : undefined}
                        />
                      ))}
                      {isEditing && (
                        <Chip 
                          label="+ Add" 
                          color="secondary" 
                          variant="outlined" 
                          onClick={() => {
                            // In a real implementation, you would show a dialog to add a new interest
                            const newInterests = [...editedData.interests, "New Interest"];
                            handleChange('interests', newInterests);
                          }} 
                        />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Contact Information */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Contact Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="textSecondary">
                          Email
                        </Typography>
                        {isEditing ? (
                          <TextField 
                            fullWidth 
                            value={editedData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                          />
                        ) : (
                          <Typography 
                            variant="body1"
                            sx={{ 
                              wordBreak: 'break-word',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {userData.email}
                          </Typography>
                        )}
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="textSecondary">
                          Phone
                        </Typography>
                        {isEditing ? (
                          <TextField 
                            fullWidth 
                            value={editedData.phoneNumber}
                            onChange={(e) => handleChange('phoneNumber', e.target.value)}
                          />
                        ) : (
                          <Typography variant="body1">+{userData.phoneNumber}</Typography>
                        )}
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="textSecondary">
                          Location
                        </Typography>
                        {isEditing ? (
                          <TextField 
                            fullWidth 
                            value={editedData.location}
                            onChange={(e) => handleChange('location', e.target.value)}
                          />
                        ) : (
                          <Typography variant="body1">{userData.location}</Typography>
                        )}
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserProfilePage;