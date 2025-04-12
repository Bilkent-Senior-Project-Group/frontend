// src/contexts/ThemeContext.jsx
import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';

// Create the context
const ThemeContext = createContext(undefined);

// Provider component
export const ThemeProvider = ({ children }) => {
  // Check if user has a preference saved in localStorage
  const [mode, setMode] = useState(() => {
    try {
      const savedMode = localStorage.getItem('themeMode');
      return savedMode || 'light';
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      return 'light';
    }
  });

  // Toggle between light and dark mode
  const toggleColorMode = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem('themeMode', newMode);
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
      return newMode;
    });
  };

  // Memoize the context value to prevent unnecessary renders
  const value = useMemo(
    () => ({
      mode,
      toggleColorMode,
    }),
    [mode]
  );

  // Add debugging console.log
  useEffect(() => {
    console.log("Current theme mode:", mode);
  }, [mode]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};