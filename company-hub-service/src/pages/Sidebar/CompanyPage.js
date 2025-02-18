import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { Star, MapPin, Building, Globe, Clock, Users } from "lucide-react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Button,
  LinearProgress,
  Card,
  CardContent,
  Rating,
  Stack,
  Chip,
  Divider,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { colors } from '../../theme/theme';

// Styled components with updated colors
const CompanyLogo = styled(Box)(({ theme }) => ({
  width: 100,
  height: 100,
  backgroundColor: colors.primary[100],
  borderRadius: theme.shape.borderRadius * 2,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': {
    width: 50,
    height: 50,
    color: colors.primary[600],
  },
}));

const ProjectCard = styled(Card)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 1.5,
  border: '1px solid',
  borderColor: colors.neutral[200],
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
    borderColor: colors.primary[200],
  },
}));

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.MuiLinearProgress-colorPrimary`]: {
    backgroundColor: colors.neutral[100],
  },
  [`& .MuiLinearProgress-bar`]: {
    borderRadius: 5,
  },
}));

const CompanyPage = () => {
  const [loading, setLoading] = useState(true);
  const [companyData, setCompanyData] = useState(null);
  const theme = useTheme();

  // Sample data with updated colors
  const initialData = {
    id: "1",
    name: "InnovateX Solutions",
    owner: "Hamdullah Bilgin",
    websiteUrl: "https://example.com",
    rating: 4.8,
    location: "Austin, Texas, USA",
    foundingYear: 2013,
    priceRange: "$200-$500",
    employees: "50-100",
    about: "InnovateX Solutions specializes in AI-driven analytics, mobile app development, and UX/UI design. Our team of experts delivers tailored solutions to help businesses grow.",
    projects: [
      { type: "Mobile App Development", percentage: 40, color: colors.primary[500] },
      { type: "UI Design", percentage: 25, color: colors.primary[400] },
      { type: "UX Research", percentage: 18, color: colors.accent.info },
      { type: "Web Development", percentage: 11, color: colors.accent.warning },
      { type: "Marketing Strategy", percentage: 6, color: colors.accent.success },
    ],
    previousProjects: [
      { type: "Mobile App Development", name: "Fitness App", description: "A mobile app that helps users track their workouts and nutrition.", date: "2020" },
      { type: "UI Design", name: "Social Media Platform", description: "A social media platform with a focus on user privacy and data security", date: "2019" },
      { type: "Web Development", name: "E-Commerce Platform", description: "An e-commerce platform for small businesses to sell their products online", date: "2018" },
    ],
    services: [
      { name: "Mobile Development", value: 40 },
      { name: "Web Development", value: 35 },
      { name: "UI/UX Design", value: 25 },
    ],
  };

  useEffect(() => {
    setTimeout(() => {
      setCompanyData(initialData);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 4 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{ 
          background: `linear-gradient(45deg, ${colors.primary[700]} 30%, ${colors.primary[500]} 90%)`,
          color: 'white',
          pt: 6,
          pb: 8,
          mb: -6,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item>
              <CompanyLogo>
                <Building />
              </CompanyLogo>
            </Grid>
            <Grid item xs>
              <Typography variant="h3" component="h1" gutterBottom>
                {companyData.name}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <Rating value={companyData.rating} precision={0.1} readOnly size="large" />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  {companyData.rating}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={2}>
                <Chip 
                  icon={<MapPin size={18} />} 
                  label={companyData.location} 
                  sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    '& .MuiChip-icon': { color: 'white' }
                  }}
                />
                <Chip 
                  icon={<Clock size={18} />} 
                  label={`Founded in ${companyData.foundingYear}`}
                  sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    '& .MuiChip-icon': { color: 'white' }
                  }}
                />
                <Chip 
                  icon={<Users size={18} />} 
                  label={`${companyData.employees} Employees`}
                  sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    '& .MuiChip-icon': { color: 'white' }
                  }}
                />
              </Stack>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                startIcon={<Globe />}
                href={companyData.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  bgcolor: 'white',
                  color: colors.primary[600],
                  '&:hover': {
                    bgcolor: colors.neutral[100],
                  },
                }}
              >
                Visit Website
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* About Section */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            mb: 4, 
            borderRadius: 3,
            border: `1px solid ${colors.neutral[200]}`,
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ mb: 3, color: colors.neutral[800] }}>
            About Us
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.7, color: colors.neutral[600] }}>
            {companyData.about}
          </Typography>
        </Paper>

        {/* Projects & Services */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 4, 
                borderRadius: 3, 
                height: '100%',
                border: `1px solid ${colors.neutral[200]}`,
              }}
            >
              <Typography variant="h4" gutterBottom sx={{ mb: 4, color: colors.neutral[800] }}>
                Projects Overview
              </Typography>
              <Stack spacing={3}>
                {companyData.projects.map((project, index) => (
                  <Box key={index}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ color: colors.neutral[700] }}>
                        {project.type}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ color: colors.primary[600] }}>
                        {project.percentage}%
                      </Typography>
                    </Box>
                    <StyledLinearProgress
                      variant="determinate"
                      value={project.percentage}
                      sx={{
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: project.color,
                        },
                      }}
                    />
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 4, 
                borderRadius: 3, 
                height: '100%',
                border: `1px solid ${colors.neutral[200]}`,
              }}
            >
              <Typography variant="h4" gutterBottom sx={{ mb: 4, color: colors.neutral[800] }}>
                Services Breakdown
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <PieChart width={300} height={300}>
                  <Pie
                    data={companyData.services}
                    cx={150}
                    cy={150}
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {companyData.services.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={[
                          colors.primary[500],
                          colors.primary[400],
                          colors.primary[300],
                        ][index % 3]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Previous Projects */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            borderRadius: 3,
            border: `1px solid ${colors.neutral[200]}`,
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ mb: 4, color: colors.neutral[800] }}>
            Previous Projects
          </Typography>
          <Grid container spacing={3}>
            {companyData.previousProjects.map((project, index) => (
              <Grid item xs={12} md={4} key={index}>
                <ProjectCard>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h5" sx={{ color: colors.primary[600] }} gutterBottom>
                      {project.name}
                    </Typography>
                    <Chip 
                      label={project.type} 
                      size="small" 
                      sx={{ 
                        mb: 2,
                        bgcolor: colors.primary[100],
                        color: colors.primary[700],
                      }}
                    />
                    <Typography variant="body1" sx={{ mb: 2, color: colors.neutral[600] }}>
                      {project.description}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body2" sx={{ color: colors.neutral[500] }}>
                      Completed in {project.date}
                    </Typography>
                  </CardContent>
                </ProjectCard>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default CompanyPage;