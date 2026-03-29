import React, { useState } from 'react';
import { Box, Typography, Paper, Stack, Button, IconButton, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import { Plus, Trash2, Zap, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export default function Eventos() {
  const navigate = useNavigate();
  const { eventos, musicas, membros, upsertEvento, deleteEvento, currentMemberId, confirmPresenca } = useAppStore();
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, control, reset } = useForm();
  const { fields, append, remove } = useFieldArray({ control, name: "equipe" });

  const handleSave = async (data: any) => {
    await upsertEvento(data);
    setOpen(false);
    reset();
  };

  return (
    <Box sx={{ p: {xs: 1, md: 2} }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight={900} color="white">Escalas</Typography>
        {/* BOTÃO GRANDE E CLICÁVEL NO MOBILE */}
        <Button 
          variant="contained" 
          startIcon={<Plus />} 
          onClick={() => setOpen(true)}
          sx={{ bgcolor: '#818cf8', fontWeight: 800, py: 1.5, px: 3, borderRadius: 3 }}
        >
          AGENDAR
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {eventos.map((ev: any) => (
          <Grid item xs={12} key={ev.id}>
            <Paper sx={{ p: 3, background: 'rgba(255,255,255,0.03)', borderRadius: 5, border: '1px solid rgba(255,255,255,0.1)' }}>
               <Typography variant="overline" color="#818cf8" fontWeight={900}>{ev.data}</Typography>
               <Typography variant="h5" color="white" fontWeight={800} mb={2}>{ev.titulo}</Typography>
               
               <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Button fullWidth variant="contained" startIcon={<Zap />} onClick={() => navigate(`/palco/${ev.id}`)} sx={{ bgcolor: '#818cf8', mb: 2, py: 1.5, fontWeight: 800 }}>STAGE MODE</Button>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    {ev.equipe?.some((s:any) => s.membroId === currentMemberId && s.status === 'Pendente') && (
                       <Button fullWidth variant="contained" color="success" onClick={() => confirmPresenca(ev.id, currentMemberId)} sx={{ py: 1.5, fontWeight: 800 }}>CONFIRMAR MINHA PRESENÇA</Button>
                    )}
                  </Grid>
               </Grid>
               
               <Box mt={3} pt={2} borderTop="1px solid rgba(255,255,255,0.05)">
                  <Typography variant="caption" sx={{ opacity: 0.3, fontWeight: 900 }}>MINISTROS</Typography>
                  <Stack spacing={1} mt={1}>
                     {ev.equipe?.map((s:any, i:number) => (
                        <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                           <Typography color="white" variant="body2" fontWeight={700}>{membros.find((m:any) => m.id === s.membroId)?.nome || 'Músico'}</Typography>
                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="caption" sx={{ opacity: 0.5 }}>{s.papel}</Typography>
                              {s.status === 'Confirmado' ? <CheckCircle2 size={16} color="#34d399" /> : <AlertCircle size={16} color="rgba(255,255,255,0.2)" />}
                           </Box>
                        </Box>
                     ))}
                  </Stack>
               </Box>
               <IconButton onClick={() => deleteEvento(ev.id)} sx={{ color: '#f87171', mt: 2 }}><Trash2 size={18}/></IconButton>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* DIALOGO DE AGENDAMENTO AJUSTADO */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { bgcolor: '#131c2e', color: 'white', borderRadius: 5 } }}>
        <DialogTitle sx={{ fontWeight: 900 }}>Novo Agendamento</DialogTitle>
        <form onSubmit={handleSubmit(handleSave)}>
          <DialogContent>
             <Stack spacing={3}>
                <TextField fullWidth label="Nome do Evento" {...register('titulo', {required: true})} variant="filled" sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }} InputLabelProps={{style: {color: 'rgba(255,255,255,0.5)'}}} inputProps={{style: {color: 'white'}}} />
                <TextField fullWidth type="date" {...register('data')} variant="filled" sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }} InputLabelProps={{shrink: true, style: {color: 'rgba(255,255,255,0.5)'}}} inputProps={{style: {color: 'white'}}} />
                
                <Controller
                  name="setlist" control={control}
                  render={({ field }) => (
                    <TextField {...field} select fullWidth label="Setlist" SelectProps={{ multiple: true }} variant="filled" sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                      {musicas.map((m:any) => <MenuItem key={m.id} value={m.id}>{m.titulo}</MenuItem>)}
                    </TextField>
                  )}
                />

                <Box>
                   <Typography variant="overline" sx={{ color: '#818cf8', fontWeight: 900 }}>CONVOCAR EQUIPE</Typography>
                   <Stack spacing={2} mt={1}>
                      {fields.map((field, index) => (
                        <Box key={field.id} sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 3 }}>
                           <Controller
                              name={`equipe.${index}.membroId`} control={control}
                              render={({ field }) => (
                                <TextField {...field} select fullWidth size="small" label="Membro" variant="filled">
                                  {membros.map((m:any) => <MenuItem key={m.id} value={m.id}>{m.nome}</MenuItem>)}
                                </TextField>
                              )}
                           />
                           <TextField fullWidth size="small" label="Papel" {...register(`equipe.${index}.papel` as any)} variant="filled" sx={{ mt: 1 }} />
                           <Button color="error" size="small" onClick={() => remove(index)}>Tirar</Button>
                        </Box>
                      ))}
                      <Button variant="outlined" onClick={() => append({ membroId: "", papel: "", status: 'Pendente' })} sx={{ color: 'white', borderStyle: 'dashed' }}>+ Adicionar Músico</Button>
                   </Stack>
                </Box>
             </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpen(false)} sx={{ color: 'rgba(255,255,255,0.5)' }}>Cancelar</Button>
            <Button type="submit" variant="contained" sx={{ bgcolor: '#818cf8', px: 4, fontWeight: 900 }}>SALVAR ESCALA</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}