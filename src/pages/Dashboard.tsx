import React from 'react';
import { 
  Box, Typography, Paper, Stack, alpha, Button, Avatar, AvatarGroup, Grid 
} from '@mui/material';
import { Music, Users, Calendar, Clock, Activity } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { format, isAfter, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, Tooltip, ResponsiveContainer, XAxis, YAxis } from 'recharts';

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
      return { name: musica?.titulo || `Música ${index + 1}`, energia: musica?.intensidade || 5 };
    });
  };

  const glassStyle = {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: 6,
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': { transform: 'translateY(-8px)', borderColor: 'rgba(255, 255, 255, 0.3)' }
  };

  return (
    <Box sx={{ animation: 'fadeIn 0.6s ease-out' }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.04em' }}>Olá, Administrador</Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.7)', mt: 1 }}>O pulso do seu ministério em tempo real.</Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={7}>
          <Paper elevation={0} sx={{ p: 5, borderRadius: 7, background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', position: 'relative', overflow: 'hidden', minHeight: 220 }}>
             <Box sx={{ position: 'relative', zIndex: 1 }}>
               <Typography variant="overline" sx={{ fontWeight: 900, color: 'rgba(255,255,255,0.9)' }}>PRÓXIMA ESCALA</Typography>
               {proximoEvento ? <Typography variant="h2" sx={{ fontWeight: 950, color: '#FFFFFF' }}>{proximoEvento.titulo}</Typography> : <Typography variant="h4" sx={{ color: '#FFFFFF' }}>Nenhuma escala agendada</Typography>}
             </Box>
             <Activity size={320} style={{ position: 'absolute', right: -60, bottom: -80, opacity: 0.15, color: 'white' }} />
          </Paper>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Stack spacing={2.5}>
            {[{ label: 'Repertório', val: musicas.length, col: '#818cf8', ic: <Music /> }, { label: 'Ministros', val: membros.length, col: '#34d399', ic: <Users /> }].map(s => (
              <Paper key={s.label} sx={{ ...glassStyle, p: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: alpha(s.col, 0.2), color: s.col }}>{s.ic}</Box>
                <Box>
                  <Typography variant="h4" fontWeight={900} sx={{ color: '#FFFFFF' }}>{s.val}</Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 800 }}>{s.label}</Typography>
                </Box>
              </Paper>
            ))}
          </Stack>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ ...glassStyle, p: 4, height: 400 }}>
            <Typography variant="h6" fontWeight={800} sx={{ color: '#FFFFFF', mb: 4 }}>Dinâmica do Louvor</Typography>
            <Box sx={{ width: '100%', height: 280, minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getDadosEnergia()}>
                  <Tooltip contentStyle={{ background: '#131c2e', border: 'none', borderRadius: 12, color: '#fff' }} />
                  <Area type="monotone" dataKey="energia" stroke="#818cf8" strokeWidth={4} fill="#818cf8" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}