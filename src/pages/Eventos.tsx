import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Stack, Button, IconButton, Grid, 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Avatar 
} from '@mui/material';
import { Plus, Trash2, Zap, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export default function Eventos() {
  const navigate = useNavigate();
  const { eventos = [], musicas = [], membros = [], upsertEvento, deleteEvento, currentMemberId, confirmPresenca } = useAppStore();
  const [open, setOpen] = useState(false);
  const isAdmin = currentMemberId === 'admin';

  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: { titulo: '', data: '', horaInicio: '19:00', setlist: [], equipe: [] }
  });

  const { fields, append, remove } = useFieldArray({ control, name: "equipe" });

  const handleSave = async (data: any) => {
    try {
      await upsertEvento(data);
      setOpen(false);
      reset();
    } catch (e) {
      console.error("Erro ao salvar:", e);
    }
  };

  return (
    <Box sx={{ pb: 10 }}>
      {/* HEADER RESPONSIVO */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4, mt: { xs: 2, md: 0 } }}>
        <Typography variant="h3" sx={{ fontWeight: 900, color: '#FFF', fontSize: { xs: '2rem', md: '3.5rem' } }}>Escalas</Typography>
        {isAdmin && (
          <Button 
            variant="contained" 
            onClick={() => setOpen(true)} 
            startIcon={<Plus />}
            sx={{ bgcolor: '#818cf8', fontWeight: 800, borderRadius: 3, py: 1.5, px: 3 }}
          >
            AGENDAR
          </Button>
        )}
      </Stack>

      {/* LISTAGEM DE CARDS */}
      <Grid container spacing={3}>
        {eventos.map((ev: any) => {
          const meuSlot = ev.equipe?.find((s: any) => s.membroId === currentMemberId);
          return (
            <Grid item xs={12} key={ev.id}>
              <Paper sx={{ p: 3, background: 'rgba(255, 255, 255, 0.03)', borderRadius: 5, border: '1px solid rgba(255, 255, 255, 0.1)', position: 'relative' }}>
                <Typography variant="overline" sx={{ color: '#818cf8', fontWeight: 900 }}>{ev.data}</Typography>
                <Typography variant="h5" sx={{ color: '#FFF', fontWeight: 800, mb: 3 }}>{ev.titulo}</Typography>
                
                <Stack spacing={2} sx={{ mb: 3 }}>
                   <Button fullWidth variant="contained" startIcon={<Zap />} onClick={() => navigate(`/palco/${ev.id}`)} sx={{ bgcolor: '#818cf8', fontWeight: 900, py: 1.5 }}>STAGE MODE</Button>
                   
                   {meuSlot?.status === 'Pendente' && (
                     <Box sx={{ p: 2, bgcolor: 'rgba(52, 211, 153, 0.05)', borderRadius: 3, border: '1px solid rgba(52, 211, 153, 0.2)', textAlign: 'center' }}>
                        <Typography variant="caption" sx={{ color: '#34d399', fontWeight: 900, display: 'block', mb: 1 }}>SUA PRESENÇA É NECESSÁRIA</Typography>
                        <Button fullWidth variant="contained" color="success" onClick={() => confirmPresenca(ev.id, currentMemberId)} sx={{ fontWeight: 800 }}>CONFIRMAR</Button>
                     </Box>
                   )}
                </Stack>

                <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.05)', pt: 2 }}>
                   <Typography variant="overline" sx={{ opacity: 0.3, fontWeight: 900 }}>EQUIPE ESCALADA</Typography>
                   <Stack spacing={1} sx={{ mt: 1 }}>
                      {ev.equipe?.map((s: any, i: number) => (
                        <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography sx={{ color: '#FFF', fontSize: '0.9rem', fontWeight: 600 }}>{membros.find((m: any) => m.id === s.membroId)?.nome || 'Membro'}</Typography>
                          {s.status === 'Confirmado' ? <CheckCircle2 size={16} color="#34d399" /> : <AlertCircle size={16} color="rgba(255,255,255,0.1)" />}
                        </Box>
                      ))}
                   </Stack>
                </Box>

                {isAdmin && <IconButton onClick={() => deleteEvento(ev.id)} sx={{ position: 'absolute', top: 10, right: 10, color: 'rgba(255,255,255,0.1)' }}><Trash2 size={18}/></IconButton>}
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* DIALOG DE CRIAÇÃO (TOTALMENTE SEGURO PARA MOBILE) */}
      <Dialog 
        open={open} 
        onClose={() => setOpen(false)} 
        fullScreen // Facilita MUITO no celular
        PaperProps={{ sx: { bgcolor: '#020617', color: 'white' } }}
      >
        <DialogTitle sx={{ fontWeight: 900, fontSize: '1.5rem', mt: 2 }}>Novo Agendamento</DialogTitle>
        <form onSubmit={handleSubmit(handleSave)}>
          <DialogContent>
            <Stack spacing={3}>
              <TextField fullWidth label="Nome do Evento" {...register('titulo', { required: true })} variant="filled" sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }} inputProps={{ style: { color: 'white' } }} InputLabelProps={{ style: { color: 'gray' } }} />
              <TextField fullWidth type="date" {...register('data')} variant="filled" sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }} InputLabelProps={{ shrink: true, style: { color: 'gray' } }} inputProps={{ style: { color: 'white' } }} />
              <TextField fullWidth label="Hora (ex: 19:00)" {...register('horaInicio')} variant="filled" sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }} inputProps={{ style: { color: 'white' } }} InputLabelProps={{ style: { color: 'gray' } }} />
              
              <Controller
                name="setlist" control={control}
                render={({ field }) => (
                  <TextField {...field} select fullWidth label="Selecionar Músicas" SelectProps={{ multiple: true }} variant="filled" sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} InputLabelProps={{ style: { color: 'gray' } }}>
                    {musicas.map((m: any) => <MenuItem key={m.id} value={m.id} sx={{ color: 'black' }}>{m.titulo}</MenuItem>)}
                  </TextField>
                )}
              />

              <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <Typography variant="overline" sx={{ color: '#818cf8', fontWeight: 900, display: 'block', mb: 2 }}>ESCALAR MEMBROS</Typography>
                <Stack spacing={2}>
                  {fields.map((field, index) => (
                    <Paper key={field.id} sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 3 }}>
                      <Controller
                        name={`equipe.${index}.membroId`}
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} select fullWidth size="small" label="Membro" variant="filled" InputLabelProps={{ style: { color: 'gray' } }}>
                            {membros.map((m: any) => <MenuItem key={m.id} value={m.id} sx={{ color: 'black' }}>{m.nome}</MenuItem>)}
                          </TextField>
                        )}
                      />
                      <TextField fullWidth size="small" label="Papel" {...register(`equipe.${index}.papel` as any)} variant="filled" sx={{ mt: 1 }} InputLabelProps={{ style: { color: 'gray' } }} inputProps={{ style: { color: 'white' } }} />
                      <Button color="error" size="small" onClick={() => remove(index)} sx={{ mt: 1 }}>Tirar</Button>
                    </Paper>
                  ))}
                  <Button variant="outlined" fullWidth onClick={() => append({ membroId: "", papel: "", status: 'Pendente' })} sx={{ borderStyle: 'dashed', py: 1.5, color: 'white' }}>+ ADICIONAR MÚSICO</Button>
                </Stack>
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3, position: 'sticky', bottom: 0, bgcolor: '#020617', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Button onClick={() => setOpen(false)} sx={{ color: 'gray', px: 3 }}>Sair</Button>
            <Button type="submit" variant="contained" sx={{ bgcolor: '#818cf8', px: 4, py: 1.5, fontWeight: 900, borderRadius: 2 }}>SALVAR ESCALA COMPLETA</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}