import React, { createContext, useContext, useState, useEffect } from "react";
import AuthService from "../services/AuthService"; // Import AuthService for API calls

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Load user from localStorage on app startup
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser)); // Store user in state
      } catch (error) {
        console.error("Invalid token", error);
        logout(); // Clear invalid token
      }
    }
  }, []);

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

  const logout = async () => {
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
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser)); // Save updated user in localStorage
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
