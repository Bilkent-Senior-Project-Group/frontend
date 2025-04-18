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
    const response = await axios.put(`${API_URL}/api/User/updateProfile`, profileData, {
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

const UserService = {
  fetchUserProfile,
  updateUserProfile,
};

export default UserService;