import axios from 'axios';
import { API_URL } from '../config/apiConfig';

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
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw error;
  }
};

const updateProfilePhoto = async (file, token) => {
  if (!(file instanceof File)) {
    throw new Error("You must pass a File object to updateProfilePhoto");
  }
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post(
    `${API_URL}/api/User/UploadProfilePhoto`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        // NOTE: you do NOT need to set Content-Type manually; axios
        // will set multipart/form-data with the correct boundary.
      },
    }
  );
  return response.data; // { message, photoUrl }
};

const changePassword = async (currentPassword, newPassword, token) => {
  try {
    const response = await axios.post(`${API_URL}/api/Account/ChangePassword`, {
      currentPassword,
      newPassword,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error changing password:', error);
    throw new Error('Failed to change password');
  }
}

const sendSupportMessage = async (name, email, message) => {
  try {
    const response = await axios.post(`${API_URL}/api/User/SendSupportMessage`, {
      name,
      email,
      message,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error sending support message:', error);
    throw new Error('Failed to send support message');
  }
};



const UserService = {
  fetchUserProfile,
  updateUserProfile,
  checkEmailVerification,
  sendConfirmationEmail,
  updateProfilePhoto,
  changePassword,
  sendSupportMessage,
};

export default UserService;