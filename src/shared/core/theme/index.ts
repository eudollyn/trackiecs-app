import { createTheme, alpha } from '@mui/material';

const primaryColor = '#4f46e5'; // Indigo 600

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: primaryColor,
      light: alpha(primaryColor, 0.1),
      dark: '#3730a3',
    },
    background: {
      default: '#f8fafc', // Slate 50
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a', // Slate 900
      secondary: '#64748b', // Slate 500
    },
    divider: '#e2e8f0',
  },
  shape: { borderRadius: 12 },
  shadows: [
    'none',
    '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)',
    '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
    '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
    ...Array(21).fill('none')
  ] as any,
  typography: {
    fontFamily: '"Inter", "system-ui", sans-serif',
    h4: { fontWeight: 800, letterSpacing: '-0.02em' },
    h6: { fontWeight: 700, fontSize: '1.1rem' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { 
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' }
        },
        contained: {
          '&:hover': { backgroundColor: '#4338ca' }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' }
      }
    }
  }
});