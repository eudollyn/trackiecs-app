import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Stack, Button, IconButton, Grid,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, ToggleButtonGroup, ToggleButton
} from '@mui/material';
import { Plus, Trash2, Zap, CheckCircle2, AlertCircle, Share2, LayoutList, Calendar as CalendarIcon } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useForm, useFieldArray, Controller } from 'react-hook-form';

const inputStyle = {
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)', fontWeight: 600 },
  '& .MuiFilledInput-root': { color: 'white', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px' },
};

export default function Eventos() {
  const { eventos, musicas, membros, upsertEvento, deleteEvento, currentMemberId, confirmPresenca, recusarPresenca } = useAppStore();
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const isAdmin = currentMemberId === 'admin';

  const { register, handleSubmit, control, reset } = useForm();
  const { fields, append, remove } = useFieldArray({ control, name: "equipe" });

  const handleSave = async (data: any) => {
    await upsertEvento(data);
    setOpen(false);
    reset();
  };

  const exportarZap = (ev: any) => {
    let msg = `*🎸 ESCALA: ${ev.titulo}*\n📅 *DATA:* ${ev.data}\n🕒 *HORA:* ${ev.hora_inicio}\n\n*EQUIPE:*\n`;
    ev.equipe.forEach((s: any) => msg += `- ${s.papel}: ${membros.find(m => m.id === s.membroId)?.nome}\n`);
    msg += `\n_Confirme sua presença no App!_`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 5 }}>
        <Box>
          <Typography variant="h3" fontWeight={950} sx={{ color: '#FFF', fontSize: { xs: '2.5rem', md: '3.5rem' } }}>Escalas</Typography>
          <ToggleButtonGroup value={viewMode} exclusive onChange={(_, v) => v && setViewMode(v)} sx={{ mt: 1.5, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
            <ToggleButton value="list" sx={{ color: 'white' }}><LayoutList size={20} /></ToggleButton>
            <ToggleButton value="calendar" sx={{ color: 'white' }}><CalendarIcon size={20} /></ToggleButton>
          </ToggleButtonGroup>
        </Box>
        {isAdmin && (
          <Button variant="contained" startIcon={<Plus />} onClick={() => setOpen(true)} sx={{ bgcolor: '#818cf8', fontWeight: 900, py: 1.5, borderRadius: 3 }}>AGENDAR</Button>
        )}
      </Stack>

      <Grid container spacing={3}>
        {eventos.map((ev: any) => {
          const meuSlot = ev.equipe?.find((s: any) => s.membroId === currentMemberId);
          return (
            <Grid item xs={12} key={ev.id}>
              <Paper sx={{ p: {xs: 3, md: 4}, background: 'rgba(255,255,255,0.03)', borderRadius: 5, border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
                
                <Stack direction="row" sx={{ position: 'absolute', top: 20, right: 20 }} spacing={1}>
                  <IconButton onClick={() => exportarZap(ev)} sx={{ color: '#25D366', bgcolor: 'rgba(37,211,102,0.1)' }}><Share2 size={18}/></IconButton>
                  {isAdmin && <IconButton onClick={() => deleteEvento(ev.id)} sx={{ color: '#f87171', opacity: 0.5 }}><Trash2 size={18}/></IconButton>}
                </Stack>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={5}>
                    <Typography variant="overline" color="#818cf8" fontWeight={900}>{ev.data} - {ev.hora_inicio}h</Typography>
                    <Typography variant="h4" color="white" fontWeight={850} mb={3}>{ev.titulo}</Typography>
                    
                    <Stack direction="column" spacing={2}>
                      <Button fullWidth variant="contained" startIcon={<Zap />} onClick={() => window.location.href=`/palco/${ev.id}`} sx={{ bgcolor: '#818cf8', py: 1.5, fontWeight: 900, borderRadius: 3 }}>STAGE MODE</Button>
                      
                      {/* PRESENÇA - Só aparece para o dono do ID logado */}
                      {meuSlot?.status === 'Pendente' && (
                        <Box sx={{ p: 2, bgcolor: 'rgba(52, 211, 153, 0.05)', borderRadius: 3, border: '1px solid rgba(52, 211, 153, 0.1)' }}>
                           <Typography variant="caption" sx={{ color: '#34d399', fontWeight: 900, mb: 1, display: 'block', textAlign: 'center' }}>SUA PRESENÇA É NECESSÁRIA!</Typography>
                           <Stack direction="row" spacing={1}>
                              <Button fullWidth variant="contained" color="success" onClick={() => confirmPresenca(ev.id, currentMemberId!)} sx={{fontWeight: 800}}>ACEITAR</Button>
                              <Button fullWidth variant="outlined" color="error" onClick={() => recusarPresenca(ev.id, currentMemberId!)} sx={{fontWeight: 800, color: '#f87171'}}>RECUAR</Button>
                           </Stack>
                        </Box>
                      )}
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={7} sx={{ borderLeft: {md: '1px solid rgba(255,255,255,0.1)'}, borderTop: {xs: '1px solid rgba(255,255,255,0.1)', md: 'none'}, pt: {xs: 3, md: 0}, px: {md: 4} }}>
                    <Typography variant="overline" sx={{ opacity: 0.3, fontWeight: 900, mb: 2, display: 'block' }}>REUNIÃO MINISTERIAL</Typography>
                    <Stack spacing={1.5}>
                       {ev.equipe?.map((s:any, i:number) => (
                          <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                             <Typography color="white" fontWeight={700} sx={{fontSize: '0.9rem'}}>{membros.find((m:any) => m.id === s.membroId)?.nome}</Typography>
                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="caption" sx={{ opacity: 0.4 }}>{s.papel}</Typography>
                                {s.status === 'Confirmado' ? <CheckCircle2 size={16} color="#34d399" /> : <AlertCircle size={16} color="rgba(255,255,255,0.1)" />}
                             </Box>
                          </Box>
                       ))}
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
      {/* Dialog segue a mesma lógica do administrador (use o código que te mandei antes se precisar redefinir o formulário) */}
    </Box>
  );
}