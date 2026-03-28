import React, { useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2'; 
import { 
  Box, Typography, Paper, Stack, Button, IconButton, 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, MenuItem, Avatar, alpha, ToggleButtonGroup, ToggleButton 
} from '@mui/material';
import { 
  Plus, Trash2, Clock, MapPin, Music, UserCheck, 
  Trash, Zap, CheckCircle2, XCircle, AlertCircle, 
  Check, Share2, Calendar as CalendarIcon, LayoutList 
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isValid } from 'date-fns';
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
  
  // Extraímos as funções EXATAMENTE como estão no novo Store
  const { 
    eventos = [], 
    musicas = [], 
    membros = [], 
    upsertEvento, 
    deleteEvento, 
    confirmPresenca, 
    recusarPresenca 
  } = useAppStore();
  
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // Pega o primeiro membro para simular o "seu" usuário nos botões de confirmar
  const meuMembro = membros.length > 0 ? membros[0] : null;

  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: { 
      titulo: '', 
      data: format(new Date(), 'yyyy-MM-dd'), 
      horaInicio: '19:00', 
      setlist: [] as string[], 
      equipe: [] as any[] 
    }
  });
  
  const { fields, append, remove } = useFieldArray({ control, name: "equipe" });

  const handleSave = async (data: any) => {
    try {
      if (typeof upsertEvento !== 'function') {
        throw new Error("Função upsertEvento não encontrada no Store");
      }
      await upsertEvento(data);
      setOpen(false);
      reset();
    } catch (error) {
      console.error(error);
      toast.error("Falha ao salvar. Verifique a conexão.");
    }
  };

  const safeFormat = (dateStr: any, formatStr: string) => {
    if (!dateStr) return '---';
    const d = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
    return isValid(d) ? format(d, formatStr, { locale: ptBR }) : 'Data Inválida';
  };

  return (
    <Box sx={{ pb: 4, animation: 'fadeIn 0.5s ease-out' }}>
      {/* CABEÇALHO */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 6 }}>
        <Box>
          <Typography variant="h3" fontWeight={900} sx={{ color: '#FFF', letterSpacing: '-0.04em' }}>Escalas</Typography>
          <ToggleButtonGroup 
            value={viewMode} exclusive onChange={(_, v) => v && setViewMode(v)} 
            sx={{ mt: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}
          >
            <ToggleButton value="list" sx={{ color: 'white' }}><LayoutList size={18} /></ToggleButton>
            <ToggleButton value="calendar" sx={{ color: 'white' }}><CalendarIcon size={18} /></ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Button 
          variant="contained" startIcon={<Plus />} onClick={() => setOpen(true)}
          sx={{ borderRadius: 3, px: 4, py: 1.5, bgcolor: '#818cf8', fontWeight: 800 }}
        >
          Agendar Escala
        </Button>
      </Stack>

      {/* MODO LISTA */}
      {viewMode === 'list' ? (
        <Grid container spacing={4}>
          {eventos.map((ev) => {
            const meuSlot = ev.equipe?.find((s: any) => s.membroId === meuMembro?.id);
            const jaRespondeu = meuSlot && meuSlot.status !== 'Pendente';

            return (
              <Grid size={12} key={ev.id}>
                <Paper sx={{ p: 4, borderRadius: 6, background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.1)', position: 'relative' }}>
                  <Grid container spacing={4}>
                    {/* INFO PRINCIPAL */}
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Typography variant="overline" sx={{ fontWeight: 900, color: '#818cf8' }}>
                        {safeFormat(ev.data, "eeee, dd/MM")}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: '#FFF', mb: 3 }}>{ev.titulo}</Typography>
                      
                      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                        <Button fullWidth variant="contained" startIcon={<Zap />} onClick={() => navigate(`/palco/${ev.id}`)} sx={{ bgcolor: '#818cf8', fontWeight: 900, borderRadius: 3 }}>PALCO</Button>
                        <IconButton 
                          onClick={() => window.open(`https://wa.me/?text=Escala: ${ev.titulo}`, '_blank')}
                          sx={{ bgcolor: 'rgba(37, 211, 102, 0.1)', color: '#25D366' }}
                        >
                          <Share2 size={20}/>
                        </IconButton>
                      </Stack>

                      {meuSlot && !jaRespondeu && (
                        <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 3, border: '1px solid rgba(255,255,255,0.05)' }}>
                           <Typography variant="caption" sx={{ color: 'white', opacity: 0.5, mb: 1, display: 'block', textAlign: 'center', fontWeight: 800 }}>CONFIRMAR PRESENÇA?</Typography>
                           <Stack direction="row" spacing={1}>
                              <Button fullWidth variant="contained" color="success" size="small" onClick={() => confirmPresenca(ev.id, meuMembro!.id)}>SIM</Button>
                              <Button fullWidth variant="outlined" color="error" size="small" onClick={() => recusarPresenca(ev.id, meuMembro!.id)}>NÃO</Button>
                           </Stack>
                        </Box>
                      )}
                    </Grid>

                    {/* SETLIST */}
                    <Grid size={{ xs: 12, md: 4 }} sx={{ borderLeft: '1px solid rgba(255,255,255,0.1)', px: 4 }}>
                      <Typography variant="overline" sx={{ opacity: 0.3, fontWeight: 900 }}>SETLIST</Typography>
                      <Stack spacing={1} sx={{ mt: 1 }}>
                        {ev.setlist?.map((mId: string) => (
                          <Typography key={mId} sx={{ color: '#FFF', fontWeight: 700 }}>• {musicas.find(m => m.id === mId)?.titulo || 'Música'}</Typography>
                        ))}
                      </Stack>
                    </Grid>

                    {/* EQUIPE */}
                    <Grid size={{ xs: 12, md: 4 }} sx={{ borderLeft: '1px solid rgba(255,255,255,0.1)', px: 4 }}>
                      <Typography variant="overline" sx={{ opacity: 0.3, fontWeight: 900 }}>EQUIPE</Typography>
                      <Stack spacing={1.5} sx={{ mt: 1 }}>
                        {ev.equipe?.map((slot: any, i: number) => {
                          const m = membros.find(x => x.id === slot.membroId);
                          return (
                            <Stack key={i} direction="row" justifyContent="space-between" alignItems="center">
                              <Stack direction="row" spacing={1.5} alignItems="center">
                                <Avatar sx={{ width: 24, height: 24, fontSize: 10, bgcolor: alpha('#818cf8', 0.2), color: '#818cf8' }}>{m?.nome?.[0] || '?'}</Avatar>
                                <Typography variant="body2" sx={{ color: '#FFF', fontWeight: 700 }}>{m?.nome || 'Membro'}</Typography>
                              </Stack>
                              {slot.status === 'Confirmado' ? <CheckCircle2 size={16} color="#34d399" /> : 
                               slot.status === 'Recusado' ? <XCircle size={16} color="#f87171" /> : 
                               <AlertCircle size={16} color="rgba(255,255,255,0.1)" />}
                            </Stack>
                          );
                        })}
                      </Stack>
                    </Grid>
                  </Grid>
                  <IconButton onClick={() => deleteEvento(ev.id)} sx={{ position: 'absolute', top: 10, right: 10, color: 'rgba(255,255,255,0.1)' }}><Trash2 size={16}/></IconButton>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        /* MODO CALENDÁRIO */
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
          {eachDayOfInterval({ start: startOfMonth(new Date()), end: endOfMonth(new Date()) }).map(dia => (
            <Paper key={dia.toString()} sx={{ minHeight: 100, p: 1, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 3 }}>
              <Typography variant="caption" sx={{ opacity: 0.3, color: 'white' }}>{format(dia, 'd')}</Typography>
              {eventos.filter(e => isSameDay(parseISO(e.data), dia)).map(e => (
                <Box key={e.id} sx={{ bgcolor: '#818cf8', borderRadius: 1.5, p: 0.5, mt: 0.5 }}><Typography sx={{ fontSize: 9, fontWeight: 900, color: 'white' }} noWrap>{e.titulo}</Typography></Box>
              ))}
            </Paper>
          ))}
        </Box>
      )}

      {/* MODAL DE CRIAÇÃO */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md" PaperProps={{ sx: { bgcolor: '#131c2e', color: 'white', borderRadius: 7, border: '1px solid rgba(255,255,255,0.1)' } }}>
        <DialogTitle sx={{ fontWeight: 900, p: 4, pb: 2 }}>Novo Agendamento</DialogTitle>
        <form onSubmit={handleSubmit(handleSave)}>
          <DialogContent sx={{ p: 4, pt: 0 }}>
             <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 7 }}>
                   <Stack spacing={3}>
                      <TextField fullWidth label="Título do Evento" {...register('titulo', {required: true})} variant="filled" sx={inputStyle} />
                      <Grid container spacing={2}>
                        <Grid size={6}><TextField fullWidth type="date" {...register('data')} InputLabelProps={{shrink: true}} variant="filled" sx={inputStyle} /></Grid>
                        <Grid size={6}><TextField fullWidth label="Hora" {...register('horaInicio')} variant="filled" sx={inputStyle} /></Grid>
                      </Grid>
                      <Controller
                        name="setlist" control={control}
                        render={({ field }) => (
                          <TextField {...field} select fullWidth label="Músicas" SelectProps={{ multiple: true }} variant="filled" sx={inputStyle}>
                            {musicas.map(m => <MenuItem key={m.id} value={m.id}>{m.titulo}</MenuItem>)}
                          </TextField>
                        )}
                      />
                   </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 5 }}>
                   <Typography variant="overline" sx={{ color: '#818cf8', fontWeight: 900 }}>Convocação de Equipe</Typography>
                   <Stack spacing={2} sx={{ mt: 1, maxHeight: 300, overflowY: 'auto' }}>
                      {fields.map((field, index) => (
                        <Box key={field.id} sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 3 }}>
                           <Controller
                              name={`equipe.${index}.membroId`} control={control}
                              render={({ field }) => (
                                <TextField {...field} select fullWidth size="small" label="Ministro" variant="filled" sx={inputStyle}>
                                  {membros.map(m => <MenuItem key={m.id} value={m.id}>{m.nome}</MenuItem>)}
                                </TextField>
                              )}
                           />
                           <TextField fullWidth size="small" label="Papel" {...register(`equipe.${index}.papel` as any)} variant="filled" sx={{ ...inputStyle, mt: 1 }} />
                           <Button size="small" color="error" onClick={() => remove(index)} sx={{ mt: 1, fontWeight: 700 }}>Remover</Button>
                        </Box>
                      ))}
                      <Button fullWidth variant="outlined" onClick={() => append({ membroId: "", papel: "", status: 'Pendente' })} sx={{ borderStyle: 'dashed', color: 'white', mt: 1 }}>+ Adicionar</Button>
                   </Stack>
                </Grid>
             </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 4 }}>
            <Button onClick={() => setOpen(false)} sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>Cancelar</Button>
            <Button type="submit" variant="contained" sx={{ bgcolor: '#818cf8', px: 4, fontWeight: 900 }}>Salvar Escala</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}