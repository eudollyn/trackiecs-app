import React, { useState } from 'react';
import { Box, Typography, Paper, Stack, Button, IconButton, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, useTheme, useMediaQuery } from '@mui/material';
import { Plus, Trash2, Zap, AlertCircle } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const inputStyle = {
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)', fontWeight: 600 },
  '& .MuiFilledInput-root': { color: 'white', backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 2 },
  '& input': { color: 'white' }
};

export default function Eventos() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { eventos = [], musicas = [], membros = [], upsertEvento, deleteEvento } = useAppStore();
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, control, reset } = useForm();
  const { fields, append, remove } = useFieldArray({ control, name: "equipe" });

  const handleSave = async (data: any) => {
    await upsertEvento(data);
    setOpen(false);
    reset();
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" mb={4}>
        <Typography variant="h4" fontWeight={900} color="white" sx={{fontSize: {xs: '1.8rem', md: '2.5rem'}}}>Escalas</Typography>
        <Button variant="contained" startIcon={<Plus />} onClick={() => setOpen(true)} sx={{ bgcolor: '#818cf8', fontWeight: 900, borderRadius: 2 }}>AGENDAR</Button>
      </Stack>

      <Grid container spacing={3}>
        {eventos.map((ev: any) => (
          <Grid item xs={12} key={ev.id}>
            <Paper sx={{ p: {xs: 2.5, md: 3}, background: 'rgba(255,255,255,0.03)', borderRadius: 5, border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
               <Typography variant="overline" color="#818cf8" fontWeight={900}>{ev.data}</Typography>
               <Typography variant="h5" color="white" fontWeight={850} mb={3} sx={{fontSize: '1.2rem'}}>{ev.titulo}</Typography>
               <Stack spacing={2}>
                  <Button fullWidth variant="contained" onClick={() => navigate(`/palco/${ev.id}`)} sx={{ bgcolor: '#818cf8', fontWeight: 900, py: 1.2 }}>STAGE MODE</Button>
                  <IconButton onClick={() => deleteEvento(ev.id)} sx={{ color: '#f87171', position: 'absolute', top: 10, right: 10 }}><Trash2 size={16}/></IconButton>
                  <Box borderTop="1px solid rgba(255,255,255,0.05)" pt={2}>
                    <Typography variant="caption" sx={{ opacity: 0.3, fontWeight: 900 }}>MINISTROS</Typography>
                    <Stack spacing={1} mt={1}>
                       {ev.equipe?.map((s:any, i:number) => (
                          <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography color="white" variant="body2">{membros.find((m:any) => m.id === s.membroId)?.nome || 'Membro'}</Typography><Typography variant="caption" sx={{opacity: 0.5}}>{s.papel}</Typography></Box>
                       ))}
                    </Stack>
                  </Box>
               </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} fullScreen={isMobile} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: '#020617', color: 'white' } }}>
        <DialogTitle sx={{ fontWeight: 900, mt: isMobile ? 6 : 0 }}>Nova Escala</DialogTitle>
        <form onSubmit={handleSubmit(handleSave)}>
          <DialogContent><Stack spacing={3}>
            <TextField fullWidth label="Culto" {...register('titulo')} variant="filled" sx={inputStyle} />
            <TextField fullWidth type="date" {...register('data')} variant="filled" sx={inputStyle} InputLabelProps={{shrink:true}} />
            <Controller name="setlist" control={control} render={({ field }) => (
              <TextField {...field} select fullWidth label="Músicas" SelectProps={{ multiple: true }} variant="filled" sx={inputStyle}>
                {musicas.map((m: any) => <MenuItem key={m.id} value={m.id} sx={{color: 'black'}}>{m.titulo}</MenuItem>)}
              </TextField>
            )} />
            <Box><Typography variant="overline" color="#818cf8">EQUIPE</Typography>
              <Stack spacing={2} mt={1}>
                {fields.map((field, index) => (
                  <Paper key={field.id} sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 2 }}>
                    <Controller name={`equipe.${index}.membroId`} control={control} render={({ field }) => (
                      <TextField {...field} select fullWidth size="small" label="Membro" variant="filled">
                        {membros.map((m: any) => <MenuItem key={m.id} value={m.id} sx={{color: 'black'}}>{m.nome}</MenuItem>)}
                      </TextField>
                    )} />
                    <TextField fullWidth size="small" label="Instrumento" {...register(`equipe.${index}.papel` as any)} variant="filled" sx={{ mt: 1, ...inputStyle }} />
                    <Button color="error" onClick={() => remove(index)}>Tirar</Button>
                  </Paper>
                ))}
                <Button variant="outlined" fullWidth onClick={() => append({ membroId: "", papel: "", status: 'Pendente' })} sx={{ color: 'white', borderStyle: 'dashed' }}>+ INTEGRANTE</Button>
              </Stack></Box>
          </Stack></DialogContent>
          <DialogActions sx={{ p: 3 }}><Button onClick={() => setOpen(false)} sx={{ color: 'gray' }}>Cancelar</Button><Button type="submit" variant="contained" sx={{ bgcolor: '#818cf8', fontWeight: 900 }}>SALVAR</Button></DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}