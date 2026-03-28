import React from 'react';
import { Box, Button, Typography, Paper, Stack, TextField, InputAdornment } from '@mui/material';
import { Mail, Lock, Music4 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function LoginPage() {
  const login = useAppStore((state) => state.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(); // No nosso store simplificado, ele apenas muda isAuth para true
  };

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
      p: 2
    }}>
      <Paper elevation={24} sx={{ 
        p: { xs: 4, md: 6 }, 
        width: '100%', 
        maxWidth: 450, 
        borderRadius: 8,
        textAlign: 'center'
      }}>
        <Stack spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <Box sx={{ 
            width: 60, 
            height: 60, 
            bgcolor: 'primary.main', 
            borderRadius: 4, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'white',
            mb: 1
          }}>
            <Music4 size={32} />
          </Box>
          <Typography variant="h4" fontWeight={900} color="primary">
            TrackIECS
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gestão inteligente para ministérios de louvor
          </Typography>
        </Stack>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="E-mail"
              placeholder="seu@email.com"
              defaultValue="admin@igreja.com"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail size={20} color="#94a3b8" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Senha"
              type="password"
              placeholder="••••••••"
              defaultValue="123456"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock size={20} color="#94a3b8" />
                  </InputAdornment>
                ),
              }}
            />
            <Button 
              type="submit" 
              variant="contained" 
              size="large" 
              fullWidth
              sx={{ py: 1.5, fontSize: '1.1rem' }}
            >
              Entrar no Painel
            </Button>
          </Stack>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 4, display: 'block' }}>
          &copy; {new Date().getFullYear()} TrackIECS • Todos os direitos reservados
        </Typography>
      </Paper>
    </Box>
  );
}