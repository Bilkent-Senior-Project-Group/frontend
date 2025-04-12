// src/components/UI/ThemeToggle.jsx
import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Moon, Sun } from 'lucide-react';  // Using lucide-react icons to match your other components
import { useThemeContext } from '../../contexts/ThemeContext';

const ThemeToggle = () => {
  const { mode, toggleColorMode } = useThemeContext();
  
  console.log("Theme toggle rendering with mode:", mode);
  
  return (
    <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
      <IconButton
        onClick={toggleColorMode}
        color="inherit"
        aria-label="toggle dark/light mode"
        sx={{ ml: 1 }}
      >
        {mode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;