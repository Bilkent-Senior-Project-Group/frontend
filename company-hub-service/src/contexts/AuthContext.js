import React, { createContext, useContext, useState, useEffect } from "react";
import AuthService from "../services/AuthService"; // Import AuthService for API calls
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config/apiConfig';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const location = useLocation();

  const logout = React.useCallback(async () => {
    try {
      if (token) {
        await AuthService.logout(token);
        console.log("Logout successful");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null); // Reset token state
    setUser(null); // Reset user state
  }, [token]);

  // Load user from localStorage on app startup
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        if (!isTokenValid(storedToken)) {
          console.log("Token is not valid, logging out...");
          logout();
        } else {
          setToken(storedToken);
          setUser(JSON.parse(storedUser)); // Store user in state
        }
      } catch (error) {
        console.error("Invalid token", error);
        logout(); // Clear invalid token
      }
    }
  }, [location, logout]);

  const login = async (email, password) => {
    try {
      const response = await AuthService.login({ email, password });
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        setToken(response.data.token);
        setUser(response.data.user);
        console.log("Login successful response is:", response.data);
        return { success: true };
      }
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await AuthService.signup(userData);
      
      // If registration is successful and returns token and user data
      if (response.data && response.data.token) {
        // Store token and user in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        // Update context state
        setToken(response.data.token);
        setUser(response.data.user);
        
        console.log("Signup successful, token stored");
      }
      
      return { 
        success: true, 
        data: response.data,
        requiresEmailVerification: true // Assuming your app requires email verification
      };
    } catch (error) {
      console.error("Signup error:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || "Connection Error Occurred." 
      };
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser)); // Save updated user in localStorage
  };

  const isTokenValid = async (token) => {
    if (!token) return false;
  
    try {
      // const response = await AuthService.validateToken(token);
      const response = {status: 200}; // Mock response for testing
      if (response.status === 200) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error("Failed to decode token", err);
      return true;
    }
  };
  

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      logout, 
      signup, // Added signup to the context
      updateUser, 
      isTokenValid 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;