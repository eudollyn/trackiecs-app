import React, { useState } from 'react';
import { Box, Typography, Paper, Stack, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import { Plus, Trash2, Zap, UserCheck, Trash } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const fieldStyle = {
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
  '& .MuiFilledInput-root': { color: 'white', backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 2 },
  '& input': { color: 'white' }
};

export default function Eventos() {
  const navigate = useNavigate();
  const { eventos = [], musicas = [], membros = [], upsertEvento, deleteEvento } = useAppStore();
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: { titulo: '', data: '', horaInicio: '19:00', setlist: [], equipe: [] }
  });
  const { fields, append, remove } = useFieldArray({ control, name: "equipe" });

  const onSalvar = async (data: any) => {
    try {
      await upsertEvento(data);
      setOpen(false);
      reset();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box sx={{ pb: 10 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={6}>
        <Typography variant="h3" fontWeight={950} color="white" sx={{ fontSize: {xs: '2.5rem', md: '3.5rem'} }}>Escalas</Typography>
        <Button 
          variant="contained" startIcon={<Plus />} onClick={() => setOpen(true)} 
          sx={{ bgcolor: '#818cf8', fontWeight: 900, py: 1.5, px: 3, borderRadius: 3 }}
        >
          AGENDAR
        </Button>
      </Stack>

      <Stack spacing={3}>
        {eventos.map((ev: any) => (
          <Paper key={ev.id} sx={{ p: 3, background: 'rgba(255,255,255,0.03)', borderRadius: 5, border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
             <Typography variant="overline" color="#818cf8" fontWeight={900}>{ev.data}</Typography>
             <Typography variant="h5" color="white" fontWeight={850} mb={3}>{ev.titulo}</Typography>
             <Button fullWidth variant="contained" onClick={() => navigate(`/palco/${ev.id}`)} sx={{ bgcolor: '#818cf8', py: 1.5, fontWeight: 900, borderRadius: 2 }}>STAGE MODE</Button>
             <IconButton onClick={() => deleteEvento(ev.id)} sx={{ color: '#f87171', position: 'absolute', top: 15, right: 15 }}><Trash2 size={20}/></IconButton>
          </Paper>
        ))}
      </Stack>

      {/* DIALOG 100% BOX/STACK (ZERO GRID = ZERO ERROR #2) */}
      <Dialog open={open} onClose={() => setOpen(false)} fullScreen PaperProps={{ sx: { bgcolor: '#020617', color: 'white' } }}>
        <DialogTitle sx={{ fontWeight: 950, fontSize: '2rem', mt: 4, color: '#818cf8' }}>Novo Agendamento</DialogTitle>
        <form onSubmit={handleSubmit(onSalvar)}>
          <DialogContent>
            <Stack spacing={4}>
              <Box>
                <TextField fullWidth label="Nome do Culto" {...register('titulo')} variant="filled" sx={fieldStyle} />
              </Box>
              <Box>
                <TextField fullWidth type="date" {...register('data')} variant="filled" sx={fieldStyle} InputLabelProps={{shrink:true}} />
              </Box>
              <Box>
                <Controller name="setlist" control={control} render={({ field }) => (
                  <TextField {...field} select fullWidth label="Músicas do Setlist" SelectProps={{ multiple: true }} variant="filled" sx={fieldStyle}>
                    {musicas.map((m: any) => <MenuItem key={m.id} value={m.id} sx={{color: 'black'}}>{m.titulo}</MenuItem>)}
                  </TextField>
                )} />
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography variant="overline" sx={{ color: '#818cf8', fontWeight: 900, mb: 2, display: 'block' }}>ESCALAR MINISTROS</Typography>
                <Stack spacing={2}>
                  {fields.map((field, index) => (
                    <Paper key={field.id} sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 3, border: '1px solid rgba(255,255,255,0.05)' }}>
                      <Stack spacing={2}>
                        <Controller name={`equipe.${index}.membroId`} control={control} render={({ field }) => (
                          <TextField {...field} select fullWidth size="small" label="Membro" variant="filled">
                            {membros.map((m: any) => <MenuItem key={m.id} value={m.id} sx={{color: 'black'}}>{m.nome}</MenuItem>)}
                          </TextField>
                        )} />
                        <TextField fullWidth size="small" label="Função/Papel" {...register(`equipe.${index}.papel` as any)} variant="filled" sx={fieldStyle} />
                        <Button color="error" variant="text" startIcon={<Trash size={16}/>} onClick={() => remove(index)} sx={{ alignSelf: 'flex-end', fontWeight: 700 }}>REMOVER</Button>
                      </Stack>
                    </Paper>
                  ))}
                  <Button 
                    variant="outlined" fullWidth onClick={() => append({ membroId: "", papel: "", status: 'Pendente' })} 
                    sx={{ borderStyle: 'dashed', color: 'white', py: 2, fontWeight: 900, borderColor: 'rgba(255,255,255,0.2)' }}
                  >
                    + ADICIONAR INTEGRANTE
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 4, bgcolor: '#020617', borderTop: '1px solid rgba(255,255,255,0.05)', position: 'sticky', bottom: 0 }}>
            <Button onClick={() => setOpen(false)} sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 800 }}>SAIR</Button>
            <Button type="submit" variant="contained" sx={{ bgcolor: '#818cf8', px: 5, py: 1.8, fontWeight: 950, borderRadius: 3 }}>PUBLICAR ESCALA</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}