import React, { useState } from 'react';
import { Box, Typography, Paper, Stack, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import { Plus, Trash2, Zap } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const fieldStyle = {
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
  '& .MuiFilledInput-root': { color: 'white', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 2 },
  '& input': { color: 'white' }
};

export default function Eventos() {
  const navigate = useNavigate();
  const { eventos = [], musicas = [], membros = [], upsertEvento, deleteEvento } = useAppStore();
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, control, reset } = useForm();
  const { fields, append, remove } = useFieldArray({ control, name: "equipe" });

  const onSalvar = async (data: any) => {
    await upsertEvento(data);
    setOpen(false);
    reset();
  };

  return (
    <Box sx={{ pb: 8 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h3" fontWeight={900} color="white">Escalas</Typography>
        <Button variant="contained" startIcon={<Plus />} onClick={() => setOpen(true)} 
          sx={{ bgcolor: '#818cf8', fontWeight: 900, px: 3, borderRadius: 2, height: 45 }}>AGENDAR</Button>
      </Stack>

      <Stack spacing={3}>
        {eventos.map((ev: any) => (
          <Paper key={ev.id} sx={{ p: 3, background: 'rgba(255,255,255,0.03)', borderRadius: 5, border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
             <Typography variant="overline" color="#818cf8" fontWeight={900}>{ev.data}</Typography>
             <Typography variant="h5" color="white" fontWeight={850} mb={2}>{ev.titulo}</Typography>
             <Button fullWidth variant="contained" onClick={() => navigate(`/palco/${ev.id}`)} sx={{ bgcolor: '#818cf8', fontWeight: 900 }}>STAGE MODE</Button>
             <IconButton onClick={() => deleteEvento(ev.id)} sx={{ color: '#f87171', position: 'absolute', top: 10, right: 10 }}><Trash2 size={16}/></IconButton>
          </Paper>
        ))}
      </Stack>

      <Dialog open={open} onClose={() => setOpen(false)} fullScreen PaperProps={{ sx: { bgcolor: '#020617', color: 'white' } }}>
        <DialogTitle sx={{ fontWeight: 900, fontSize: '1.8rem', mt: 3 }}>Novo Evento</DialogTitle>
        <form onSubmit={handleSubmit(onSalvar)}>
          <DialogContent>
            <Stack spacing={3}>
              <TextField fullWidth label="Nome do Evento" {...register('titulo')} variant="filled" sx={fieldStyle} />
              <TextField fullWidth type="date" {...register('data')} variant="filled" sx={fieldStyle} InputLabelProps={{shrink:true}} />
              <Controller name="setlist" control={control} render={({ field }) => (
                <TextField {...field} select fullWidth label="Músicas" SelectProps={{ multiple: true }} variant="filled" sx={fieldStyle}>
                  {musicas.map((m: any) => <MenuItem key={m.id} value={m.id} sx={{color: 'black'}}>{m.titulo}</MenuItem>)}
                </TextField>
              )} />
              <Box>
                <Typography variant="overline" color="#818cf8" sx={{mb: 2, display: 'block'}}>ESCALAR EQUIPE</Typography>
                <Stack spacing={2}>
                  {fields.map((field, index) => (
                    <Box key={field.id} sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 3 }}>
                      <Controller name={`equipe.${index}.membroId`} control={control} render={({ field }) => (
                        <TextField {...field} select fullWidth size="small" label="Membro" variant="filled">
                          {membros.map((m: any) => <MenuItem key={m.id} value={m.id} sx={{color: 'black'}}>{m.nome}</MenuItem>)}
                        </TextField>
                      )} />
                      <TextField fullWidth size="small" label="Instrumento" {...register(`equipe.${index}.papel` as any)} variant="filled" sx={{mt: 1, ...fieldStyle}} />
                      <Button color="error" onClick={() => remove(index)}>Tirar</Button>
                    </Box>
                  ))}
                  <Button variant="outlined" fullWidth onClick={() => append({ membroId: "", papel: "", status: 'Pendente' })} sx={{ borderStyle: 'dashed', color: 'white', py: 1.5 }}>+ ADD MINISTRO</Button>
                </Stack>
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3, bgcolor: '#020617', position: 'sticky', bottom: 0 }}>
            <Button onClick={() => setOpen(false)} sx={{ color: 'gray' }}>CANCELAR</Button>
            <Button type="submit" variant="contained" sx={{ bgcolor: '#818cf8', fontWeight: 900, px: 4, py: 1.5 }}>SALVAR AGORA</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}