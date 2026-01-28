import { createTheme } from '@mui/material/styles';

// Fyntrac Design System Theme
// Colors and styles matching the primary application
const fyntracTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#5B5FED', // Fyntrac primary purple/indigo
      light: '#7E82F1',
      dark: '#4346C8',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#6C757D', // Gray for secondary actions
      light: '#ADB5BD',
      dark: '#495057',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#4CAF50', // Green for success states
      light: '#66BB6A',
      dark: '#388E3C',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#F44336',
      light: '#E57373',
      dark: '#D32F2F',
    },
    warning: {
      main: '#FFC107',
      light: '#FFD54F',
      dark: '#FFA000',
    },
    info: {
      main: '#2196F3',
      light: '#64B5F6',
      dark: '#1976D2',
    },
    background: {
      default: '#F8F9FA', // Light gray background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#212529', // Dark text
      secondary: '#6C757D', // Medium gray text
      disabled: '#ADB5BD',
    },
    divider: '#CED4DA', // Light gray dividers
    grey: {
      50: '#F8F9FA',
      100: '#F1F3F5',
      200: '#E9ECEF',
      300: '#DEE2E6',
      400: '#CED4DA',
      500: '#ADB5BD',
      600: '#6C757D',
      700: '#495057',
      800: '#343A40',
      900: '#212529',
    },
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    h1: {
      fontSize: '2rem', // 32px
      fontWeight: 700,
      color: '#212529',
      letterSpacing: '-0.01em',
    },
    h2: {
      fontSize: '1.5rem', // 24px
      fontWeight: 600,
      color: '#212529',
    },
    h3: {
      fontSize: '1.25rem', // 20px
      fontWeight: 600,
      color: '#212529',
    },
    h4: {
      fontSize: '1.125rem', // 18px
      fontWeight: 600,
      color: '#212529',
    },
    h5: {
      fontSize: '1rem', // 16px
      fontWeight: 600,
      color: '#212529',
    },
    h6: {
      fontSize: '0.875rem', // 14px
      fontWeight: 600,
      color: '#212529',
    },
    body1: {
      fontSize: '0.875rem', // 14px
      color: '#495057',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.8125rem', // 13px
      color: '#6C757D',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none', // No uppercase
      fontWeight: 500,
      fontSize: '0.875rem',
    },
    caption: {
      fontSize: '0.75rem', // 12px
      color: '#6C757D',
    },
  },
  shape: {
    borderRadius: 8, // Consistent rounded corners
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    '0 2px 4px 0 rgba(0, 0, 0, 0.08)',
    '0 4px 6px -1px rgba(0, 0, 0, 0.08)',
    '0 6px 10px -2px rgba(0, 0, 0, 0.08)',
    '0 8px 16px -4px rgba(0, 0, 0, 0.08)',
    ...Array(18).fill('0 8px 16px -4px rgba(0, 0, 0, 0.08)'),
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: '#ADB5BD #F8F9FA',
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            width: 8,
            height: 8,
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 8,
            backgroundColor: '#ADB5BD',
          },
          '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
            borderRadius: 8,
            backgroundColor: '#F8F9FA',
          },
        },
      },
    },
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
          padding: '4px 12px',
          fontSize: '0.8125rem',
        },
        sizeLarge: {
          padding: '10px 20px',
          fontSize: '0.9375rem',
        },
        contained: {
          '&:hover': {
            boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.12)',
          },
        },
        outlined: {
          borderColor: '#CED4DA',
          color: '#495057',
          '&:hover': {
            borderColor: '#ADB5BD',
            backgroundColor: '#F8F9FA',
          },
        },
        text: {
          '&:hover': {
            backgroundColor: '#F8F9FA',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #E9ECEF',
          backgroundColor: '#FFFFFF',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundImage: 'none',
        },
        outlined: {
          border: '1px solid #E9ECEF',
        },
        elevation1: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        },
        elevation2: {
          boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#FFFFFF',
            '& fieldset': {
              borderColor: '#CED4DA',
            },
            '&:hover fieldset': {
              borderColor: '#ADB5BD',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#5B5FED',
              borderWidth: 2,
            },
          },
          '& .MuiInputBase-input': {
            fontSize: '0.875rem',
            padding: '10px 14px',
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
          color: '#6C757D',
          '&.Mui-selected': {
            color: '#5B5FED',
            fontWeight: 600,
          },
          '&:hover': {
            color: '#5B5FED',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #E9ECEF',
        },
        indicator: {
          backgroundColor: '#5B5FED',
          height: 3,
          borderRadius: '3px 3px 0 0',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: '0 8px 16px -4px rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: '20px 24px',
          fontSize: '1.25rem',
          fontWeight: 600,
          color: '#212529',
          borderBottom: '1px solid #E9ECEF',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '24px',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#E9ECEF',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontSize: '0.75rem',
          fontWeight: 500,
          height: 24,
        },
        colorSuccess: {
          backgroundColor: '#D4EDDA',
          color: '#155724',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: '#F8F9FA',
            color: '#495057',
            fontWeight: 600,
            fontSize: '0.8125rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            padding: '12px 16px',
            borderBottom: '2px solid #DEE2E6',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          padding: '12px 16px',
          borderBottom: '1px solid #E9ECEF',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#F8F9FA',
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#212529',
          fontSize: '0.75rem',
          padding: '6px 12px',
          borderRadius: 6,
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiAlert-root': {
            borderRadius: 8,
            fontSize: '0.875rem',
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          marginBottom: 4,
          '&.Mui-selected': {
            backgroundColor: '#EEF0FE',
            color: '#5B5FED',
            '&:hover': {
              backgroundColor: '#E0E2FD',
            },
            '& .MuiListItemIcon-root': {
              color: '#5B5FED',
            },
          },
          '&:hover': {
            backgroundColor: '#F8F9FA',
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 40,
          color: '#6C757D',
        },
      },
    },
  },
});

export default fyntracTheme;
