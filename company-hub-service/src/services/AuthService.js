import axios from 'axios';
import { API_URL } from '../config/apiConfig';

const signup = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/api/Account/Register`, userData);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Connection Error Occured.");
  }
};

const login = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/api/Account/Login`, userData);
    return response;  // No need to handle user separately
  } catch (error) {
    throw new Error(error.response?.data?.message || "Connection Error Occured.");
  } 
};

const checkEmailExistence = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/api/Account/CheckEmail`, { email });
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Connection Error Occured.");
  } 
};

const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/api/Account/ForgotPassword`, { email });
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Connection Error Occured.");
  }
};

const logout = async (token) => {
  try {
    const response = await axios.post(`${API_URL}/api/Account/Logout`,null, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
});

    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Connection Error Occured.");
  }
}

export default { signup, login, checkEmailExistence, forgotPassword, logout };
