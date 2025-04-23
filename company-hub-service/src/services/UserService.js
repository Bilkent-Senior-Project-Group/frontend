import axios from 'axios';
import { API_URL } from '../config/apiConfig';
import { useAuth } from '../contexts/AuthContext';

const fetchUserProfile = async (username, token) => {
  try {
    const response = await axios.get(`${API_URL}/api/User/GetUserProfileByUsername/${username}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw new Error('Failed to load profile data');
  }
};

const updateUserProfile = async (profileData, token) => {
  try {
    const response = await axios.put(`${API_URL}/api/User/UpdateUserProfile`, profileData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw new Error('Failed to update profile');
  }
};

const checkEmailVerification = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/api/Account/GetEmailConfirmed`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;  // Return the complete response data object
  } catch (error) {
    console.error('Error checking email verification:', error);
    throw new Error('Failed to check email verification status');
  }
};

const sendConfirmationEmail = async (token) => {
  try {
    const response = await axios.post(`${API_URL}/api/Account/SendConfirmationEmail`, {}, {
      headers: {
        'Content-Type': 'application/json',
         } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw new Error('Failed to send confirmation email');
  }
}

const updateProfilePhoto = async (file, token) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(`${API_URL}/api/User/UploadProfilePhoto`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',

        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  }
  catch (error) {
    console.error('Error updating profile photo:', error);
    throw new Error('Failed to update profile photo');
  }
};


const UserService = {
  fetchUserProfile,
  updateUserProfile,
  checkEmailVerification,
  sendConfirmationEmail,
  updateProfilePhoto,
};

export default UserService;