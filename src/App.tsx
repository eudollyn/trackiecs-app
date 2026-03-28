import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Toaster } from 'sonner';

import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Musicas from './pages/Musicas';
import Membros from './pages/Membros';
import Eventos from './pages/Eventos'; // Verifique se o arquivo chama Eventos.tsx com E maiúsculo
import LoginPage from './pages/LoginPage';
import StageMode from './pages/StageMode';
import Analytics from './pages/Analytics';

import { theme } from './theme'; 
import { useAppStore } from './store/useAppStore';

export default function App() {
  const isAuth = useAppStore(state => state.isAuth);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster position="top-center" richColors closeButton />
      
      <Routes>
        <Route path="/login" element={!isAuth ? <LoginPage /> : <Navigate to="/" />} />
        
        <Route element={isAuth ? <MainLayout /> : <Navigate to="/login" />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/musicas" element={<Musicas />} />
          <Route path="/membros" element={<Membros />} />
          {/* AQUI: Mudei de /eventos para /escalas para bater com o menu */}
          <Route path="/escalas" element={<Eventos />} />
          <Route path="/palco/:id" element={<StageMode />} />
          <Route path="/analytics" element={<Analytics />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  );
}