// src/App.jsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider as MUIThemeProvider, CssBaseline } from '@mui/material';
import { ThemeProvider, useThemeContext } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext'; // Import AuthProvider
import { getTheme } from './theme/theme';
import AppRoutes from './routes/AppRoutes';

// Separate component to use the context hook
const ThemedApp = () => {
  const { mode } = useThemeContext();
  const theme = React.useMemo(() => getTheme(mode), [mode]);
  
  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      <AppRoutes />
    </MUIThemeProvider>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider> {/* Add AuthProvider here */}
        <ThemeProvider>
          <ThemedApp />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;