import React, { useState } from 'react';
import UserService from '../services/UserService';
import { useAuth } from '../contexts/AuthContext';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress } from '@mui/material';

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
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Email Verification Required</DialogTitle>
      <DialogContent>
        <DialogContentText>
          You need to verify your email address before creating a company.
          {error && (
            <p style={{ color: 'red' }}>{error}</p>
          )}
          {sent && (
            <p style={{ color: 'green' }}>Verification email sent successfully! Please check your inbox.</p>
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
        <Button 
          onClick={handleResendEmail} 
          color="primary" 
          disabled={sending || sent}
          variant="contained"
        >
          {sending ? <CircularProgress size={24} /> : "Resend Verification Email"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailVerificationPopup;