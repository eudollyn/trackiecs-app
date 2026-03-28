import React, { useState } from 'react';
import { 
  Box, Grid, Paper, Avatar, Typography, Button, 
  TextField, InputAdornment, Stack, Dialog, DialogTitle, DialogContent, DialogActions 
} from '@mui/material';
import { Search, UserPlus, Trash2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { toast } from 'sonner';

const inputStyle = {
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)', fontWeight: 600 },
  '& .MuiInputLabel-root.Mui-focused': { color: '#818cf8' },
  '& .MuiFilledInput-root': {
    color: 'white',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: '12px 12px 0 0',
    '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' },
    '&.Mui-focused': { backgroundColor: 'rgba(255,255,255,0.1)' },
    '&:before': { borderBottom: '1px solid rgba(255,255,255,0.1)' },
  },
};

export default function Membros() {
  const { membros, addMembro, deleteMembro } = useAppStore();
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState('');
  const [funcoes, setFuncoes] = useState('');

  const filtered = membros.filter(m => m.nome.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = () => {
    if(!nome) return toast.error("Nome é obrigatório");
    addMembro({ nome, email: '', funcoes: funcoes.split(','), ativo: true });
    toast.success("Integrante cadastrado!");
    setOpen(false);
    setNome(''); setFuncoes('');
  };

  return (
    <Box sx={{ animation: 'fadeIn 0.5s ease-out' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 6 }}>
        <Box>
          <Typography variant="h3" fontWeight={900} sx={{ color: '#FFF', letterSpacing: '-0.04em' }}>Equipe</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>Corpo técnico e ministros.</Typography>
        </Box>
        <Button variant="contained" startIcon={<UserPlus />} onClick={() => setOpen(true)} sx={{ borderRadius: 3, px: 4, py: 1.5, bgcolor: '#818cf8', fontWeight: 800 }}>
          Novo Integrante
        </Button>
      </Stack>

      <TextField
        fullWidth placeholder="Buscar integrante..." value={search} onChange={(e) => setSearch(e.target.value)} 
        variant="filled" sx={{ mb: 4, ...inputStyle }}
        InputProps={{
          startAdornment: <InputAdornment position="start"><Search color="rgba(255,255,255,0.4)"/></InputAdornment>,
        }}
      />

      <Grid container spacing={3}>
        {filtered.map((membro) => (
          <Grid item xs={12} md={6} lg={4} key={membro.id}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 5, background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', borderColor: '#818cf8' } }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Avatar sx={{ width: 50, height: 50, bgcolor: '#818cf8', fontWeight: 900 }}>{membro.nome[0]}</Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={800} sx={{ color: '#FFF' }}>{membro.nome}</Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 800, textTransform: 'uppercase' }}>Ministro</Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3 }}>
                {membro.funcoes.map(f => (
                  <Box key={f} sx={{ px: 1.5, py: 0.5, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.1)', color: '#FFF', fontSize: 11, fontWeight: 700 }}>
                    {f.trim()}
                  </Box>
                ))}
              </Stack>
              <Button fullWidth size="small" color="error" onClick={() => deleteMembro(membro.id)} startIcon={<Trash2 size={14}/>} sx={{ fontWeight: 700 }}>Remover</Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { bgcolor: '#131c2e', color: 'white', borderRadius: 7, p: 2, border: '1px solid rgba(255,255,255,0.1)' } }}>
        <DialogTitle sx={{ fontWeight: 900, fontSize: '1.6rem' }}>Novo Ministro</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2, minWidth: 320 }}>
            <TextField label="Nome Completo" fullWidth value={nome} onChange={e => setNome(e.target.value)} variant="filled" sx={inputStyle} />
            <TextField label="Funções (ex: Violão, Vocal)" fullWidth value={funcoes} onChange={e => setFuncoes(e.target.value)} variant="filled" sx={inputStyle} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>Cancelar</Button>
          <Button variant="contained" onClick={handleAdd} sx={{ bgcolor: '#818cf8', px: 4, fontWeight: 800, borderRadius: 3 }}>Cadastrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}