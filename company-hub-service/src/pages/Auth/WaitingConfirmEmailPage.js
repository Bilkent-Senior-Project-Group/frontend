import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, Paper, CircularProgress } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import UserService from '../../services/UserService';
import { useAuth } from '../../contexts/AuthContext';

// Video Background Component - reusing from LoginPage
const VideoBackground = React.memo(({ videoUrl }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        overflow: 'hidden',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark overlay with 40% opacity
          zIndex: 1,
        }
      }}
    >
      <Box
        component="video"
        autoPlay
        muted
        loop
        sx={{
          objectFit: 'cover',
          width: '100%',
          height: '100%',
          position: 'absolute',
        }}
      >
        <source src="/videos/bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </Box>
    </Box>
  );
});

const WaitingConfirmEmailPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [resendStatus, setResendStatus] = useState('');
  const [emailChecked, setEmailChecked] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  const { user, token } = useAuth();
  
  // Update the checkEmailVerification function to always redirect to login
  const checkEmailVerification = useCallback(async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    try {
      const response = await UserService.checkEmailVerification(token);
      console.log("API response emailConfirmed:", response.emailConfirmed);
      
      if (response.emailConfirmed) {
        // Force immediate UI update with state change
        setIsVerified(true);
        setEmailChecked(true);
        
        // Dispatch the custom event
        const verificationEvent = new CustomEvent('emailVerified', { 
          detail: { verified: true }
        });
        window.dispatchEvent(verificationEvent);
        
        // Always redirect to login page after verification, regardless of token
        setTimeout(() => {
          navigate('/login');
        }, 1500);
        
        // Return true to indicate verification was successful
        return true;
      } else {
        setIsVerified(false);
        setEmailChecked(true);
        return false;
      }
    } catch (error) {
      console.error('Error checking email verification:', error);
      setEmailChecked(true);
      return false;
    }
  }, [token, navigate]);
  
  // Completely revise the useEffect to ensure proper state synchronization
  useEffect(() => {
    let intervalId = null;
    
    // Check verification status immediately if we have a token
    if (token && !isVerified) {
      // Initial check
      const performCheck = async () => {
        const verified = await checkEmailVerification();
        
        // Only set up interval if not verified
        if (!verified) {
          intervalId = setInterval(async () => {
            const checkResult = await checkEmailVerification();
            if (checkResult === true) {
              // Clear interval immediately when verified
              clearInterval(intervalId);
            }
          }, 5000);
        }
      };
      
      performCheck();
    } else if (!token) {
      navigate('/login');
    }
    
    // Cleanup function
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [checkEmailVerification, token, navigate, isVerified]);
  
  // Function to resend verification email
  const handleResendEmail = async () => {
    setIsLoading(true);
    setResendStatus('');
    
    try {
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await UserService.sendConfirmationEmail(token);
      
      // The success criteria should be adapted to how your API actually returns success
      // Either checking HTTP status code or a success property in the response body
      setResendStatus('success');
      setTimeout(() => setResendStatus(''), 5000); // Clear success message after 5 seconds
    } catch (error) {
      console.error('Failed to resend verification email:', error);
      setResendStatus('error');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1,
        py: { xs: 6, md: 8 }
      }}
    >
      {/* Video Background */}
      <VideoBackground videoUrl="/videos/bg.mp4" />
      
      {/* Content container */}
      <Container 
        maxWidth="lg" 
        sx={{ 
          position: 'relative', 
          zIndex: 2,
          py: { xs: 4, md: 6 }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            my: { xs: 3, md: 4 }
          }}
        >
          {/* Content card */}
          <Paper 
            elevation={3} 
            sx={{ 
              width: { xs: '100%', md: '500px' },
              bgcolor: 'white',
              borderRadius: 2,
              p: 4,
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
              my: { xs: 2, md: 3 },
              textAlign: 'center'
            }}
          >
            <Box sx={{ mb: 3 }}>
              {isVerified ? (
                <MarkEmailReadIcon color="success" sx={{ fontSize: 60 }} />
              ) : (
                <EmailIcon color="primary" sx={{ fontSize: 60 }} />
              )}
            </Box>
            
            <Typography variant="h4" component="h1" gutterBottom>
              {isVerified ? "Email Verified!" : "Verify Your Email"}
            </Typography>
            
            {isVerified ? (
              <>
                <Typography variant="body1" paragraph>
                  Your email has been successfully verified. You'll be redirected to the dashboard shortly.
                </Typography>
                <CircularProgress size={24} sx={{ mt: 2 }} />
              </>
            ) : (
              <>
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
                  {!isVerified && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleResendEmail}
                      disabled={isLoading || isVerified} // Also disable when verified
                      startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <MarkEmailReadIcon />}
                      sx={{ mb: 2 }}
                    >
                      {isLoading ? 'Sending...' : 'Resend Verification Email'}
                    </Button>
                  )}
                  
                  {resendStatus === 'success' && !isVerified && (
                    <Typography color="success.main" sx={{ mt: 1 }}>
                      Verification email has been resent successfully!
                    </Typography>
                  )}
                  
                  {resendStatus === 'error' && !isVerified && (
                    <Typography color="error.main" sx={{ mt: 1 }}>
                      Failed to resend verification email. Please try again later.
                    </Typography>
                  )}
                </Box>
                
                <Typography variant="body2" color="textSecondary">
                  Once your email is verified, you'll be automatically redirected to the dashboard.
                </Typography>
              </>
            )}
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default WaitingConfirmEmailPage;