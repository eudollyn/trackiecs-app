import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Stack, Link } from '@mui/material';
import { useAppStore } from '../store/useAppStore';

export default function LoginPage() {
  const { login, signUp } = useAppStore();
  const [isRegister, setIsRegister] = useState(false);
  
  // States
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [funcao, setFuncao] = useState('');

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      await signUp(nome, email, funcao);
    } else {
      await login(email);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#020617', p: 2 }}>
      <Paper sx={{ p: 4, width: '100%', maxWidth: 400, borderRadius: 6, bgcolor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
        <Typography variant="h4" fontWeight={950} textAlign="center" gutterBottom color="#818cf8">
          TrackIECS
        </Typography>
        <Typography variant="body2" textAlign="center" sx={{ opacity: 0.6, mb: 4 }}>
          {isRegister ? "Cadastre-se como ministro de louvor" : "Bem-vindo de volta ao ministério"}
        </Typography>

        <form onSubmit={handleAction}>
          <Stack spacing={2.5}>
            {isRegister && (
              <TextField 
                fullWidth label="Nome Completo" variant="filled" required
                value={nome} onChange={e => setNome(e.target.value)}
                sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}
                InputLabelProps={{ style: { color: 'rgba(255,255,255,0.5)' } }}
                inputProps={{ style: { color: 'white' } }}
              />
            )}
            
            <TextField 
              fullWidth label="Seu E-mail" variant="filled" type="email" required
              value={email} onChange={e => setEmail(e.target.value)}
              sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}
              InputLabelProps={{ style: { color: 'rgba(255,255,255,0.5)' } }}
              inputProps={{ style: { color: 'white' } }}
            />

            {isRegister && (
              <TextField 
                fullWidth label="Instrumentos/Funções" placeholder="Violão, Vocal, Som..." variant="filled" required
                value={funcao} onChange={e => setFuncao(e.target.value)}
                sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}
                InputLabelProps={{ style: { color: 'rgba(255,255,255,0.5)' } }}
                inputProps={{ style: { color: 'white' } }}
                helperText="Separe por vírgula"
              />
            )}

            <Button type="submit" variant="contained" fullWidth sx={{ py: 2, borderRadius: 3, bgcolor: '#818cf8', fontWeight: 900, mt: 1 }}>
              {isRegister ? "CRIAR CONTA" : "ENTRAR NO PAINEL"}
            </Button>
          </Stack>
        </form>

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Link 
            component="button" variant="body2" 
            onClick={() => setIsRegister(!isRegister)} 
            sx={{ color: '#818cf8', fontWeight: 700, textDecoration: 'none' }}
          >
            {isRegister ? "Já tenho cadastro, quero entrar" : "Não estou na lista? Cadastrar agora"}
          </Link>
        </Box>
      </Paper>
    </Box>
  );
}