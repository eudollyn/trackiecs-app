import React from 'react';
import { Box, Paper, Typography, TextField, Button, Stack, Avatar } from '@mui/material';
import { Music2, Lock } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function LoginPage() {
  const login = useAppStore((state) => state.login);

  const handleEntrar = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      id: '1',
      nome: 'Administrador',
      email: 'admin@igreja.com'
    });
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'
    }}>
      <Paper elevation={0} sx={{ 
        p: 5, width: '100%', maxWidth: 400, borderRadius: 8, textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)'
      }}>
        <Avatar sx={{ m: '0 auto 20px', bgcolor: '#4f46e5', width: 56, height: 56 }}>
          <Music2 size={30} />
        </Avatar>
        
        <Typography variant="h4" fontWeight={900} sx={{ color: '#1e293b', mb: 1 }}>TrackIECS</Typography>
        <Typography variant="body2" sx={{ color: '#64748b', mb: 4 }}>Gestão inteligente para ministérios</Typography>

        <form onSubmit={handleEntrar}>
          <Stack spacing={2}>
            <TextField 
              fullWidth label="E-mail" variant="outlined" 
              defaultValue="admin@igreja.com" 
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
            <TextField 
              fullWidth label="Senha" type="password" variant="outlined" 
              defaultValue="123456"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
            <Button 
              type="submit" 
              fullWidth variant="contained" size="large"
              sx={{ py: 2, borderRadius: 3, bgcolor: '#4f46e5', fontWeight: 800, mt: 2 }}
            >
              Entrar no Painel
            </Button>
          </Stack>
        </form>

        <Typography variant="caption" sx={{ display: 'block', mt: 4, color: '#94a3b8' }}>
          © 2026 TrackIECS • Acesso Demonstrativo
        </Typography>
      </Paper>
    </Box>
  );
}