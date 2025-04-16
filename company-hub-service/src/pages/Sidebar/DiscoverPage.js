import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Link, 
  List, 
  ListItem 
} from '@mui/material';
import { API_URL } from '../../config/apiConfig.js';
import { useNavigate } from 'react-router-dom';

const DiscoverPage = () => {
  const [servicesByIndustry, setServicesByIndustry] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/Company/GetAllServices`);
      const grouped = res.data.map(group => ({
        industry: group[0].industry.name,
        services: group.map(s => ({ id: s.id, name: s.name })),
      }));
      setServicesByIndustry(grouped);
    } catch (err) {
      console.error('Failed to fetch services', err);
    }
  };

  const handleServiceClick = (serviceId) => {
    navigate(`/search-results?q=&srv=${serviceId}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {servicesByIndustry.map((category, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" component="h2" fontWeight="bold" gutterBottom>
                  {category.industry}
                </Typography>
                <List sx={{ pt: 1 }}>
                  {category.services.map((service) => (
                    <ListItem key={service.id} sx={{ py: 0.5, px: 0 }}>
                      <Link 
                        component="button"
                        variant="body1"
                        color="primary"
                        underline="hover"
                        onClick={() => handleServiceClick(service.id)}
                        sx={{ textAlign: 'left' }}
                      >
                        {service.name}
                      </Link>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DiscoverPage;