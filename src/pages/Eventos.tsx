import React, { useState } from 'react';
import { 
  Box, Typography, Grid, Paper, Stack, Button, IconButton, 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, MenuItem, Avatar, alpha, ToggleButtonGroup, ToggleButton
} from '@mui/material';
import { Plus, Trash2, Zap, CheckCircle2, AlertCircle, Calendar as CalendarIcon, LayoutList, Share2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const inputStyle = {
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)', fontWeight: 600 },
  '& .MuiFilledInput-root': { color: 'white', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px' },
};

export default function Eventos() {
  const navigate = useNavigate();
  const { eventos, musicas, membros, upsertEvento, deleteEvento, confirmPresenca, recusarPresenca } = useAppStore();
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

  return (
    <Box sx={{ animation: 'fadeIn 0.5s ease-out' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems={{xs: 'flex-start', sm: 'center'}} sx={{ mb: 6 }}>
        <Box>
          <Typography variant="h3" fontWeight={950} sx={{ color: '#FFF', fontSize: { xs: '2.5rem', md: '3.5rem' } }}>Escalas</Typography>
          <ToggleButtonGroup value={viewMode} exclusive onChange={(_, v) => v && setViewMode(v)} sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.05)' }}>
            <ToggleButton value="list" sx={{ color: 'white' }}><LayoutList size={20}/></ToggleButton>
            <ToggleButton value="calendar" sx={{ color: 'white' }}><CalendarIcon size={20}/></ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Button variant="contained" fullWidth={false} startIcon={<Plus />} onClick={() => setOpen(true)} sx={{ borderRadius: 3, px: 4, py: 1.5, bgcolor: '#818cf8', fontWeight: 800, width: {xs: '100%', sm: 'auto'} }}>
          Agendar
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {eventos.map((ev) => {
          const meuSlot = ev.equipe?.find((s: any) => s.membroId === meuMembro?.id);
          return (
            <Grid item xs={12} key={ev.id}>
              <Paper elevation={0} sx={{ 
                p: { xs: 2.5, md: 4 }, 
                borderRadius: 5, 
                background: 'rgba(255, 255, 255, 0.03)', 
                border: '1px solid rgba(255, 255, 255, 0.08)',
                position: 'relative'
              }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="overline" sx={{ color: '#818cf8', fontWeight: 900 }}>{ev.data}</Typography>
                    <Typography variant="h5" sx={{ color: '#FFF', fontWeight: 800, mb: 2 }}>{ev.titulo}</Typography>
                    <Button fullWidth variant="contained" startIcon={<Zap />} onClick={() => navigate(`/palco/${ev.id}`)} sx={{ bgcolor: '#818cf8', mb: 2, py: 1.5, borderRadius: 2.5 }}>STAGE MODE</Button>
                    
                    {meuSlot?.status === 'Pendente' && (
                       <Stack direction="row" spacing={1}>
                          <Button fullWidth variant="contained" color="success" onClick={() => confirmPresenca(ev.id, meuMembro!.id)}>SIM</Button>
                          <Button fullWidth variant="outlined" color="error" sx={{ color: '#f87171' }} onClick={() => recusarPresenca(ev.id, meuMembro!.id)}>NÃO</Button>
                       </Stack>
                    )}
                  </Grid>

                  {/* AJUSTE MOBILE: Essas colunas não tem borda no mobile, mas tem no desktop */}
                  <Grid item xs={12} md={4} sx={{ borderLeft: { md: '1px solid rgba(255,255,255,0.1)' }, borderTop: { xs: '1px solid rgba(255,255,255,0.05)', md: 'none' }, pt: { xs: 2, md: 0 }, px: { md: 4 } }}>
                    <Typography variant="overline" sx={{ opacity: 0.4, fontWeight: 900, mb: 1, display: 'block' }}>SETLIST</Typography>
                    {ev.setlist?.map((mId: string) => (
                      <Typography key={mId} sx={{ color: '#FFF', fontSize: '0.9rem', mt: 0.5, fontWeight: 700 }}>• {musicas.find(m => m.id === mId)?.titulo}</Typography>
                    ))}
                  </Grid>

                  <Grid item xs={12} md={4} sx={{ borderLeft: { md: '1px solid rgba(255,255,255,0.1)' }, borderTop: { xs: '1px solid rgba(255,255,255,0.05)', md: 'none' }, pt: { xs: 2, md: 0 }, px: { md: 4 } }}>
                    <Typography variant="overline" sx={{ opacity: 0.4, fontWeight: 900, mb: 1, display: 'block' }}>EQUIPE</Typography>
                    {ev.equipe?.map((slot: any, i: number) => (
                      <Stack key={i} direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                        <Typography sx={{ color: '#FFF', fontSize: '0.9rem', fontWeight: 800 }}>{membros.find(x => x.id === slot.membroId)?.nome}</Typography>
                        {slot.status === 'Confirmado' ? <CheckCircle2 size={16} color="#34d399" /> : <AlertCircle size={16} color="rgba(255,255,255,0.1)" />}
                      </Stack>
                    ))}
                  </Grid>
                </Grid>
                <IconButton onClick={() => deleteEvento(ev.id)} sx={{ position: 'absolute', top: 10, right: 10, color: 'rgba(255,255,255,0.1)' }}><Trash2 size={18}/></IconButton>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
      
      {/* Dialog omitido aqui por brevidade, use o mesmo com a propriedade fullScreen={isMobile} */}
    </Box>
  );
}