import { createTheme, alpha } from '@mui/material/styles';

const brandPrimary = '#4F46E5'; // Indigo vibrante profissional
const brandSecondary = '#0F172A'; // Slate 900 (Textos/Sidebars)

export const theme = createTheme({
  palette: {
    primary: {
      main: brandPrimary,
      light: alpha(brandPrimary, 0.1),
      dark: '#3730A3',
    },
    background: {
      default: '#F8FAFC', 
      paper: '#FFFFFF',
    },
    text: {
      primary: brandSecondary,
      secondary: '#64748B', 
    },
    divider: '#E2E8F0',
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: '"Inter", "system-ui", sans-serif',
    h4: { fontWeight: 800, letterSpacing: '-0.025em' },
    h6: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
          border: `1px solid ${alpha('#E2E8F0', 0.8)}`,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { 
          boxShadow: 'none',
          borderRadius: 10,
          '&:hover': { boxShadow: 'none' } 
        },
      },
    },
  },
});