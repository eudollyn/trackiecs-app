import React from 'react';
import { 
  Box, Typography, Paper, Stack, alpha, Button, Avatar, Grid 
} from '@mui/material';
import { Music, Users, Clock, Activity } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { format, isAfter, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const navigate = useNavigate();
  const { musicas, membros, eventos } = useAppStore();

  const proximoEvento = eventos
    ?.filter(ev => ev.data && isAfter(parseISO(ev.data), new Date()))
    .sort((a, b) => parseISO(a.data).getTime() - parseISO(b.data).getTime())[0];

  const getDadosEnergia = () => {
    if (!proximoEvento?.setlist || proximoEvento.setlist.length === 0) return [];
    return proximoEvento.setlist.map((mId, index) => {
      const musica = musicas.find(m => m.id === mId);
      return { name: index + 1, energia: musica?.intensidade || 5 };
    });
  };

  return (
    <Box sx={{ animation: 'fadeIn 0.6s ease-out' }}>
      <Box sx={{ mb: { xs: 4, md: 6 } }}>
        <Typography variant="h3" sx={{ fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.04em', fontSize: { xs: '1.8rem', md: '3rem' } }}>
          Olá, Administrador
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.7)', mt: 0.5, fontSize: { xs: '0.9rem', md: '1.1rem' } }}>
          O pulso do seu ministério hoje.
        </Typography>
      </Box>

      <Grid container spacing={{ xs: 2, md: 4 }}>
        <Grid item xs={12} lg={7}>
          <Paper elevation={0} sx={{ 
            p: { xs: 3, md: 5 }, borderRadius: 6, background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', 
            position: 'relative', overflow: 'hidden', minHeight: { xs: 180, md: 240 } 
          }}>
             <Typography variant="overline" sx={{ fontWeight: 900, color: 'rgba(255,255,255,0.9)', letterSpacing: 2 }}>PRÓXIMA ESCALA</Typography>
             <Typography variant="h2" sx={{ fontWeight: 950, color: '#FFFFFF', mt: 1, fontSize: { xs: '1.5rem', md: '3rem' } }}>
                {proximoEvento ? proximoEvento.titulo : "Sem escalas agendadas"}
             </Typography>
             <Activity size={240} style={{ position: 'absolute', right: -40, bottom: -60, opacity: 0.1, color: 'white' }} />
          </Paper>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Stack spacing={2}>
            {[{ label: 'Repertório', val: musicas.length, col: '#818cf8', ic: <Music size={20}/> }, 
              { label: 'Equipe', val: membros.length, col: '#34d399', ic: <Users size={20}/> }].map(s => (
              <Paper key={s.label} elevation={0} sx={{ 
                p: 2.5, borderRadius: 5, background: 'rgba(255, 255, 255, 0.05)', 
                border: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', gap: 3 
              }}>
                <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: alpha(s.col, 0.2), color: s.col }}>{s.ic}</Box>
                <Box>
                  <Typography variant="h5" fontWeight={900} color="#FFF">{s.val}</Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 800 }}>{s.label}</Typography>
                </Box>
              </Paper>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}