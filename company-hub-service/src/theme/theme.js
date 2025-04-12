// src/theme/theme.js
import { createTheme } from '@mui/material/styles';

// Define our custom colors
export const colors = {
  primary: {
    100: '#EBF3FF',  // Lightest indigo blue - backgrounds
    200: '#C9DDFF',  // Light indigo blue - subtle elements
    300: '#94B8FF',  // Medium indigo blue - borders
    400: '#4B7BFF',  // Vivid indigo blue - secondary elements
    500: '#2855D1',  // Main indigo blue - primary actions
    600: '#1E3FA3',  // Dark indigo blue - hover states
    700: '#162C76',  // Deepest indigo blue - emphasis
  },
  neutral: {
    50: '#FAFBFC',   // Lightest background
    100: '#F2F4F7',  // Light background
    200: '#E3E8EF',  // Borders
    300: '#CDD5DF',  // Disabled states
    400: '#9AA4B2',  // Secondary text
    500: '#697586',  // Muted text
    600: '#4B5565',  // Body text
    700: '#364152',  // Strong text
    800: '#202939',  // Headings
    900: '#121926',  // Emphasis
  },
  accent: {
    success: '#16A34F',    // Vibrant but professional green
    warning: '#D97706',    // Warm orange
    error: '#DC2626',      // Clear red
    info: '#2563EB',       // Bright blue
  },
  gradients: {
    primary: 'linear-gradient(45deg, #162C76 30%, #2855D1 90%)',
    secondary: 'linear-gradient(45deg, #1E3FA3 30%, #4B7BFF 90%)',
    accent: 'linear-gradient(45deg, #2855D1 30%, #4B7BFF 90%)',
  },
  // Dark mode specific colors
  dark: {
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    neutral: {
      50: '#29292a',   // Darkest background (replaces lightest in light mode)
      100: '#333336',  // Dark background
      200: '#494950',  // Borders
      300: '#606069',  // Disabled states
      400: '#8d8d99',  // Secondary text
      500: '#aeaeb9',  // Muted text
      600: '#cfcfd8',  // Body text
      700: '#e3e3ec',  // Strong text
      800: '#f1f1fa',  // Headings
      900: '#ffffff',  // Emphasis
    },
    primary: {
      100: '#162C76',  // Deepest becomes lightest in dark mode
      200: '#1E3FA3',  // Color shift for dark theme
      300: '#2855D1',  
      400: '#4B7BFF',
      500: '#94B8FF',  // Brighter color for primary in dark mode
      600: '#C9DDFF',
      700: '#EBF3FF',
    },
  }
};

// Function to create theme based on mode
export const getTheme = (mode = 'light') => {
  console.log("Creating theme with mode:", mode);
  
  return createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'dark' ? colors.primary[400] : colors.primary[500],
        light: mode === 'dark' ? colors.primary[300] : colors.primary[300],
        dark: mode === 'dark' ? colors.primary[600] : colors.primary[700],
        contrastText: mode === 'dark' ? '#000000' : '#FFFFFF',
      },
      secondary: {
        main: mode === 'dark' ? colors.primary[300] : colors.primary[400],
      },
      background: {
        default: mode === 'dark' ? colors.dark.background.default : colors.neutral[50],
        paper: mode === 'dark' ? colors.dark.background.paper : '#FFFFFF',
      },
      text: {
        primary: mode === 'dark' ? colors.dark.neutral[800] : colors.neutral[800],
        secondary: mode === 'dark' ? colors.dark.neutral[600] : colors.neutral[600],
      },
      error: {
        main: colors.accent.error,
      },
      warning: {
        main: colors.accent.warning,
      },
      success: {
        main: colors.accent.success,
      },
      info: {
        main: colors.accent.info,
      },
      // Add this to ensure appropriate contrast in various elements
      divider: mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
        fontSize: '3.5rem',
        color: mode === 'dark' ? colors.dark.neutral[800] : colors.neutral[800],
        letterSpacing: '-0.02em',
      },
      h2: {
        fontWeight: 700,
        fontSize: '3rem',
        color: mode === 'dark' ? colors.dark.neutral[800] : colors.neutral[800],
        letterSpacing: '-0.02em',
      },
      h3: {
        fontWeight: 600,
        fontSize: '2.25rem',
        color: mode === 'dark' ? colors.dark.neutral[800] : colors.neutral[800],
        letterSpacing: '-0.01em',
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.875rem',
        color: mode === 'dark' ? colors.dark.neutral[800] : colors.neutral[800],
      },
      h5: {
        fontWeight: 500,
        fontSize: '1.5rem',
        color: mode === 'dark' ? colors.dark.neutral[800] : colors.neutral[800],
      },
      h6: {
        fontWeight: 500,
        fontSize: '1.25rem',
        color: mode === 'dark' ? colors.dark.neutral[800] : colors.neutral[800],
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
        letterSpacing: '0.02em',
      },
      subtitle1: {
        fontSize: '1.125rem',
        fontWeight: 500,
        letterSpacing: '0.02em',
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition: 'background-color 0.3s ease, color 0.3s ease',
            backgroundColor: mode === 'dark' ? colors.dark.background.default : colors.neutral[50],
            color: mode === 'dark' ? colors.dark.neutral[600] : colors.neutral[800],
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
          contained: {
            background: mode === 'dark' ? colors.primary[400] : colors.gradients.accent,
            color: mode === 'dark' ? '#000000' : '#FFFFFF',
            '&:hover': {
              background: mode === 'dark' ? colors.primary[300] : colors.gradients.primary,
            },
          },
          outlined: {
            borderColor: mode === 'dark' ? colors.primary[400] : colors.primary[400],
            color: mode === 'dark' ? colors.primary[400] : colors.primary[500],
            '&:hover': {
              borderColor: mode === 'dark' ? colors.primary[300] : colors.primary[500],
              backgroundColor: mode === 'dark' ? 'rgba(75, 123, 255, 0.1)' : colors.primary[50],
            },
          },
          text: {
            color: mode === 'dark' ? colors.primary[400] : colors.primary[500],
            '&:hover': {
              backgroundColor: mode === 'dark' ? 'rgba(75, 123, 255, 0.1)' : colors.primary[50],
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            border: mode === 'dark' 
              ? `1px solid ${colors.dark.neutral[200]}` 
              : `1px solid ${colors.neutral[200]}`,
            transition: 'all 0.3s ease',
            backgroundColor: mode === 'dark' ? colors.dark.background.paper : '#FFFFFF',
            '&:hover': {
              borderColor: mode === 'dark' ? colors.primary[400] : colors.primary[300],
              transform: 'translateY(-2px)',
              boxShadow: mode === 'dark' 
                ? `0 4px 12px rgba(75, 123, 255, 0.2)` 
                : `0 4px 12px ${colors.primary[100]}`,
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            backgroundColor: mode === 'dark' ? colors.dark.background.paper : '#FFFFFF',
          },
          elevation1: {
            boxShadow: mode === 'dark' 
              ? '0 2px 8px rgba(0, 0, 0, 0.5)' 
              : `0 2px 8px ${colors.neutral[200]}`,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? colors.dark.background.paper : '#FFFFFF',
            color: mode === 'dark' ? colors.dark.neutral[700] : colors.neutral[800],
          },
        }
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === 'dark' ? colors.dark.background.paper : '#FFFFFF',
            borderRight: mode === 'dark' 
              ? `1px solid ${colors.dark.neutral[200]}` 
              : `1px solid ${colors.neutral[200]}`,
          },
        }
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: mode === 'dark' ? colors.dark.neutral[600] : colors.neutral[600],
            '&:hover': {
              backgroundColor: mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.08)' 
                : 'rgba(0, 0, 0, 0.04)',
            },
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            '&:hover': {
              backgroundColor: mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.08)' 
                : 'rgba(0, 0, 0, 0.04)',
            },
            '&.Mui-selected': {
              backgroundColor: mode === 'dark' 
                ? 'rgba(75, 123, 255, 0.16)' 
                : colors.primary[50],
              color: mode === 'dark' ? colors.primary[400] : colors.primary[600],
              '&:hover': {
                backgroundColor: mode === 'dark' 
                  ? 'rgba(75, 123, 255, 0.24)' 
                  : colors.primary[100],
              },
            },
          },
        },
      },
    },
  });
};

// For backward compatibility
const defaultTheme = getTheme('light');
export default defaultTheme;