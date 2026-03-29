import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Stack } from '@mui/material';
import { useAppStore } from '../store/useAppStore';

export default function LoginPage() {
  const login = useAppStore(s => s.login);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!email) return;
    await login(email);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#020617' }}>
      <Paper sx={{ p: 4, width: '100%', maxWidth: 350, borderRadius: 6, bgcolor: '#0f172a', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>
        <Typography variant="h4" fontWeight={900} textAlign="center" mb={1}>TrackIECS</Typography>
        <Typography variant="body2" textAlign="center" sx={{ opacity: 0.5, mb: 4 }}>Digite seu e-mail de músico para entrar</Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField 
              fullWidth label="Seu E-mail" variant="filled" value={email} 
              onChange={e => setEmail(e.target.value)} 
              sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2, '& input': { color: 'white' }, '& label': { color: 'rgba(255,255,255,0.5)' } }}
            />
            <Button type="submit" variant="contained" fullWidth sx={{ py: 1.5, bgcolor: '#818cf8', fontWeight: 900, borderRadius: 3 }}>Acessar Painel</Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}