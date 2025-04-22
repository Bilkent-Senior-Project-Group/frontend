import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import EmailVerificationPopup from './EmailVerificationPopup';
import UserService from '../services/UserService';

const VerifiedRoute = ({ children }) => {
    const { user, token } = useAuth();
    const [emailChecked, setEmailChecked] = useState(false);
    const navigate = useNavigate();
    const [isVerified, setIsVerified] = useState(false);

  const checkEmailVerification = useCallback(async () => {
    if (!token) return;
    
    try {
      console.log("token:", token);
      const response = await UserService.checkEmailVerification(token);
      
      if (response.emailConfirmed) {
        setIsVerified(true);
        setEmailChecked(true);
      } else {
        setIsVerified(false);
        setEmailChecked(false);
      }
      
      console.log("API response emailConfirmed:", response.emailConfirmed);
    } catch (error) {
      console.error('Error checking email verification:', error);
      setEmailChecked(false);
    }
  }, [token]);

  useEffect(() => {
    let intervalId;
    
    // Only check for verification if we have a user and token
    if (user && token) {
      checkEmailVerification();
      
      // Only setup interval if email is not checked yet
      if (!emailChecked && !isVerified) {
        intervalId = setInterval(() => {
          checkEmailVerification();
        }, 5000);
      }
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [checkEmailVerification, emailChecked, isVerified, user, token]);

  // If user exists but isn't verified, show the popup
  if (user && !isVerified) {
    return (
      <>
        <EmailVerificationPopup 
          open={true} 
          onClose={() => window.history.back()} 
        />
      </>
    );
  }

  // User is verified or no user (handled by other auth routes)
  return children;
};

export default VerifiedRoute;