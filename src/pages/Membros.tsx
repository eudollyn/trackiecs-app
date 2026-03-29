import React, { useState } from 'react';
import { Box, Grid, Paper, Avatar, Typography, Button, TextField, InputAdornment, Stack, Dialog, DialogTitle, DialogContent, DialogActions, Fab } from '@mui/material';
import { Search, UserPlus, Trash2, Plus } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const inputStyle = {
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)', fontWeight: 600 },
  '& .MuiFilledInput-root': { color: 'white', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px' },
};

export default function Membros() {
  const { membros, addMembro, deleteMembro, currentMemberId } = useAppStore();
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState('');
  const [funcoes, setFuncoes] = useState('');

  // LÓGICA CORRIGIDA: Se for admin ou o ID especial
  const isAdmin = currentMemberId === 'admin';
  const filtered = membros.filter((m: any) => m.nome.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = async () => {
    if(!nome) return;
    await addMembro({ nome, email: '', funcoes });
    setOpen(false);
    setNome(''); setFuncoes('');
  };

  return (
    <Box sx={{ pb: 10 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight={950} sx={{ color: '#FFF', fontSize: { xs: '2.5rem', md: '3.5rem' } }}>Equipe</Typography>
        
        {/* BOTÃO PARA DESKTOP */}
        {isAdmin && (
          <Button 
            variant="contained" 
            onClick={() => setOpen(true)} 
            startIcon={<UserPlus />}
            sx={{ display: {xs: 'none', md: 'flex'}, bgcolor: '#818cf8', fontWeight: 800, borderRadius: 3, px: 3 }}
          >
            ADICIONAR
          </Button>
        )}
      </Stack>

      <TextField
        fullWidth placeholder="Filtrar integrantes..." value={search} onChange={(e) => setSearch(e.target.value)} 
        variant="filled" sx={{ mb: 4, ...inputStyle }}
        InputProps={{ startAdornment: <InputAdornment position="start"><Search color="rgba(255,255,255,0.5)"/></InputAdornment> }}
      />

      <Grid container spacing={3}>
        {filtered.map((m: any) => (
          <Grid item xs={12} sm={6} lg={4} key={m.id}>
            <Paper elevation={0} sx={{ 
              p: 3, borderRadius: 5, background: 'rgba(255, 255, 255, 0.04)', 
              border: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'center',
              position: 'relative'
            }}>
              <Avatar sx={{ width: 64, height: 64, bgcolor: '#818cf8', margin: '0 auto 15px', fontSize: '1.5rem', fontWeight: 900 }}>{m.nome[0]}</Avatar>
              <Typography variant="h6" fontWeight={800} color="#FFF">{m.nome}</Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', mb: 2, display: 'block' }}>
                {Array.isArray(m.funcoes) ? m.funcoes.join(', ') : m.funcoes || 'Membro'}
              </Typography>
              
              {isAdmin && (
                <IconButton 
                  onClick={() => deleteMembro(m.id)} 
                  sx={{ color: '#f87171', position: 'absolute', top: 10, right: 10, opacity: 0.5, '&:hover': {opacity: 1} }}
                >
                  <Trash2 size={18}/>
                </IconButton>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* BOTÃO FLUTUANTE (FAB) PARA MOBILE - MUITO MELHOR UX */}
      {isAdmin && (
        <Fab 
          color="primary" 
          onClick={() => setOpen(true)} 
          sx={{ position: 'fixed', bottom: 90, right: 20, bgcolor: '#818cf8', display: {xs: 'flex', md: 'none'} }}
        >
          <Plus />
        </Fab>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { bgcolor: '#131c2e', color: 'white', borderRadius: 7 } }}>
         <DialogTitle sx={{ fontWeight: 900 }}>Novo Ministro</DialogTitle>
         <DialogContent sx={{ minWidth: {xs: '90vw', sm: 400} }}>
            <Stack spacing={3} mt={1}>
              <TextField label="Nome Completo" fullWidth value={nome} onChange={e=>setNome(e.target.value)} variant="filled" sx={inputStyle} />
              <TextField label="Funções" placeholder="Violão, Voz..." fullWidth value={funcoes} onChange={e=>setFuncoes(e.target.value)} variant="filled" sx={inputStyle} />
            </Stack>
         </DialogContent>
         <DialogActions sx={{ p: 4 }}>
            <Button variant="contained" fullWidth onClick={handleAdd} sx={{ bgcolor: '#818cf8', fontWeight: 900, py: 1.5, borderRadius: 3 }}>CADASTRAR INTEGRANTE</Button>
         </DialogActions>
      </Dialog>
    </Box>
  );
}