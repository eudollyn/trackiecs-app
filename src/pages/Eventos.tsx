import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Stack, Button, IconButton, Grid,
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, MenuItem, Avatar, alpha, ToggleButtonGroup, ToggleButton
} from '@mui/material';
import { 
  Plus, Trash2, Clock, MapPin, Music, Trash, Zap, 
  CheckCircle2, XCircle, AlertCircle, Share2, Calendar as CalendarIcon, LayoutList 
} from 'lucide-react';
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
  try {
    // Garante que o estado 'Pendente' seja o padrão para novos membros da equipe
    const equipeFormatada = data.equipe?.map((slot: any) => ({
      ...slot,
      status: slot.status || 'Pendente'
    }));

    await upsertEvento({ ...data, equipe: equipeFormatada });
    setOpen(false);
    reset();
  } catch (error) {
    console.error(error);
    toast.error("Erro ao processar formulário.");
  }
};

  const exportarWhatsApp = (ev: any) => {
    let texto = `*🎸 ESCALA: ${ev.titulo.toUpperCase()}*\n📅 *DATA:* ${format(parseISO(ev.data), "dd/MM")}\n\n*🎶 SETLIST:*\n`;
    ev.setlist.forEach((mId: any, i: number) => {
      const m = musicas.find(x => x.id === mId);
      texto += `${i + 1}. ${m?.titulo}\n`;
    });
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank');
  };

  const diasMes = eachDayOfInterval({ start: startOfMonth(new Date()), end: endOfMonth(new Date()) });

  return (
    <Box sx={{ pb: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 6 }}>
        <Box>
          <Typography variant="h3" fontWeight={900} sx={{ color: '#FFF', letterSpacing: '-0.04em' }}>Escalas</Typography>
          <ToggleButtonGroup value={viewMode} exclusive onChange={(_, v) => v && setViewMode(v)} sx={{ mt: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
            <ToggleButton value="list" sx={{ color: 'white' }}><LayoutList size={18} /></ToggleButton>
            <ToggleButton value="calendar" sx={{ color: 'white' }}><CalendarIcon size={18} /></ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Button variant="contained" startIcon={<Plus />} onClick={() => setOpen(true)} sx={{ borderRadius: 3, px: 4, py: 1.5, bgcolor: '#818cf8', fontWeight: 800 }}>
          Agendar Escala
        </Button>
      </Stack>

      {viewMode === 'list' ? (
        <Grid container spacing={4}>
          {eventos.map((ev) => {
            const meuSlot = ev.equipe.find(s => s.membroId === meuMembro?.id);
            const jaRespondeu = meuSlot && meuSlot.status !== 'Pendente';

            return (
              <Grid item xs={12} key={ev.id}>
                <Paper sx={{ p: 4, borderRadius: 6, background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', position: 'relative' }}>
                  <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="overline" sx={{ fontWeight: 900, color: '#818cf8' }}>{format(parseISO(ev.data), "eeee, dd/MM", { locale: ptBR })}</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: '#FFF', mb: 3 }}>{ev.titulo}</Typography>
                      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                        <Button fullWidth variant="contained" startIcon={<Zap />} onClick={() => navigate(`/palco/${ev.id}`)} sx={{ bgcolor: '#818cf8', fontWeight: 900 }}>PALCO</Button>
                        <IconButton onClick={() => exportarWhatsApp(ev)} sx={{ bgcolor: 'rgba(37, 211, 102, 0.1)', color: '#25D366' }}><Share2 size={20}/></IconButton>
                      </Stack>
                      {meuSlot && !jaRespondeu && (
                        <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 3 }}>
                           <Typography variant="caption" sx={{ color: 'white', opacity: 0.5, mb: 1, display: 'block', textAlign: 'center' }}>CONFIRMAR PRESENÇA?</Typography>
                           <Stack direction="row" spacing={1}>
                              <Button fullWidth variant="contained" color="success" size="small" onClick={() => confirmPresenca(ev.id, meuMembro!.id)}>SIM</Button>
                              <Button fullWidth variant="outlined" color="error" size="small" onClick={() => recusarPresenca(ev.id, meuMembro!.id)}>NÃO</Button>
                           </Stack>
                        </Box>
                      )}
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ borderLeft: '1px solid rgba(255,255,255,0.1)', px: 4 }}>
                      <Typography variant="overline" sx={{ opacity: 0.3, fontWeight: 900 }}>SETLIST</Typography>
                      {ev.setlist.map(mId => <Typography key={mId} sx={{ color: '#FFF', fontWeight: 700, mt: 1 }}>• {musicas.find(m => m.id === mId)?.titulo}</Typography>)}
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ borderLeft: '1px solid rgba(255,255,255,0.1)', px: 4 }}>
                      <Typography variant="overline" sx={{ opacity: 0.3, fontWeight: 900 }}>EQUIPE</Typography>
                      {ev.equipe.map((slot, i) => (
                        <Stack key={i} direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                          <Typography sx={{ color: '#FFF', fontWeight: 800 }}>{membros.find(x => x.id === slot.membroId)?.nome}</Typography>
                          {slot.status === 'Confirmado' ? <CheckCircle2 size={16} color="#34d399" /> : <AlertCircle size={16} color="rgba(255,255,255,0.2)" />}
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
              <Typography variant="caption" sx={{ opacity: 0.3, color: 'white' }}>{format(dia, 'd')}</Typography>
              {eventos.filter(e => isSameDay(parseISO(e.data), dia)).map(e => (
                <Box key={e.id} sx={{ bgcolor: '#818cf8', borderRadius: 1.5, p: 0.5, mt: 0.5 }}><Typography sx={{ fontSize: 9, fontWeight: 900, color: 'white' }} noWrap>{e.titulo}</Typography></Box>
              ))}
            </Paper>
          ))}
        </Box>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md" PaperProps={{ sx: { bgcolor: '#131c2e', color: 'white', borderRadius: 7, border: '1px solid rgba(255,255,255,0.1)' } }}>
        <DialogTitle sx={{ fontWeight: 900, p: 4, pb: 2 }}>Novo Agendamento</DialogTitle>
        <form onSubmit={handleSubmit(handleSave)}>
          <DialogContent sx={{ p: 4, pt: 0 }}>
             <Grid container spacing={4}>
                <Grid item xs={12} md={7}>
                   <Stack spacing={3}>
                      <TextField fullWidth label="Nome do Evento" {...register('titulo', {required: true})} variant="filled" sx={inputStyle} />
                      <Grid container spacing={2}>
                        <Grid item xs={6}><TextField fullWidth type="date" {...register('data')} InputLabelProps={{shrink: true}} variant="filled" sx={inputStyle} /></Grid>
                        <Grid item xs={6}><TextField fullWidth label="Hora" {...register('horaInicio')} variant="filled" sx={inputStyle} /></Grid>
                      </Grid>
                      <Controller name="setlist" control={control} render={({ field }) => (
                        <TextField {...field} select fullWidth label="Setlist" SelectProps={{ multiple: true }} variant="filled" sx={inputStyle}>
                          {musicas.map(m => <MenuItem key={m.id} value={m.id}>{m.titulo}</MenuItem>)}
                        </TextField>
                      )} />
                   </Stack>
                </Grid>
                <Grid item xs={12} md={5}>
                   <Typography variant="overline" sx={{ color: '#818cf8', fontWeight: 900 }}>Equipe</Typography>
                   <Stack spacing={2} sx={{ mt: 1, maxHeight: 300, overflowY: 'auto' }}>
                      {fields.map((field, index) => (
                        <Box key={field.id} sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 3 }}>
                           <Controller name={`equipe.${index}.membroId`} control={control} render={({ field }) => (
                             <TextField {...field} select fullWidth size="small" label="Ministro" variant="filled" sx={inputStyle}>
                               {membros.map(m => <MenuItem key={m.id} value={m.id}>{m.nome}</MenuItem>)}
                             </TextField>
                           )} />
                           <TextField fullWidth size="small" label="Papel" {...register(`equipe.${index}.papel`)} variant="filled" sx={{ ...inputStyle, mt: 1 }} />
                           <Button size="small" color="error" onClick={() => remove(index)} sx={{ mt: 1 }}>Remover</Button>
                        </Box>
                      ))}
                      <Button fullWidth variant="outlined" onClick={() => append({ membroId: "", papel: "", status: 'Pendente' })} sx={{ borderStyle: 'dashed', color: 'white', mt: 1 }}>+ Ministro</Button>
                   </Stack>
                </Grid>
             </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 4 }}><Button type="submit" variant="contained" sx={{ bgcolor: '#818cf8', px: 6, py: 1.5, fontWeight: 900, borderRadius: 3 }}>Salvar Escala</Button></DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}