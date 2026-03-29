import React, { useState } from 'react';
import { Box, Typography, Paper, Stack, Button, IconButton, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Avatar, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { Plus, Trash2, Zap, CheckCircle2, XCircle, AlertCircle, Share2, LayoutList, Calendar as CalendarIcon } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function Eventos() {
  const navigate = useNavigate();
  const { eventos, musicas, membros, upsertEvento, deleteEvento, confirmPresenca, recusarPresenca, currentMemberId } = useAppStore();
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: { titulo: '', data: '', horaInicio: '19:00', setlist: [], equipe: [] }
  });
  const { fields, append, remove } = useFieldArray({ control, name: "equipe" });

  const exportarZap = (ev: any) => {
    let msg = `*🎸 ESCALA: ${ev.titulo}*\n📅 *DATA:* ${ev.data}\n\n*EQUIPE:*\n`;
    ev.equipe.forEach((s: any) => {
        const m = membros.find(x => x.id === s.membroId);
        msg += `- ${s.papel}: ${m?.nome}\n`;
    });
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" mb={4}>
        <Typography variant="h3" fontWeight={900} color="white">Escalas</Typography>
        <Button variant="contained" startIcon={<Plus />} onClick={() => setOpen(true)} sx={{ bgcolor: '#818cf8', fontWeight: 800 }}>Nova Escala</Button>
      </Stack>

      <Grid container spacing={3}>
        {eventos.map(ev => {
          const meuSlot = ev.equipe.find(s => s.membroId === currentMemberId);
          return (
            <Grid item xs={12} key={ev.id}>
              <Paper sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 5, position: 'relative', border: '1px solid rgba(255,255,255,0.1)' }}>
                {/* BOTÕES DE AÇÃO TOPO DIREITO */}
                <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: 15, right: 15 }}>
                  <IconButton onClick={() => exportarZap(ev)} sx={{ color: '#25D366', bgcolor: 'rgba(37,211,102,0.1)' }}><Share2 size={20}/></IconButton>
                  <IconButton onClick={() => deleteEvento(ev.id)} sx={{ color: '#f87171' }}><Trash2 size={20}/></IconButton>
                </Stack>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="overline" color="#818cf8" fontWeight={900}>{ev.data}</Typography>
                    <Typography variant="h5" color="white" fontWeight={800}>{ev.titulo}</Typography>
                    <Button fullWidth variant="contained" startIcon={<Zap />} onClick={() => navigate(`/palco/${ev.id}`)} sx={{ mt: 2, bgcolor: '#818cf8', fontWeight: 900 }}>STAGE MODE</Button>
                    
                    {/* CONFIRMAÇÃO PESSOAL - Só aparece para o dono do e-mail */}
                    {meuSlot && meuSlot.status === 'Pendente' && (
                      <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 3 }}>
                         <Typography variant="caption" sx={{ color: '#34d399', fontWeight: 900, mb: 1, display: 'block', textAlign: 'center' }}>VOCÊ ESTÁ NESTA ESCALA! CONFIRME:</Typography>
                         <Stack direction="row" spacing={1}>
                            <Button fullWidth variant="contained" color="success" onClick={() => confirmPresenca(ev.id, currentMemberId!)}>OK</Button>
                            <Button fullWidth variant="outlined" color="error" onClick={() => recusarPresenca(ev.id, currentMemberId!)}>RECUSAR</Button>
                         </Stack>
                      </Box>
                    )}
                  </Grid>

                  <Grid item xs={12} md={8} sx={{ borderLeft: {md: '1px solid rgba(255,255,255,0.1)'}, px: {md: 4} }}>
                    <Typography variant="overline" sx={{ opacity: 0.3, fontWeight: 900 }}>MINISTROS</Typography>
                    <Stack spacing={1} mt={1}>
                       {ev.equipe.map((s, i) => (
                         <Stack key={i} direction="row" justifyContent="space-between">
                            <Typography color="white" fontWeight={700}>{membros.find(m => m.id === s.membroId)?.nome}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                               <Typography variant="caption" sx={{ opacity: 0.5 }}>{s.papel}</Typography>
                               {s.status === 'Confirmado' ? <CheckCircle2 size={16} color="#34d399" /> : <AlertCircle size={16} color="rgba(255,255,255,0.1)" />}
                            </Box>
                         </Stack>
                       ))}
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          )
        })}
      </Grid>
      
      {/* Dialog omitido aqui - mantenha o anterior que já estava com alto contraste */}
    </Box>
  );
}