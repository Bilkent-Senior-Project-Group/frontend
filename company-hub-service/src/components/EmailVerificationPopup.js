import React, { useState } from 'react';
import UserService from '../services/UserService';
import { useAuth } from '../contexts/AuthContext';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress, Box, Typography } from '@mui/material';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';

const EmailVerificationPopup = ({ open, onClose }) => {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const handleResendEmail = async () => {
    try {
      setSending(true);
      setError(null);
      await UserService.sendConfirmationEmail(token);
      setSent(true);
    } catch (err) {
      setError('Failed to send verification email. Please try again later.');
      console.error('Error sending confirmation email:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        Verify Your Email to Unlock Full Features
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <MarkEmailReadIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
          <DialogContentText sx={{ textAlign: 'center' }}>
            To create companies and access all features, please verify your email address.
            {error && (
              <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>
            )}
            {sent && (
              <Typography color="success.main" sx={{ mt: 1, fontWeight: 500 }}>
                Verification email sent! Please check your inbox and spam folder.
              </Typography>
            )}
          </DialogContentText>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 3, flexDirection: 'column', gap: 1 }}>
        <Button 
          onClick={handleResendEmail} 
          color="primary" 
          disabled={sending || sent}
          variant="contained"
          fullWidth
          size="large"
          startIcon={sending ? <CircularProgress size={20} /> : <MarkEmailReadIcon />}
          sx={{ borderRadius: 2 }}
        >
          {sending ? "Sending..." : sent ? "Email Sent" : "Send Verification Email"}
        </Button>
        <Button 
          onClick={onClose} 
          color="inherit" 
          sx={{ mt: 1 }}
        >
          I'll do this later
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailVerificationPopup;