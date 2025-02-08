// // src/pages/HomePage.jsx
// import React from 'react';
// import { useAuth } from '../../contexts/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import { Search as SearchIcon } from 'lucide-react';
// import {
//   Box,
//   Container,
//   Typography,
//   TextField,
//   Button,
//   Paper,
//   InputAdornment,
//   styled
// } from '@mui/material';

// // Styled components
// const SearchButton = styled(Button)(({ theme }) => ({
//   height: '100%',
//   padding: '12px 24px',
//   marginLeft: theme.spacing(1),
//   fontSize: '1.1rem',
// }));

// const HomePage = () => {
//   const { currentUser, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//   };

//   return (
//     <Box 
//       sx={{ 
//         display: 'flex',
//         flexDirection: 'column',
//         minHeight: '100vh',
//         bgcolor: 'background.default',
//         pt: 8
//       }}
//     >
//       <Container maxWidth="md">
//         <Box 
//           sx={{ 
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             textAlign: 'center',
//             gap: 2
//           }}
//         >
//           <Typography variant="h4" component="h1" gutterBottom>
//             Find Companies by searching the description that you want.
//           </Typography>
          
//           <Typography variant="h6" color="text.secondary" gutterBottom>
//             Enter skills, projects, company name etc.
//           </Typography>

//           <Paper 
//             elevation={3}
//             sx={{ 
//               p: 0.5,
//               display: 'flex',
//               width: '100%',
//               maxWidth: 600,
//               mt: 3,
//               mb: 3
//             }}
//           >
//             <TextField
//               fullWidth
//               placeholder="What are you looking for?"
//               variant="outlined"
//               sx={{ 
//                 '& .MuiOutlinedInput-root': {
//                   '& fieldset': { border: 'none' },
//                 }
//               }}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <SearchIcon color="action" />
//                   </InputAdornment>
//                 ),
//               }}
//             />
//             <SearchButton 
//               variant="contained" 
//               color="primary"
//             >
//               Search
//             </SearchButton>
//           </Paper>

//           <Typography variant="body1" color="text.secondary">
//             You can enter a plain text, the results will be inferred from the text.
//           </Typography>
//         </Box>
//       </Container>
//     </Box>
//   );
// };

// export default HomePage;

// HomePage.jsx
import React, { useState } from 'react';
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
  Chip
} from '@mui/material';
import { Search } from 'lucide-react';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search logic
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{ 
          background: 'linear-gradient(45deg, #2B3A67 30%, #496A81 90%)',
          color: 'white',
          py: 8,
          mb: 6
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ maxWidth: 800, mx: 'auto', textAlign: 'center' }}>
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                mb: 3
              }}
            >
              Find Companies by searching the description that you want
            </Typography>
            
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 4,
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 400
              }}
            >
              Enter skills, projects, company name etc.
            </Typography>

            <Paper
              component="form"
              onSubmit={handleSearch}
              elevation={3}
              sx={{
                p: '4px',
                display: 'flex',
                alignItems: 'center',
                maxWidth: 600,
                mx: 'auto',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
              }}
            >
              <TextField
                fullWidth
                placeholder="What are you looking for?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { border: 'none' },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="#666" />
                    </InputAdornment>
                  ),
                }}
              />
              <Button 
                variant="contained" 
                size="large"
                type="submit"
                sx={{
                  px: 4,
                  py: 1.5,
                  backgroundColor: '#4F46E5',
                  '&:hover': {
                    backgroundColor: '#4338CA',
                  },
                }}
              >
                Search
              </Button>
            </Paper>

            <Typography 
              variant="body1" 
              sx={{ 
                mt: 2,
                color: 'rgba(255, 255, 255, 0.7)'
              }}
            >
              You can enter a plain text, the results will be inferred from the text.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Featured Companies Section */}
      <Container maxWidth="lg">
        <Typography 
          variant="h4" 
          sx={{ 
            mb: 4,
            fontWeight: 600
          }}
        >
          Featured Companies
        </Typography>
        
        <Grid container spacing={3}>
          {[1, 2, 3].map((company) => (
            <Grid item xs={12} md={4} key={company}>
              <Card 
                elevation={1}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: 2,
                        backgroundColor: '#E5E7EB',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2
                      }}
                    >
                      Logo
                    </Box>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Company {company}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Location • Size
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Brief description of the company and what they do...
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip label="Technology" size="small" />
                    <Chip label="AI" size="small" />
                    <Chip label="Software" size="small" />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;