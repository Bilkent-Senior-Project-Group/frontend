import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { Star, MapPin, Building, DollarSign, Globe, Briefcase, Clock, Users } from "lucide-react";
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
  Avatar,
  Rating,
  Stack,
  Chip,
  Link,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled components
const CompanyLogo = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  backgroundColor: theme.palette.primary.light,
  '& svg': {
    width: 40,
    height: 40,
    color: theme.palette.primary.main,
  },
}));

const ProjectCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #f5f7fa, #e4e9f0)',
  borderLeft: `5px solid ${theme.palette.primary.main}`,
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: theme.shadows[4],
  },
}));

const CompanyPage = () => {
  const [loading, setLoading] = useState(true);
  const [companyData, setCompanyData] = useState(null);
  
  const theme = useTheme();

  // Sample Data (same as before)
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
      { type: "Mobile App Development", percentage: 40, color: theme.palette.primary.main },
      { type: "UI Design", percentage: 25, color: theme.palette.secondary.main },
      { type: "UX Research", percentage: 18, color: theme.palette.error.main },
      { type: "Web Development", percentage: 11, color: theme.palette.warning.main },
      { type: "Marketing Strategy", percentage: 6, color: theme.palette.success.main },
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Company Card */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <CompanyLogo>
              <Building />
            </CompanyLogo>
          </Grid>
          <Grid item xs>
            <Typography variant="h4" component="h1" gutterBottom>
              {companyData.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Owner: {companyData.owner}
            </Typography>
            <Rating value={companyData.rating} precision={0.1} readOnly />
            <Stack direction="row" spacing={3} sx={{ mt: 2 }}>
              <Chip icon={<MapPin />} label={companyData.location} />
              <Chip icon={<Clock />} label={`Founded in ${companyData.foundingYear}`} />
              <Chip icon={<Users />} label={`Employees: ${companyData.employees}`} />
            </Stack>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<Globe />}
              href={companyData.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit Website
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* About Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>About Us</Typography>
        <Typography>{companyData.about}</Typography>
      </Paper>

      {/* Projects & Services */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>Projects Overview</Typography>
            <Stack spacing={2}>
              {companyData.projects.map((project, index) => (
                <Box key={index}>
                  <Typography variant="body2" gutterBottom>
                    {project.type} - {project.percentage}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={project.percentage}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: theme.palette.grey[200],
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: project.color,
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>Services Breakdown</Typography>
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
                        theme.palette.primary.main,
                        theme.palette.secondary.main,
                        theme.palette.error.main,
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
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Previous Projects</Typography>
        <Grid container spacing={3}>
          {companyData.previousProjects.map((project, index) => (
            <Grid item xs={12} key={index}>
              <ProjectCard>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {project.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Type:</strong> {project.type}
                  </Typography>
                  <Typography variant="body2">
                    {project.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {project.date}
                  </Typography>
                </CardContent>
              </ProjectCard>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default CompanyPage;