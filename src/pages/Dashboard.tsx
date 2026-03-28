import React from 'react';
import { 
  Box, Typography, Paper, Stack, alpha, Button, Avatar, AvatarGroup, Grid 
} from '@mui/material';
import { Music, Users, Calendar, Clock, Activity, Plus, FileText } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { format, isAfter, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

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
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.08)',
      transform: 'translateY(-8px)',
      borderColor: 'rgba(255, 255, 255, 0.3)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
    }
  };

  return (
    <Box sx={{ animation: 'fadeIn 0.6s ease-out' }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.04em' }}>
          Olá, Administrador
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', mt: 1 }}>
          O pulso espiritual do seu ministério em tempo real.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={7}>
          <Paper elevation={0} sx={{ 
            p: 5, borderRadius: 7, background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            boxShadow: '0 24px 48px rgba(99, 102, 241, 0.4)', position: 'relative', overflow: 'hidden', minHeight: 240,
            display: 'flex', flexDirection: 'column', justifyContent: 'center'
          }}>
             <Box sx={{ position: 'relative', zIndex: 1 }}>
               <Typography variant="overline" sx={{ fontWeight: 900, letterSpacing: 3, color: 'rgba(255,255,255,0.9)' }}>PRÓXIMA ESCALA</Typography>
               {proximoEvento ? (
                 <>
                   <Typography variant="h2" sx={{ fontWeight: 950, mt: 1, mb: 2, color: '#FFFFFF' }}>{proximoEvento.titulo}</Typography>
                   <Stack direction="row" spacing={3} alignItems="center">
                     <Stack direction="row" spacing={1} alignItems="center">
                       <Clock size={20} color="white" />
                       <Typography variant="h6" fontWeight={700} sx={{ color: 'white' }}>
                         {format(parseISO(proximoEvento.data), "dd/MM", { locale: ptBR })}
                       </Typography>
                     </Stack>
                     <AvatarGroup max={4}>
                        {proximoEvento.equipe.map((s, i) => (
                          <Avatar key={i} sx={{ width: 32, height: 32, border: '2px solid #6366f1', bgcolor: '#818cf8' }}>
                            {membros.find(m => m.id === s.membroId)?.nome[0]}
                          </Avatar>
                        ))}
                     </AvatarGroup>
                   </Stack>
                 </>
               ) : (
                 <Typography variant="h4" sx={{ mt: 2, fontWeight: 800, color: '#FFFFFF' }}>Nenhuma escala agendada</Typography>
               )}
             </Box>
             <Activity size={320} style={{ position: 'absolute', right: -60, bottom: -80, opacity: 0.15, color: 'white' }} />
          </Paper>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Stack spacing={2.5}>
            {[
              { label: 'Repertório', val: musicas.length, ic: <Music />, col: '#818cf8' },
              { label: 'Ministros', val: membros.length, ic: <Users />, col: '#34d399' },
              { label: 'Escalas', val: eventos.length, ic: <Calendar />, col: '#fbbf24' }
            ].map(s => (
              <Paper key={s.label} elevation={0} sx={{ ...glassStyle, p: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: alpha(s.col, 0.2), color: s.col }}>{s.ic}</Box>
                <Box>
                  <Typography variant="h4" fontWeight={900} sx={{ color: '#FFFFFF' }}>{s.val}</Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 800, textTransform: 'uppercase' }}>{s.label}</Typography>
                </Box>
              </Paper>
            ))}
          </Stack>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ ...glassStyle, p: 4 }}>
            <Typography variant="h6" fontWeight={800} sx={{ color: '#FFFFFF', mb: 4 }}>
              Dinâmica do Louvor
            </Typography>
            {/* ADICIONE HEIGHT: 300 E MINWIDTH: 0 AQUI */}
            <Box sx={{ width: '100%', height: 300, minWidth: 0 }}> 
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getDadosEnergia()}>
                  <Tooltip contentStyle={{ background: '#131c2e', border: 'none', borderRadius: 12 }} />
                  <Area type="monotone" dataKey="energia" stroke="#818cf8" fill="#818cf8" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>        

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, borderRadius: 7, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', height: '100%' }}>
            <Typography variant="h6" fontWeight={800} sx={{ mb: 4, color: '#FFFFFF' }}>Ações Rápidas</Typography>
            <Stack spacing={2}>
              <Button fullWidth variant="contained" onClick={() => navigate('/escalas')} sx={{ py: 2, borderRadius: 3, bgcolor: '#818cf8', fontWeight: 900 }}>Lançar Nova Escala</Button>
              <Button fullWidth variant="outlined" startIcon={<Plus size={18} />} onClick={() => navigate('/musicas')} sx={{ py: 2, borderRadius: 3, color: '#FFF', borderColor: 'rgba(255,255,255,0.2)' }}>Nova Música</Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}