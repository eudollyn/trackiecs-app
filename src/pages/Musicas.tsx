import React, { useState } from 'react';
import { 
  Box, Typography, Stack, Button, TextField, InputAdornment, 
  Grid, Paper, Chip, IconButton, Dialog, DialogTitle, 
  DialogContent, DialogActions, MenuItem, Slider, alpha 
} from '@mui/material';
import { Search, Plus, Trash2, Music4, Zap } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useForm, Controller } from 'react-hook-form';

const inputStyle = {
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)', fontWeight: 600 },
  '& .MuiFilledInput-root': { color: 'white', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px' },
};

export default function Musicas() {
  const { musicas, addMusica, deleteMusica, currentMemberId } = useAppStore();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  
  const isAdmin = currentMemberId === 'admin';

  const { register, handleSubmit, control, reset, watch } = useForm({
    defaultValues: { titulo: '', artista: '', tom: 'G', bpm: 70, intensidade: 5, letra: '' }
  });

  const intensityValue = watch('intensidade');

  const handleSave = async (data: any) => {
    await addMusica(data);
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
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h3" fontWeight={950} sx={{ color: '#FFF', fontSize: { xs: '2rem', md: '3.5rem' } }}>Músicas</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.5)', display: { xs: 'none', sm: 'block' } }}>Biblioteca do ministério.</Typography>
        </Box>
        {isAdmin && (
          <Button variant="contained" startIcon={<Plus />} onClick={() => setOpen(true)} sx={{ bgcolor: '#818cf8', fontWeight: 800, borderRadius: 3, py: 1.5 }}>
            NOVA
          </Button>
        )}
      </Stack>

      <TextField 
        fullWidth placeholder="Título ou artista..." value={search} onChange={(e) => setSearch(e.target.value)} 
        variant="filled" sx={{ mb: 4, ...inputStyle }}
        InputProps={{ startAdornment: <InputAdornment position="start"><Search color="rgba(255,255,255,0.4)"/></InputAdornment> }}
      />

      <Grid container spacing={2}>
        {filtered.map((m) => (
          <Grid item xs={12} key={m.id}>
            <Paper elevation={0} sx={{ 
              p: 2.5, borderRadius: 4, background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', 
              display: 'flex', alignItems: 'center', gap: {xs: 2, md: 3},
              '&:hover': { transform: 'scale(1.01)', borderColor: '#818cf8' }, transition: '0.2s'
            }}>
              <Box sx={{ width: 45, height: 45, borderRadius: 2, bgcolor: alpha(getIntensityColor(m.intensidade), 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', color: getIntensityColor(m.intensidade) }}>
                <Music4 size={24} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ color: '#FFF', fontWeight: 800, fontSize: '1.1rem' }}>{m.titulo}</Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>{m.artista}</Typography>
              </Box>
              <Stack direction="row" spacing={3} alignItems="center">
                 <Chip label={m.tom} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#818cf8', fontWeight: 900 }} />
                 {isAdmin && <IconButton onClick={() => deleteMusica(m.id)} sx={{ color: '#f87171', opacity: 0.5, '&:hover': {opacity: 1} }}><Trash2 size={18} /></IconButton>}
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* MODAL ADICIONAR (ADMIN APENAS) */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { bgcolor: '#131c2e', color: 'white', borderRadius: 7 } }}>
        <DialogTitle sx={{ fontWeight: 900 }}>Nova Obra</DialogTitle>
        <form onSubmit={handleSubmit(handleSave)}>
          <DialogContent>
            <Stack spacing={3}>
              <TextField fullWidth label="Título" {...register('titulo')} variant="filled" sx={inputStyle} />
              <TextField fullWidth label="Artista" {...register('artista')} variant="filled" sx={inputStyle} />
              <Stack direction="row" spacing={2}>
                 <TextField select fullWidth label="Tom" {...register('tom')} variant="filled" sx={inputStyle}>
                    {['C','D','E','F','G','A','B','Am','Dm','Em'].map(t => <MenuItem key={t} value={t} sx={{color: 'black'}}>{t}</MenuItem>)}
                 </TextField>
                 <TextField fullWidth type="number" label="BPM" {...register('bpm')} variant="filled" sx={inputStyle} />
              </Stack>
              <Box>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 800 }}>VIBE/ENERGIA ({intensityValue})</Typography>
                <Controller name="intensidade" control={control} render={({ field }) => (
                  <Slider {...field} min={1} max={10} sx={{ color: getIntensityColor(intensityValue) }} />
                )} />
              </Box>
              <TextField fullWidth multiline rows={4} label="Letra" {...register('letra')} variant="filled" sx={inputStyle} />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 4 }}>
            <Button onClick={() => setOpen(false)} sx={{ color: 'rgba(255,255,255,0.5)' }}>Cancelar</Button>
            <Button type="submit" variant="contained" sx={{ bgcolor: '#818cf8', fontWeight: 800 }}>Salvar</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}