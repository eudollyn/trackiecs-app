import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Stack, Button, IconButton, Grid,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, ToggleButtonGroup, ToggleButton
} from '@mui/material';
import { Plus, Trash2, Zap, CheckCircle2, AlertCircle, Share2, LayoutList, Calendar as CalendarIcon } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useForm, useFieldArray, Controller } from 'react-hook-form';

export default function Eventos() {
  const { eventos, musicas, membros, upsertEvento, deleteEvento, currentMemberId, confirmPresenca, recusarPresenca } = useAppStore();
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: { titulo: '', data: '', horaInicio: '19:00', setlist: [], equipe: [] }
  });
  const { fields, append, remove } = useFieldArray({ control, name: "equipe" });

  const exportarZap = (ev: any) => {
    let msg = `*🎸 ESCALA: ${ev.titulo}*\n📅 *DATA:* ${ev.data}\n\n*SETLIST:*\n`;
    ev.setlist.forEach((mId:any) => msg += `- ${musicas.find(m=>m.id===mId)?.titulo}\n`);
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <Box sx={{ p: {xs: 0, md: 2} }}>
      <Stack direction="row" justifyContent="space-between" mb={6}>
        <Box>
           <Typography variant="h4" fontWeight={900} color="white">Escalas</Typography>
           <ToggleButtonGroup value={viewMode} exclusive onChange={(_,v) => v && setViewMode(v)} sx={{ mt: 2, bgcolor: 'rgba(255,255,255,0.05)' }}>
              <ToggleButton value="list" sx={{ color: 'white' }}><LayoutList /></ToggleButton>
              <ToggleButton value="calendar" sx={{ color: 'white' }}><CalendarIcon /></ToggleButton>
           </ToggleButtonGroup>
        </Box>
        <Button variant="contained" startIcon={<Plus />} onClick={() => setOpen(true)} sx={{ bgcolor: '#818cf8', fontWeight: 800, borderRadius: 3 }}>Novo</Button>
      </Stack>

      <Grid container spacing={3}>
        {eventos.map(ev => (
          <Grid item xs={12} key={ev.id}>
            <Paper sx={{ p: {xs: 2, md: 3}, background: 'rgba(255,255,255,0.03)', borderRadius: 5, border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
              
              {/* WHATSAPP E DELETE FIXADOS NO CARD */}
              <Stack direction="row" sx={{ position: 'absolute', top: 15, right: 15 }}>
                <IconButton onClick={() => exportarZap(ev)} sx={{ color: '#25D366' }}><Share2 size={18}/></IconButton>
                <IconButton onClick={() => deleteEvento(ev.id)} sx={{ color: '#f87171' }}><Trash2 size={18}/></IconButton>
              </Stack>

              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="overline" color="#818cf8" fontWeight={900}>{ev.data}</Typography>
                  <Typography variant="h5" color="white" fontWeight={800} mb={2}>{ev.titulo}</Typography>
                  
                  {/* SEÇÃO DE CONFIRMAÇÃO DO MÚSICO LOGADO */}
                  {ev.equipe.find(s => s.membroId === currentMemberId)?.status === 'Pendente' && (
                    <Stack direction="row" spacing={1} mb={2}>
                       <Button fullWidth variant="contained" color="success" onClick={() => confirmPresenca(ev.id, currentMemberId!)} sx={{ fontWeight: 800 }}>Confirmar</Button>
                       <Button fullWidth variant="outlined" color="error" onClick={() => recusarPresenca(ev.id, currentMemberId!)}>Recusar</Button>
                    </Stack>
                  )}
                  
                  <Button fullWidth variant="contained" onClick={() => window.location.href=`/palco/${ev.id}`} sx={{ bgcolor: '#818cf8' }}>STAGE MODE</Button>
                </Grid>

                <Grid item xs={12} md={4} sx={{ borderLeft: {md: '1px solid rgba(255,255,255,0.1)'}, px: {md: 4} }}>
                   <Typography variant="overline" sx={{ opacity: 0.3 }}>EQUIPE</Typography>
                   <Stack spacing={1} mt={1}>
                      {ev.equipe.map((s,i) => (
                        <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                           <Typography color="white" variant="body2">{membros.find(m => m.id === s.membroId)?.nome}</Typography>
                           {s.status === 'Confirmado' ? <CheckCircle2 size={14} color="#34d399" /> : <AlertCircle size={14} color="rgba(255,255,255,0.2)" />}
                        </Box>
                      ))}
                   </Stack>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}