import { createTheme } from '@mui/material/styles';

// Create a custom MUI theme matching the current design system
// Neutral, minimalist design with slate color palette
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb', // blue-600
      light: '#3b82f6', // blue-500
      dark: '#1d4ed8', // blue-700
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#6366f1', // indigo-600
      light: '#818cf8', // indigo-400
      dark: '#4f46e5', // indigo-700
      contrastText: '#ffffff',
    },
    error: {
      main: '#dc2626', // red-600
      light: '#ef4444', // red-500
      dark: '#b91c1c', // red-700
    },
    warning: {
      main: '#f59e0b', // amber-500
      light: '#fbbf24', // amber-400
      dark: '#d97706', // amber-600
    },
    info: {
      main: '#0ea5e9', // sky-500
      light: '#38bdf8', // sky-400
      dark: '#0284c7', // sky-600
    },
    success: {
      main: '#10b981', // emerald-500
      light: '#34d399', // emerald-400
      dark: '#059669', // emerald-600
    },
    background: {
      default: '#f8fafc', // slate-50
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a', // slate-900
      secondary: '#475569', // slate-600
      disabled: '#94a3b8', // slate-400
    },
    divider: '#e2e8f0', // slate-200
  },
  typography: {
    fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    h1: {
      fontSize: '1.5rem', // text-2xl
      fontWeight: 700,
      letterSpacing: '-0.025em', // tracking-tight
      color: '#0f172a', // slate-900
    },
    h2: {
      fontSize: '1.25rem', // text-xl
      fontWeight: 600,
      color: '#0f172a',
    },
    h3: {
      fontSize: '1.125rem', // text-lg
      fontWeight: 600,
      color: '#0f172a',
    },
    body1: {
      fontSize: '0.875rem', // text-sm
      color: '#475569', // slate-600
    },
    body2: {
      fontSize: '0.75rem', // text-xs
      color: '#64748b', // slate-500
    },
    button: {
      textTransform: 'none', // No uppercase transformation
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8, // Slightly rounded corners
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgb(0 0 0 / 0.05)', // shadow-sm
    '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)', // shadow
    '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', // shadow-md
    '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', // shadow-lg
    '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', // shadow-xl
    '0 25px 50px -12px rgb(0 0 0 / 0.25)', // shadow-2xl
    ...Array(18).fill('0 25px 50px -12px rgb(0 0 0 / 0.25)'), // Fill remaining shadow levels
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          fontSize: '0.875rem',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        sizeSmall: {
          padding: '6px 12px',
          fontSize: '0.875rem',
        },
        sizeLarge: {
          padding: '10px 20px',
          fontSize: '1rem',
        },
        outlined: {
          borderColor: '#cbd5e1', // slate-300
          color: '#475569', // slate-600
          '&:hover': {
            borderColor: '#94a3b8', // slate-400
            backgroundColor: '#f8fafc', // slate-50
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          border: '1px solid #e2e8f0', // slate-200
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        outlined: {
          border: '1px solid #e2e8f0', // slate-200
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': {
              borderColor: '#cbd5e1', // slate-300
            },
            '&:hover fieldset': {
              borderColor: '#94a3b8', // slate-400
            },
            '&.Mui-focused fieldset': {
              borderColor: '#2563eb', // blue-600
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: '0.875rem',
          fontWeight: 500,
          minHeight: 48,
          '&.Mui-selected': {
            color: '#2563eb', // blue-600
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#2563eb', // blue-600
          height: 2,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#e2e8f0', // slate-200
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#1e293b', // slate-800
          fontSize: '0.75rem',
          borderRadius: 6,
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiAlert-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

export default theme;
