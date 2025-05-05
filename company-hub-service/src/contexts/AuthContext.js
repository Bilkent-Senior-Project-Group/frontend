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
  const [isAdmin, setIsAdmin] = useState(false); // State to track admin status
  const location = useLocation();
  const [loading, setLoading] = useState(true);

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
    localStorage.removeItem("similar_companies_cache");
    localStorage.removeItem("discover_services_cache");
    localStorage.removeItem("discover_companies_cache");
    localStorage.removeItem("isAdmin"); // Remove isAdmin from localStorage
    setIsAdmin(false); // Reset isAdmin state
    setToken(null); // Reset token state
    setUser(null); // Reset user state
  }, [token]);

  // Load user from localStorage on app startup
  useEffect(() => {
    (async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser  = localStorage.getItem("user");
      const storedAdmin = localStorage.getItem("isAdmin");
      if (storedToken && storedUser) {
        const valid = await isTokenValid(storedToken);
        if (!valid) {
          logout();
        } else {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setIsAdmin(storedAdmin === "true");
        }
      }
      setLoading(false);
    })();
  }, [location, logout]);
  

  const login = async (email, password) => {
    try {
      const response = await AuthService.login({ email, password });
      if (response.status === 200) {
        const isUserAdmin = response.data.isAdmin === true;
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));


        localStorage.setItem("isAdmin", isUserAdmin.toString()); // Save isAdmin status in localStorage as string

        setToken(response.data.token);
        setUser(response.data.user);
        setIsAdmin(isUserAdmin); // Set isAdmin state directly with boolean
        console.log("Login successful response is:", response.data);
        return { success: true };
      }
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const signup = async (userData) => {
    try {
      const responseData = await AuthService.signup(userData);
      
      // If registration is successful and returns token and user data
      if (responseData && responseData.token.result) {
        // Store token and user in localStorage
        localStorage.setItem("token", responseData.token.result);
        // localStorage.setItem("user", JSON.stringify(responseData.user));
        
        // Update context state
        setToken(responseData.token.result);
        // setUser(response.data.user);
        
        console.log("Signup successful, token stored");
      }
      
      return { 
        success: true, 
        data: responseData,
        requiresEmailVerification: true // Assuming your app requires email verification
      };
    } catch (error) {
      console.error("Signup error:", error);
      return { 
        success: false, 
        message: error.responseData?.message || "Connection Error Occurred." 
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

    <AuthContext.Provider value={{ user, token, isAdmin, login, logout, updateUser, isTokenValid, loading, signup }}>

      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
