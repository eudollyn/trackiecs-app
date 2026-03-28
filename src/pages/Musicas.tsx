import React, { useState } from 'react';
import { 
  Box, Typography, Stack, Button, TextField, InputAdornment, 
  Grid, Paper, Chip, IconButton, Dialog, DialogTitle, 
  DialogContent, DialogActions, MenuItem, Slider, alpha 
} from '@mui/material';
import { Search, Plus, Trash2, Music4, Zap, FileText, Video } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useForm, Controller } from 'react-hook-form';

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
  '& .MuiSelect-select': { color: 'white' },
};

export default function Musicas() {
  const { musicas, addMusica, deleteMusica } = useAppStore();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const { register, handleSubmit, control, reset, watch } = useForm({
    defaultValues: {
      titulo: '', artista: '', tom: 'G', bpm: 70, intensidade: 5, letra: '', linkCifra: '', linkVideo: ''
    }
  });

  const intensityValue = watch('intensidade');

  const handleSave = async (data: any) => {
    await addMusica(data); // Espera o banco salvar
    setOpen(false);
    reset();
  };

  const getIntensityColor = (val: number) => {
    if (val <= 3) return '#34d399';
    if (val <= 7) return '#fbbf24';
    return '#f87171';
  };

  const filtered = musicas.filter(m => 
    m.titulo?.toLowerCase().includes(search.toLowerCase()) ||
    m.artista?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ animation: 'fadeIn 0.5s ease-out' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 6 }}>
        <Box>
          <Typography variant="h3" fontWeight={900} sx={{ color: '#FFF', letterSpacing: '-0.04em' }}>Repertório</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>Biblioteca sincronizada na nuvem.</Typography>
        </Box>
        <Button variant="contained" startIcon={<Plus />} onClick={() => setOpen(true)} sx={{ borderRadius: 3, px: 4, py: 1.5, bgcolor: '#818cf8', fontWeight: 800 }}>
          Nova Música
        </Button>
      </Stack>

      <TextField 
        fullWidth placeholder="Buscar música ou artista..." value={search} onChange={(e) => setSearch(e.target.value)} 
        variant="filled" sx={{ mb: 4, ...inputStyle }}
        InputProps={{
          startAdornment: <InputAdornment position="start"><Search color="rgba(255,255,255,0.4)"/></InputAdornment>,
        }}
      />

      <Grid container spacing={2}>
        {filtered.map((m) => (
          <Grid item xs={12} key={m.id}>
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: 4, background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', gap: 3, transition: '0.3s', '&:hover': { transform: 'translateY(-4px)', borderColor: '#818cf8' } }}>
              <Box sx={{ width: 50, height: 50, borderRadius: 3, bgcolor: alpha(getIntensityColor(m.intensidade), 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', color: getIntensityColor(m.intensidade) }}>
                <Music4 size={24} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight={800} sx={{ color: '#FFF' }}>{m.titulo}</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>{m.artista}</Typography>
              </Box>
              <Stack direction="row" spacing={4} alignItems="center">
                 <Chip label={m.tom} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#818cf8', fontWeight: 800 }} />
                 <Box sx={{ width: 100, height: 6, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                    <Box sx={{ height: '100%', width: `${m.intensidade * 10}%`, bgcolor: getIntensityColor(m.intensidade) }} />
                 </Box>
                 <IconButton onClick={() => deleteMusica(m.id)} sx={{ color: '#f87171' }}><Trash2 size={18} /></IconButton>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { bgcolor: '#131c2e', color: 'white', borderRadius: 7, border: '1px solid rgba(255,255,255,0.1)' } }}>
        <DialogTitle sx={{ fontWeight: 900, fontSize: '1.7rem', p: 4 }}>Nova Música</DialogTitle>
        <form onSubmit={handleSubmit(handleSave)}>
          <DialogContent sx={{ p: 4, pt: 0 }}>
            <Stack spacing={3}>
              <TextField fullWidth label="Título" {...register('titulo', {required: true})} variant="filled" sx={inputStyle} />
              <TextField fullWidth label="Artista" {...register('artista')} variant="filled" sx={inputStyle} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField select fullWidth label="Tom" {...register('tom')} variant="filled" sx={inputStyle}>
                    {['C', 'G', 'D', 'A', 'E', 'B', 'F'].map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth type="number" label="BPM" {...register('bpm')} variant="filled" sx={inputStyle} />
                </Grid>
              </Grid>
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1, mb: 2, textTransform: 'uppercase' }}>
                  <Zap size={14} /> Energia ({intensityValue}/10)
                </Typography>
                <Controller name="intensidade" control={control} render={({ field }) => (
                  <Slider {...field} min={1} max={10} sx={{ color: getIntensityColor(intensityValue) }} />
                )} />
              </Box>
              <TextField fullWidth multiline rows={4} label="Letra / Pasta Digital" {...register('letra')} variant="filled" sx={inputStyle} />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 4 }}>
            <Button onClick={() => setOpen(false)} sx={{ color: 'rgba(255,255,255,0.5)' }}>Cancelar</Button>
            <Button type="submit" variant="contained" sx={{ bgcolor: '#818cf8', px: 4, fontWeight: 800, borderRadius: 3 }}>Salvar</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}