import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  IconButton,
  Tab,
  Tabs,
  TextField,
  InputAdornment,
  Collapse
} from '@mui/material';
import { 
  Search, 
  HelpCircle, 
  X, 
  ChevronRight, 
  Video, 
  FileText, 
  Link as LinkIcon
} from 'lucide-react';

const HelpCenter = ({ open, onClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [openQuestions, setOpenQuestions] = useState({});

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const toggleQuestion = (index) => {
    setOpenQuestions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const faqs = [
    {
      question: "How do I create a company profile?",
      answer: "To create a company profile, 'Add Company'. Fill in the required information about your company including name, description, services, and contact details. Once submitted, your company will be pending verification."
    },
    {
      question: "What is project completion status?",
      answer: "Project completion status indicates whether a project has been marked as completed by both the client and provider companies. When both parties mark a project as complete, the project status changes to 'Completed'."
    },
    {
      question: "How do I upload a company logo?",
      answer: "As a company owner, you can upload a logo by navigating to your company's profile page. Click on the edit icon next to the logo placeholder, then select a PNG file to upload."
    },
    {
      question: "How do I manage my projects?",
      answer: "To manage your projects, go to the 'Projects' section in your dashboard. Here you can view, edit, and update the status of your projects."
    }
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid',
        borderColor: 'divider',
        pb: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <HelpCircle size={24} style={{ marginRight: 12 }} />
          <Typography variant="h6">Help Center</Typography>
        </Box>
        <IconButton onClick={onClose} edge="end">
          <X size={20} />
        </IconButton>
      </DialogTitle>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="help center tabs">
          <Tab label="FAQ" id="tab-0" />
          
          <Tab label="Contact Support" id="tab-1" />
        </Tabs>
      </Box>
      
      <DialogContent sx={{ p: 3 }}>
        <TextField
          fullWidth
          placeholder="Search for help..."
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} />
              </InputAdornment>
            )
          }}
        />
        
        {activeTab === 0 && (
          <List sx={{ width: '100%' }} component="nav">
            {faqs.map((faq, index) => (
              <React.Fragment key={index}>
                <ListItemButton onClick={() => toggleQuestion(index)}>
                  <ListItemText primary={faq.question} />
                  <ChevronRight 
                    size={20} 
                    style={{ 
                      transform: openQuestions[index] ? 'rotate(90deg)' : 'none',
                      transition: 'transform 0.3s'
                    }} 
                  />
                </ListItemButton>
                <Collapse in={openQuestions[index]} timeout="auto" unmountOnExit>
                  <Box sx={{ p: 3, bgcolor: 'background.default', borderRadius: 1, mb: 1 }}>
                    <Typography variant="body2">{faq.answer}</Typography>
                  </Box>
                </Collapse>
              </React.Fragment>
            ))}
          </List>
        )}
        
        
        
        {activeTab === 1 && (
          <Box sx={{ py: 2 }}>
            <Typography variant="body1" paragraph>
              Need personalized help? Our support team is ready to assist you.
            </Typography>
            
            <Typography variant="body2" paragraph>
              You can reach us through:
            </Typography>
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                • Email: <Typography component="span" color="primary" sx={{ ml: 1 }}>compediacorp@gmail.com</Typography>
              </Typography>

            </Box>
            
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default HelpCenter;