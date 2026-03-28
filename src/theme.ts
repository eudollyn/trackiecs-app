import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    primary: { main: '#4f46e5', dark: '#3730a3', light: '#818cf8' },
    background: { default: '#f8fafc', paper: '#ffffff' },
    text: { primary: '#0f172a', secondary: '#64748b' },
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: '"Inter", sans-serif',
    h4: { fontWeight: 800, letterSpacing: '-0.02em' },
    h6: { fontWeight: 700 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, borderRadius: 12, padding: '10px 24px' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' },
      },
    },
  },
});