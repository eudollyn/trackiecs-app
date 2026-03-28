import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Toaster } from 'sonner';
import { useEffect } from 'react';

import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Musicas from './pages/Musicas';
import Membros from './pages/Membros';
import Eventos from './pages/Eventos'; 
import LoginPage from './pages/LoginPage';
import StageMode from './pages/StageMode';
import Analytics from './pages/Analytics';

import { theme } from './theme'; 
import { useAppStore } from './store/useAppStore';

export default function App() {
  // ADICIONADO: Extrair isAuth e fetchInitialData do store
  const { isAuth, fetchInitialData } = useAppStore();

  useEffect(() => {
    // Carrega os dados do Supabase assim que o app inicia
    fetchInitialData();
  }, [fetchInitialData]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster position="top-center" richColors closeButton />
      
      <Routes>
        {/* Rota pública */}
        <Route path="/login" element={!isAuth ? <LoginPage /> : <Navigate to="/" />} />
        
        {/* Rotas protegidas */}
        <Route element={isAuth ? <MainLayout /> : <Navigate to="/login" />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/musicas" element={<Musicas />} />
          <Route path="/membros" element={<Membros />} />
          <Route path="/escalas" element={<Eventos />} />
          <Route path="/palco/:id" element={<StageMode />} />
          <Route path="/analytics" element={<Analytics />} />
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  );
}