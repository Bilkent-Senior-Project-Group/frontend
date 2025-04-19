import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Link,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config/apiConfig';


const DiscoverPage = () => {
  const [servicesByIndustry, setServicesByIndustry] = useState([]);
  const navigate = useNavigate();


  const similarCompaniesData = [
          {
            companyId: "101",
            name: "Creative Solutions",
            logoUrl: null,
            verified: true,
            city: "Istanbul",
            country: "Turkey",
            totalReviews: 24,
            overallRating: 4.7,
            size: "11–50 employees",
            foundedYear: 2015,
            services: [
              { serviceName: "3D Printing" },
              { serviceName: "Prototyping" },
              { serviceName: "Product Design" }
            ],
            completedProjects: 2
          },
          {
            companyId: "102",
            name: "TechPrint",
            logoUrl: null,
            verified: false,
            city: "Ankara",
            country: "Turkey",
            size: "51–100 employees",
            foundedYear: 2012,
            services: [
              { serviceName: "3D Printing" },
              { serviceName: "CAD Modeling" },
              { serviceName: "Rapid Prototyping" }
            ],
            completedProjects: 1
          },
          {
            companyId: "103",
            name: "Industrial Innovations",
            logoUrl: null,
            verified: true,
            city: "Izmir",
            country: "Turkey",
            totalReviews: 37,
            overallRating: 4.9,
            size: "101–250 employees",
            foundedYear: 2010,
            services: [
              { serviceName: "3D Printing" },
              { serviceName: "Industrial Design" }
            ],
            completedProjects: 5
          },
          {
            companyId: "104",
            name: "NextGen Manufacturing",
            logoUrl: null,
            verified: true,
            city: "Bursa",
            country: "Turkey",
            totalReviews: 42,
            overallRating: 4.8,
            size: "51–100 employees",
            foundedYear: 2014,
            services: [
              { serviceName: "Additive Manufacturing" },
              { serviceName: "Precision Engineering" },
              { serviceName: "Prototype Testing" }
            ],
            completedProjects: 0
          },
          {
            companyId: "105",
            name: "Printify Lab",
            logoUrl: null,
            verified: false,
            city: "Antalya",
            country: "Turkey",
            totalReviews: 12,
            overallRating: 4.0,
            size: "11–50 employees",
            foundedYear: 2018,
            services: [
              { serviceName: "3D Printing" },
              { serviceName: "Resin Printing" },
              { serviceName: "Product Rendering" }
            ],
            completedProjects: 3
          },
          {
            companyId: "106",
            name: "FabTech Solutions",
            logoUrl: null,
            verified: true,
            city: "Konya",
            country: "Turkey",
            totalReviews: 29,
            overallRating: 4.6,
            size: "51–100 employees",
            foundedYear: 2013,
            services: [
              { serviceName: "3D Scanning" },
              { serviceName: "Injection Molding" },
              { serviceName: "Prototype Assembly" }
            ],
            completedProjects: 2
          },
          {
            companyId: "107",
            name: "ProtoMax Studio",
            logoUrl: null,
            verified: false,
            city: "Gaziantep",
            country: "Turkey",
            totalReviews: 21,
            overallRating: 4.3,
            size: "11–50 employees",
            foundedYear: 2016,
            services: [
              { serviceName: "3D Printing" },
              { serviceName: "Digital Fabrication" },
              { serviceName: "Reverse Engineering" }
            ],
            completedProjects: 0
          },
          {
            companyId: "108",
            name: "DesignForge",
            logoUrl: null,
            verified: true,
            city: "Eskişehir",
            country: "Turkey",
            totalReviews: 34,
            overallRating: 4.5,
            size: "101–250 employees",
            foundedYear: 2011,
            services: [
              { serviceName: "Industrial Design" },
              { serviceName: "Prototype Manufacturing" },
              { serviceName: "CNC Machining" }
            ],
            completedProjects: 1
          }
        ];
        
      

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

  const handleViewMore = (serviceIds) => {
    // Join service IDs with commas and encode them
    const query = encodeURIComponent(serviceIds.join(','));
    navigate(`/search-results?q=&srv=${query}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={4}>
        {servicesByIndustry.map((industryGroup, index) => {
          const industry = industryGroup.industry;
          const serviceIds = industryGroup.services.map(s => s.id);

          // Simulated similar companies per industry (replace with real fetch later)
          const companies = Object.values(similarCompaniesData).flat().slice(0, 8); // Just using slice(0,8) as demo

          return (
            <Grid item xs={12} key={index}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {industry}
                  </Typography>

                  <Grid container spacing={2}>
                    {companies.slice(0, 4).map((company, i) => (
                      <Grid item xs={12} sm={6} md={6} lg={3} key={i}>
                        <Card variant="outlined" sx={{ height: '100%' }}>
                          <CardContent>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {company.name}
                            </Typography>
                            <Typography variant="body2">
                              {company.city}, {company.country}
                            </Typography>
                            <Typography variant="body2">
                              Services: {company.services.map(s => s.serviceName).join(', ')}
                            </Typography>
                            <Typography variant="body2">
                              ⭐ {company.overallRating} ({company.totalReviews || 0} reviews)
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>

                  <Box display="flex" justifyContent="flex-end" mt={2}>
                    <Button
                      variant="text"
                      color="primary"
                      onClick={() => handleViewMore(serviceIds)}
                    >
                      View More
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default DiscoverPage;
