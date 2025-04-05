import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Avatar, 
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { Email as EmailIcon, Phone as PhoneIcon, Person as PersonIcon } from '@mui/icons-material';
import CompanyService from '../../services/CompanyService';
import CompanyProfileDTO from '../../DTO/company/CompanyProfileDTO';

const CompanyPeoplePage = () => {
  const { companyName } = useParams();
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {token} = useAuth();

  useEffect(() => {
    const fetchCompanyPeople = async () => {
      try {
        setLoading(true);
        const companyData = await CompanyService.getCompany(companyName, token);
        console.log("Backend Company Data:", companyData);
        const companyProfile = new CompanyProfileDTO(companyData);
        const data = await CompanyService.getCompanyPeople(companyProfile.companyId, token);
        setPeople(data);
        console.log("Backend Company People Data:", data);
        setError(null);
      } catch (err) {
        console.error('Error fetching company people:', err);
        setError('Failed to load company personnel. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyPeople();
  }, [companyName]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        {companyName} - People
      </Typography>
      
      {people.length === 0 ? (
        <Alert severity="info">No personnel information available for this company.</Alert>
      ) : (
        <Grid container spacing={3}>
          {people.map((person) => (
            <Grid item xs={12} sm={6} md={4} key={person.id}>
              <Card 
                elevation={2} 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar 
                      sx={{ 
                        width: 56, 
                        height: 56, 
                        bgcolor: 'primary.main',
                        mr: 2
                      }}
                    >
                      {person.firstName && person.lastName 
                        ? person.firstName.charAt(0).toUpperCase() + person.lastName.charAt(0).toUpperCase() 
                        : <PersonIcon />}
                    </Avatar>
                    <Typography variant="h6" component="div">
                      {person.firstName && person.lastName 
                        ? `${person.firstName} ${person.lastName}` 
                        : "No Name Available"}
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 1.5 }} />
                  
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <EmailIcon 
                        sx={{ 
                          mr: 1, 
                          color: 'text.secondary',
                          cursor: person.email ? 'pointer' : 'default' 
                        }} 
                        onClick={() => person.email && window.open(`mailto:${person.email}`)}
                      />
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          cursor: person.email ? 'pointer' : 'default',
                          textDecoration: 'none',
                          '&:hover': {
                            color: 'text.secondary'
                          }
                        }}
                        onClick={() => person.email && window.open(`mailto:${person.email}`)}
                      >
                        {person.email || "Email not available"}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {person.phoneNumber || "Phone number not available"}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default CompanyPeoplePage;