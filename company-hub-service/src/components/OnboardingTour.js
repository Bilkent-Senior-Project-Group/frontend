import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Dialog, 
  DialogTitle, 
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  Paper
} from '@mui/material';

const OnboardingTour = ({ isOpen, onClose, userId }) => {
  const [activeStep, setActiveStep] = useState(0);
  // Use a user-specific key for localStorage
  const storageKey = `hasSeenTour_${userId || 'guest'}`;
  
  const [hasSeenTour, setHasSeenTour] = useState(() => {
    // Get stored value on initial render with user-specific key
    return localStorage.getItem(storageKey) === 'true';
  });
  
  // Update localStorage when state changes
  useEffect(() => {
    localStorage.setItem(storageKey, hasSeenTour);
  }, [hasSeenTour, storageKey]);
  
  const steps = [
    {
      title: "Welcome to Company Hub!",
      content: "Discover tech companies, explore projects, and connect with industry professionals all in one place.",
    },
    {
      title: "Explore Company Profiles",
      content: "View detailed company information, services breakdown, and project portfolios to find the right match for your needs.",
    },
    {
      title: "Create and Manage Projects",
      content: "Easily create new projects, track their status, and mark them as completed when done.",
    },
    {
      title: "Connect with Professionals",
      content: "Browse company team members and reach out to professionals directly from their profiles.",
    }
  ];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleFinish = () => {
    setHasSeenTour(true);
    onClose();
  };

  return (
    <Dialog 
      open={isOpen && !hasSeenTour} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          {steps[activeStep].title}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          p: 2 
        }}>
          
          
          <Typography variant="body1" textAlign="center">
            {steps[activeStep].content}
          </Typography>

          <Stepper activeStep={activeStep} sx={{ width: '100%', mt: 4 }}>
            {steps.map((_, index) => (
              <Step key={index}>
                <StepLabel></StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          Back
        </Button>
        <Box sx={{ flex: 1 }} />
        <Button onClick={onClose} color="inherit">
          Skip
        </Button>
        {activeStep === steps.length - 1 ? (
          <Button onClick={handleFinish} variant="contained">
            Get Started
          </Button>
        ) : (
          <Button onClick={handleNext} variant="contained">
            Next
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default OnboardingTour;