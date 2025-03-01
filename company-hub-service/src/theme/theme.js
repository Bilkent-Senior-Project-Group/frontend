import { createTheme } from '@mui/material/styles';

// Define our custom colors
const colors = {
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
  }
};

const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary[500],
      light: colors.primary[300],
      dark: colors.primary[700],
      contrastText: '#FFFFFF',
    },
    background: {
      default: colors.neutral[50],
      paper: '#FFFFFF',
    },
    text: {
      primary: colors.neutral[800],
      secondary: colors.neutral[600],
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
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '3.5rem',
      color: colors.neutral[800],
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '3rem',
      color: colors.neutral[800],
      letterSpacing: '-0.02em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '2.25rem',
      color: colors.neutral[800],
      letterSpacing: '-0.01em',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.875rem',
      color: colors.neutral[800],
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.5rem',
      color: colors.neutral[800],
    },
    h6: {
      fontWeight: 500,
      fontSize: '1.25rem',
      color: colors.neutral[800],
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
          background: colors.gradients.accent,
          '&:hover': {
            background: colors.gradients.primary,
          },
        },
        outlined: {
          borderColor: colors.primary[400],
          color: colors.primary[500],
          '&:hover': {
            borderColor: colors.primary[500],
            backgroundColor: colors.primary[50],
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: `1px solid ${colors.neutral[200]}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: colors.primary[300],
            transform: 'translateY(-2px)',
            boxShadow: `0 4px 12px ${colors.primary[100]}`,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: `0 2px 8px ${colors.neutral[200]}`,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          backgroundColor: colors.primary[100],
          color: colors.primary[600],
          fontWeight: 500,
          '&:hover': {
            backgroundColor: colors.primary[200],
          },
        },
        filled: {
          backgroundColor: colors.primary[500],
          color: '#fff',
          '&:hover': {
            backgroundColor: colors.primary[600],
          },
        },
        outlined: {
          borderColor: colors.primary[300],
          color: colors.primary[500],
          '&:hover': {
            backgroundColor: colors.primary[50],
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: colors.neutral[300],
              transition: 'all 0.2s ease',
            },
            '&:hover fieldset': {
              borderColor: colors.primary[400],
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.primary[500],
              boxShadow: `0 0 0 3px ${colors.primary[100]}`,
            },
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: colors.neutral[100],
        },
        bar: {
          borderRadius: 4,
          background: colors.gradients.accent,
        },
      },
    },
  },
});

export { colors };
export default theme;