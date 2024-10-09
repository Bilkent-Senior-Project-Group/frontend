//import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL;  // Base URL for the API

const signup = async (userData) => {
  // return axios.post(`${API_URL}/auth/signup`, userData);
  return {
    status: 200,
    data: {
      message: "Signup successful!",
      user: {
        id: 1,
        firstName: userData.firstName,
        lastName: userData.lastName,
        username: userData.username,
        email: userData.email,
        phoneNumber: userData.phoneNumber
      }
    }
  };

  // return {
  //   status: 400,
  //   data: {
  //     message: "User already exists"
  //   }
  // };

};

const login = async (userData) => {
  // return axios.post(`${API_URL}/auth/login`, { email, password });
  return {
    status: 200,
    data: {
      message: "Login successful!",
      user: {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        username: "JohnDoe1234",
        email: userData.email,
        phoneNumber: "123-456-7890"
      }
    }
  };
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
