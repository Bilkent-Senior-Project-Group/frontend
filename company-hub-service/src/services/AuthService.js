import axios from 'axios';

const API_URL = "http://localhost:5133"; 

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

export default { signup, login, checkEmailExistence, forgotPassword };
