import axios from 'axios';

const API_URL = "http://localhost:5133";  // Base URL for the API

const signup = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/api/Account/Register`, userData);
    return response; // Return the response on success
  } catch (error) {
    const message = error.response?.data?.message || "Connection Error Occured.";
    throw new Error(message);
  }
};

const login = async (userData) => {
  try{
    const response = await axios.post(`${API_URL}/api/Account/Login`, userData);
    return response;
  } catch (error) {
    const message = error.response?.data?.message || "Connection Error Occured.";
    throw new Error(message);
  } 
};

const checkEmailExistence = async (email) => {
  // Simulate an API call to check if the email exists in the system
  if (email === "deneme@gmail.com") {
    return { status: 200, data: { exists: true } }; // Email exists
  }
  return { status: 200, data: { exists: false } }; // Email does not exist
};

// Add forgotPassword function
const forgotPassword = async (email) => {
  // Simulate an API call to send a password reset link
  if (email === "deneme@gmail.com") {
    return {
      status: 200,
      data: {
        message: "Password reset link sent to your email."
      }
    };
  }
  return {
    status: 400,
    data: {
      message: "Email not found."
    }
  };
};

const AuthService = {
  signup,
  login,
  checkEmailExistence,
  forgotPassword
};

export default AuthService;
