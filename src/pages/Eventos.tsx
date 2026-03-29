import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Stack, Button, IconButton, Grid, 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem 
} from '@mui/material';
import { Plus, Trash2, Zap, Share2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useForm, useFieldArray, Controller } from 'react-hook-form';

export default function Eventos() {
  const { eventos = [], musicas = [], membros = [], upsertEvento, deleteEvento, currentMemberId } = useAppStore();
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, control, reset } = useForm();
  const { fields, append, remove } = useFieldArray({ control, name: "equipe" });

  const handleSave = async (data: any) => {
    try {
      await upsertEvento(data);
      setOpen(false);
      reset();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" mb={4}>
        <Typography variant="h4" fontWeight={900} color="white">Escalas</Typography>
        <Button variant="contained" startIcon={<Plus />} onClick={() => setOpen(true)} sx={{ bgcolor: '#818cf8', fontWeight: 900, px: 3, borderRadius: 3 }}>
          AGENDAR
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {eventos.map((ev: any) => (
          <Grid item xs={12} key={ev.id}>
            <Paper sx={{ p: 3, background: 'rgba(255,255,255,0.03)', borderRadius: 5, border: '1px solid rgba(255,255,255,0.1)' }}>
               <Typography variant="overline" color="#818cf8" fontWeight={900}>{ev.data}</Typography>
               <Typography variant="h5" color="white" fontWeight={850} mb={3}>{ev.titulo}</Typography>
               <Button fullWidth variant="contained" onClick={() => window.location.href=`/palco/${ev.id}`} sx={{ bgcolor: '#818cf8', py: 1.5, fontWeight: 900, borderRadius: 2 }}>
                 ENTRAR EM CENA
               </Button>
               <IconButton onClick={() => deleteEvento(ev.id)} sx={{ color: '#f87171', mt: 2 }}><Trash2 size={18}/></IconButton>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* FORMULÁRIO DE ESCALA */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { bgcolor: '#131c2e', color: 'white', borderRadius: 5 } }}>
        <DialogTitle sx={{ fontWeight: 900 }}>Planejar Culto</DialogTitle>
        <form onSubmit={handleSubmit(handleSave)}>
          <DialogContent>
             <Stack spacing={3}>
                <TextField fullWidth label="Nome do Evento" {...register('titulo')} variant="filled" sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }} inputProps={{style:{color:'white'}}} InputLabelProps={{style:{color:'gray'}}} />
                <TextField fullWidth type="date" {...register('data')} variant="filled" sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }} InputLabelProps={{shrink: true, style:{color:'gray'}}} inputProps={{style:{color:'white'}}} />
                <TextField fullWidth label="Horário" {...register('horaInicio')} variant="filled" sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }} inputProps={{style:{color:'white'}}} InputLabelProps={{style:{color:'gray'}}} />
                
                <Controller
                  name="setlist" control={control}
                  render={({ field }) => (
                    <TextField {...field} select fullWidth label="Músicas" SelectProps={{ multiple: true }} variant="filled" sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}>
                      {musicas.map((m: any) => <MenuItem key={m.id} value={m.id}>{m.titulo}</MenuItem>)}
                    </TextField>
                  )}
                />

                <Box sx={{ mt: 2 }}>
                   <Typography variant="overline" sx={{ color: '#818cf8', fontWeight: 900 }}>CONVOCAR EQUIPE</Typography>
                   <Stack spacing={2} mt={1}>
                      {fields.map((field, index) => (
                        <Box key={field.id} sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 2 }}>
                           <Controller
                              name={`equipe.${index}.membroId`} control={control}
                              render={({ field }) => (
                                <TextField {...field} select fullWidth size="small" label="Membro" variant="filled">
                                  {membros.map((m: any) => <MenuItem key={m.id} value={m.id}>{m.nome}</MenuItem>)}
                                </TextField>
                              )}
                           />
                           <TextField fullWidth size="small" label="Instrumento" {...register(`equipe.${index}.papel` as any)} variant="filled" sx={{ mt: 1 }} />
                           <Button size="small" color="error" onClick={() => remove(index)}>Tirar</Button>
                        </Box>
                      ))}
                      <Button variant="outlined" fullWidth onClick={() => append({ membroId: "", papel: "", status: 'Pendente' })} sx={{ borderStyle: 'dashed', color: 'white' }}>+ NOVO INTEGRANTE</Button>
                   </Stack>
                </Box>
             </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpen(false)} sx={{ color: 'gray' }}>Cancelar</Button>
            <Button type="submit" variant="contained" sx={{ bgcolor: '#818cf8', fontWeight: 900 }}>SALVAR ESCALA</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}