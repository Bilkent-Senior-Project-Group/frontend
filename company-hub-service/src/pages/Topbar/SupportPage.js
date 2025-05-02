import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Divider,
  TextField,
  Button,
  Grid,
  Alert,
  Snackbar
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import EmailIcon from '@mui/icons-material/Email';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import BusinessIcon from '@mui/icons-material/Business';
import HandshakeIcon from '@mui/icons-material/Handshake';
import BarChartIcon from '@mui/icons-material/BarChart';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

const SupportPage = () => {
  const [expanded, setExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const handleContactFormChange = (event) => {
    const { name, value } = event.target;
    setContactForm({
      ...contactForm,
      [name]: value
    });
  };

  const handleContactSubmit = (event) => {
    event.preventDefault();
    console.log('Form submitted:', contactForm);
    // Reset form
    setContactForm({
      name: '',
      email: '',
      message: ''
    });
    setSnackbarOpen(true);
  };

  const faqs = [
    {
      category: 'Account & Verification',
      icon: <VerifiedUserIcon color="primary" />,
      items: [
        {
          id: 'account-1',
          question: 'How do I verify my email address?',
          answer: 'After registration, a verification email will be sent to your registered email address. Click the verification link in the email to complete the verification process. You can also request a new verification email from the email verification page if needed.'
        },
        {
          id: 'account-2',
          question: 'What happens if my email is not verified?',
          answer: 'Without email verification, you\'ll have limited access to platform features. You\'ll be prompted to verify your email before accessing most features of the platform such as creating company profiles.'
        },
        {
          id: 'account-3',
          question: 'How do I reset my password?',
          answer: 'You can reset your password by clicking the "Forgot Password" link on the login page. You\'ll receive an email with instructions to create a new password.'
        },
        {
          id: 'account-4',
          question: 'How can I update my profile information?',
          answer: 'Go to your user profile page by clicking on your username in the top navigation bar. Then click "Edit Profile" to update your information, including profile photo, contact details, and bio.'
        }
      ]
    },
    {
      category: 'Companies',
      icon: <BusinessIcon color="primary" />,
      items: [
        {
          id: 'company-1',
          question: 'How do I create a new company?',
          answer: 'Click the "+" button in the top navigation bar and select "Create Company". Fill out the required information including company name, address, size, and services offered. You can also upload a company logo in PNG format after creating your company profile.'
        },
        {
          id: 'company-2',
          question: 'What is company verification?',
          answer: 'Company verification is a process that confirms your company\'s legitimacy. Verified companies have a badge displayed on their profile and are shown in search results. Only verified companies can create and participate in projects.'
        },
        {
          id: 'company-3',
          question: 'How do I upload a company logo?',
          answer: 'You can upload a company logo after creating your company by visiting your company page and clicking on the logo placeholder or current logo. Only PNG files are supported for company logos.'
        },
        {
          id: 'company-4',
          question: 'How do I add people to my company?',
          answer: 'Go to your company page and navigate to the People section. Click the "Invite User" button and enter the email address of the person you want to invite. They will receive an invitation to join your company.'
        }
      ]
    },
    {
      category: 'Projects',
      icon: <HandshakeIcon color="primary" />,
      items: [
        {
          id: 'project-1',
          question: 'How do I create a new project?',
          answer: 'Click the "+" button in the top navigation bar and select "Create Project". Select the client and provider companies (one must be your company), enter project details, and specify the technologies and services involved.'
        },
        {
          id: 'project-2',
          question: 'How do I mark a project as completed?',
          answer: 'Open the project from your company\'s projects page and click the "Mark as Completed" button. Both the client and provider companies need to mark the project as completed for it to be fully completed.'
        },
        {
          id: 'project-3',
          question: 'How do project requests work?',
          answer: 'Project requests are sent when you create a project involving another company. The other company needs to approve the request before the project is officially created. You can view received and sent project requests in the Project Requests page.'
        },
        {
          id: 'project-4',
          question: 'How do I add technologies to my project?',
          answer: 'When creating or editing a project, you\'ll find a technologies section where you can add the tech stack used in your project. You can select from common technologies or add your own custom ones.'
        },
        {
          id: 'project-5',
          question: 'How do I leave a review for a completed project?',
          answer: 'After a project is marked as completed by both parties, the client company can leave a review. Go to the project details and click the "Leave Review" button to rate the provider and share your feedback.'
        }
      ]
    },
    {
      category: 'Services & Technologies',
      icon: <HelpOutlineIcon color="primary" />,
      items: [
        {
          id: 'services-1',
          question: 'How do I add services to my company?',
          answer: 'When creating or editing your company profile, you\'ll find a section for services. Services are categorized by industry - select the appropriate industry tab and choose the services your company offers.'
        },
        {
          id: 'services-2',
          question: 'What\'s the difference between services and technologies?',
          answer: 'Services represent what your company offers to clients (e.g., Web Development, Cloud Migration), while technologies are the specific tools and frameworks used to deliver those services (e.g., React, AWS).'
        },
        {
          id: 'services-3',
          question: 'How do I add custom technologies?',
          answer: 'When adding technologies to a project, you can type and add custom technologies if they\'re not in the suggested list. Just type the technology name and press Enter or select it from the dropdown.'
        }
      ]
    },
    {
      category: 'Analytics',
      icon: <BarChartIcon color="primary" />,
      items: [
        {
          id: 'analytics-1',
          question: 'What analytics are available for my company?',
          answer: 'The Analytics page provides insights on profile views, visitor trends, effective search queries, and viewer demographics. You can see data on daily, weekly, and monthly views of your company profile.'
        },
        {
          id: 'analytics-2',
          question: 'How can I use analytics data to improve my company profile?',
          answer: 'Analytics can help identify which search terms bring visitors to your profile. Use this information to optimize your company description, services, and technologies to match what potential clients are searching for.'
        },
        {
          id: 'analytics-3',
          question: 'How is the "most effective search query" determined?',
          answer: 'The most effective search query is determined based on which search terms lead to the most profile views and highest engagement with your company profile.'
        }
      ]
    },
    {
      category: 'Invitations & Collaboration',
      icon: <GroupAddIcon color="primary" />,
      items: [
        {
          id: 'invite-1',
          question: 'How do I view and respond to company invitations?',
          answer: 'Click the bell icon in the top navigation bar to see your notifications, including company invitations. You can also access invitations through the "+" menu. For each invitation, you can choose to accept or reject it.'
        },
        {
          id: 'invite-2',
          question: 'Can I be part of multiple companies?',
          answer: 'Yes, you can be associated with multiple companies. Accept invitations from different companies to join them, and switch between companies using the company selector in the sidebar.'
        },
        {
          id: 'invite-3',
          question: 'What happens when I accept a company invitation?',
          answer: 'When you accept an invitation, you become a member of that company. You\'ll have access to the company\'s projects, analytics, and other information based on your role within the company.'
        }
      ]
    }
  ];

  const filteredFaqs = searchQuery
    ? faqs.map(category => ({
        ...category,
        items: category.items.filter(
          item =>
            item.question.toLowerCase().includes(searchQuery) ||
            item.answer.toLowerCase().includes(searchQuery)
        )
      })).filter(category => category.items.length > 0)
    : faqs;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 2, bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h3" gutterBottom align="center">
          Support Center
        </Typography>
        <Typography variant="h6" align="center" sx={{ mb: 3 }}>
          Find answers to frequently asked questions or contact our support team
        </Typography>
        <Box sx={{ position: 'relative', maxWidth: 600, mx: 'auto' }}>
          <TextField
            fullWidth
            placeholder="Search for answers..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1 }} />,
              sx: { 
                bgcolor: 'white', 
                borderRadius: 2,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'transparent'
                }
              }
            }}
            variant="outlined"
          />
        </Box>
      </Paper>

      {filteredFaqs.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6">No results found for "{searchQuery}"</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Try a different search term or browse the categories below
          </Typography>
        </Paper>
      ) : (
        filteredFaqs.map((category, index) => (
          category.items.length > 0 && (
            <Box key={index} sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {category.icon}
                <Typography variant="h5" sx={{ ml: 1 }}>
                  {category.category}
                </Typography>
              </Box>
              {category.items.map((faq) => (
                <Accordion 
                  key={faq.id} 
                  expanded={expanded === faq.id} 
                  onChange={handleChange(faq.id)}
                  sx={{ 
                    mb: 1,
                    '&:before': { display: 'none' },
                    boxShadow: '0px 2px 8px rgba(0,0,0,0.05)',
                    borderRadius: '8px !important',
                    overflow: 'hidden'
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    id={`${faq.id}-header`}
                    sx={{ 
                      backgroundColor: expanded === faq.id ? 'rgba(0, 0, 0, 0.03)' : 'transparent',
                      '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.03)' }
                    }}
                  >
                    <Typography sx={{ fontWeight: 500 }}>
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )
        ))
      )}

      <Paper sx={{ p: 4, mt: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <EmailIcon color="primary" sx={{ fontSize: 28 }} />
          <Typography variant="h5" sx={{ ml: 1 }}>
            Still have questions?
          </Typography>
        </Box>
        <Typography variant="body1" paragraph>
          If you couldn't find the answer you're looking for, please fill out the form below and our support team will get back to you as soon as possible.
        </Typography>
        
        <form onSubmit={handleContactSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                name="name"
                label="Your Name"
                value={contactForm.name}
                onChange={handleContactFormChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="email"
                label="Email Address"
                type="email"
                value={contactForm.email}
                onChange={handleContactFormChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="message"
                label="Message"
                value={contactForm.message}
                onChange={handleContactFormChange}
                multiline
                rows={4}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                sx={{ px: 4, py: 1 }}
              >
                Submit Request
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success"
          variant="filled"
        >
          Your message has been sent! Our support team will contact you soon.
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SupportPage;