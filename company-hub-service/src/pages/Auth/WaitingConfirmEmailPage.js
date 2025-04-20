import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, Paper, CircularProgress } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import UserService from '../../services/UserService';
import { useAuth } from '../../contexts/AuthContext';

const WaitingConfirmEmailPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [resendStatus, setResendStatus] = useState('');
  const [emailChecked, setEmailChecked] = useState(false);
  const navigate = useNavigate();
  
  // Function to check if email has been verified
  const checkEmailVerification = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      setEmailChecked(true);
      const isVerified = await UserService.checkEmailVerification(token);
      
      if (isVerified) {
        setEmailChecked(true);
      } else {
        setEmailChecked(false);
      }
    } catch (error) {
      console.error('Error checking email verification:', error);
      setEmailChecked(false);
    }
  };
  
  // Function to resend verification email
  const handleResendEmail = async () => {
    setIsLoading(true);
    setResendStatus('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await UserService.sendConfirmationEmail(token);
      if (response.status !== 200) {
        throw new Error('Failed to resend verification email');
      }
      setResendStatus('success');
      setTimeout(() => setResendStatus(''), 5000); // Clear success message after 5 seconds
    } catch (error) {
      console.error('Failed to resend verification email:', error);
      setResendStatus('error');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Check email verification status every 10 seconds
useEffect(() => {
    checkEmailVerification();
    
    const intervalId = setInterval(() => {
        if (!emailChecked) {
            checkEmailVerification();
        }
    }, 5000); // Reduced interval to 5 seconds
    
    return () => clearInterval(intervalId);
}, []);
  
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Box sx={{ mb: 3 }}>
          <EmailIcon color="primary" sx={{ fontSize: 60 }} />
        </Box>
        
        <Typography variant="h4" component="h1" gutterBottom>
          Verify Your Email
        </Typography>
        
        <Typography variant="body1" paragraph>
          We've sent a verification email to the registered email address.
        </Typography>
        
        <Typography variant="body1" paragraph>
          Please check your inbox and click on the verification link to complete your registration.
          The email might take a few minutes to arrive.
        </Typography>
        
        <Typography variant="body1" paragraph sx={{ fontStyle: 'italic' }}>
          Don't forget to check your spam or junk folder if you can't find the email in your inbox.
        </Typography>
        
        <Box sx={{ my: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleResendEmail}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <MarkEmailReadIcon />}
            sx={{ mb: 2 }}
          >
            {isLoading ? 'Sending...' : 'Resend Verification Email'}
          </Button>
          
          {resendStatus === 'success' && (
            <Typography color="success.main" sx={{ mt: 1 }}>
              Verification email has been resent successfully!
            </Typography>
          )}
          
          {resendStatus === 'error' && (
            <Typography color="error.main" sx={{ mt: 1 }}>
              Failed to resend verification email. Please try again later.
            </Typography>
          )}
        </Box>
        
        <Typography variant="body2" color="textSecondary">
          Once your email is verified, you'll be automatically redirected to the dashboard.
        </Typography>
      </Paper>
    </Container>
  );
};

export default WaitingConfirmEmailPage;