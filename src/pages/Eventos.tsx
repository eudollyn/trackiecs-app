import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Stack, Button, IconButton, Grid,
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, MenuItem, Avatar, alpha, ToggleButtonGroup, ToggleButton
} from '@mui/material';
import { Plus, Trash2, Clock, Music, Trash, Zap, CheckCircle2, AlertCircle, Share2, Calendar as CalendarIcon, LayoutList } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { format, isValid, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const inputStyle = {
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)', fontWeight: 600 },
  '& .MuiFilledInput-root': { color: 'white', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px 12px 0 0' },
  '& .MuiSelect-select': { color: 'white' },
};

export default function Eventos() {
  const navigate = useNavigate();
  const { eventos = [], musicas = [], membros = [], upsertEvento, deleteEvento, confirmPresenca, recusarPresenca } = useAppStore();
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const meuMembro = membros.length > 0 ? membros[0] : null;

  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: { titulo: '', data: '', horaInicio: '19:00', setlist: [], equipe: [] }
  });
  const { fields, append, remove } = useFieldArray({ control, name: "equipe" });

  const handleSave = async (data: any) => {
    await upsertEvento(data);
    setOpen(false);
    reset();
  };

  const safeFormat = (dateStr: any, formatStr: string) => {
    if (!dateStr) return '---';
    const d = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
    return isValid(d) ? format(d, formatStr, { locale: ptBR }) : 'Inválida';
  };

  const diasMes = eachDayOfInterval({ start: startOfMonth(new Date()), end: endOfMonth(new Date()) });

  return (
    <Box sx={{ pb: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 6 }}>
        <Box>
          <Typography variant="h3" fontWeight={900} sx={{ color: '#FFF' }}>Escalas</Typography>
          <ToggleButtonGroup value={viewMode} exclusive onChange={(_, v) => v && setViewMode(v)} sx={{ mt: 2, bgcolor: 'rgba(255,255,255,0.05)' }}>
            <ToggleButton value="list" sx={{ color: 'white' }}><LayoutList /></ToggleButton>
            <ToggleButton value="calendar" sx={{ color: 'white' }}><CalendarIcon /></ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Button variant="contained" startIcon={<Plus />} onClick={() => setOpen(true)} sx={{ bgcolor: '#818cf8', fontWeight: 800 }}>Agendar</Button>
      </Stack>

      {viewMode === 'list' ? (
        <Grid container spacing={4}>
          {eventos.map((ev) => {
            const meuSlot = ev.equipe?.find((s: any) => s.membroId === meuMembro?.id);
            return (
              <Grid item xs={12} key={ev.id}>
                <Paper sx={{ p: 4, borderRadius: 6, background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', position: 'relative' }}>
                  <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="overline" sx={{ color: '#818cf8', fontWeight: 900 }}>{safeFormat(ev.data, "eeee, dd/MM")}</Typography>
                      <Typography variant="h5" sx={{ color: '#FFF', fontWeight: 800, mb: 2 }}>{ev.titulo}</Typography>
                      <Button fullWidth variant="contained" startIcon={<Zap />} onClick={() => navigate(`/palco/${ev.id}`)} sx={{ bgcolor: '#818cf8', mb: 2 }}>PALCO</Button>
                      {meuSlot?.status === 'Pendente' && (
                         <Stack direction="row" spacing={1}>
                            <Button fullWidth variant="contained" color="success" onClick={() => confirmPresenca(ev.id, meuMembro!.id)}>SIM</Button>
                            <Button fullWidth variant="outlined" color="error" onClick={() => recusarPresenca(ev.id, meuMembro!.id)}>NÃO</Button>
                         </Stack>
                      )}
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ borderLeft: '1px solid rgba(255,255,255,0.1)', px: 4 }}>
                      <Typography variant="overline" sx={{ opacity: 0.3 }}>SETLIST</Typography>
                      {ev.setlist?.map((mId: string) => <Typography key={mId} sx={{ color: '#FFF', mt: 1 }}>• {musicas.find(m => m.id === mId)?.titulo}</Typography>)}
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ borderLeft: '1px solid rgba(255,255,255,0.1)', px: 4 }}>
                      <Typography variant="overline" sx={{ opacity: 0.3 }}>EQUIPE</Typography>
                      {ev.equipe?.map((slot: any, i: number) => (
                        <Stack key={i} direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                          <Typography sx={{ color: '#FFF' }}>{membros.find(x => x.id === slot.membroId)?.nome}</Typography>
                          {slot.status === 'Confirmado' ? <CheckCircle2 size={16} color="#34d399" /> : <AlertCircle size={16} color="rgba(255,255,255,0.1)" />}
                        </Stack>
                      ))}
                    </Grid>
                  </Grid>
                  <IconButton onClick={() => deleteEvento(ev.id)} sx={{ position: 'absolute', top: 10, right: 10, color: 'rgba(255,255,255,0.1)' }}><Trash2 size={16}/></IconButton>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
          {diasMes.map(dia => (
            <Paper key={dia.toString()} sx={{ minHeight: 100, p: 1, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <Typography variant="caption" sx={{ color: 'white', opacity: 0.3 }}>{format(dia, 'd')}</Typography>
              {eventos.filter(e => isSameDay(parseISO(e.data), dia)).map(e => (
                <Box key={e.id} sx={{ bgcolor: '#818cf8', borderRadius: 1, p: 0.5, mt: 0.5 }}><Typography sx={{ fontSize: 9, color: 'white' }} noWrap>{e.titulo}</Typography></Box>
              ))}
            </Paper>
          ))}
        </Box>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md" PaperProps={{ sx: { bgcolor: '#131c2e', color: 'white', borderRadius: 7 } }}>
        <DialogTitle sx={{ fontWeight: 900, p: 4, pb: 2 }}>Novo Agendamento</DialogTitle>
        <form onSubmit={handleSubmit(handleSave)}>
          <DialogContent sx={{ p: 4, pt: 0 }}>
             <Grid container spacing={4}>
                <Grid item xs={12} md={7}><Stack spacing={3}>
                  <TextField fullWidth label="Título" {...register('titulo')} variant="filled" sx={inputStyle} />
                  <TextField fullWidth type="date" {...register('data')} InputLabelProps={{shrink: true}} variant="filled" sx={inputStyle} />
                  <Controller name="setlist" control={control} render={({ field }) => (
                    <TextField {...field} select fullWidth label="Setlist" SelectProps={{ multiple: true }} variant="filled" sx={inputStyle}>
                      {musicas.map(m => <MenuItem key={m.id} value={m.id}>{m.titulo}</MenuItem>)}
                    </TextField>
                  )} /></Stack></Grid>
                <Grid item xs={12} md={5}><Stack spacing={2} sx={{ maxHeight: 300, overflowY: 'auto' }}>
                  {fields.map((field, index) => (
                    <Box key={field.id} sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 3 }}>
                      <Controller name={`equipe.${index}.membroId`} control={control} render={({ field }) => (
                        <TextField {...field} select fullWidth size="small" label="Membro" variant="filled" sx={inputStyle}>
                          {membros.map(m => <MenuItem key={m.id} value={m.id}>{m.nome}</MenuItem>)}
                        </TextField>
                      )} />
                      <TextField fullWidth size="small" label="Papel" {...register(`equipe.${index}.papel` as any)} variant="filled" sx={{ ...inputStyle, mt: 1 }} />
                    </Box>
                  ))}
                  <Button fullWidth variant="outlined" onClick={() => append({ membroId: "", papel: "", status: 'Pendente' })} sx={{ color: 'white', mt: 1 }}>+ Ministro</Button>
                </Stack></Grid>
             </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 4 }}><Button type="submit" variant="contained" sx={{ bgcolor: '#818cf8', px: 4, fontWeight: 900 }}>Salvar</Button></DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}