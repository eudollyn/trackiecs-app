import React from 'react';
import { Box, Typography, Paper, Stack, alpha, Button, AvatarGroup, Avatar } from '@mui/material';
import { Music, Users, Activity, ArrowRight, Clock } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { isAfter, parseISO, format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const navigate = useNavigate();
  const { musicas, membros, eventos, currentMemberId } = useAppStore();
  const isAdmin = currentMemberId === 'admin';
  
  const proximo = eventos?.filter((ev:any) => ev.data && isAfter(parseISO(ev.data), new Date()))
    .sort((a:any, b:any) => parseISO(a.data).getTime() - parseISO(b.data).getTime())[0];

  const chartData = proximo?.setlist?.map((id:string, i:number) => ({
    name: musicas.find((m:any) => m.id === id)?.titulo || i,
    energia: musicas.find((m:any) => m.id === id)?.intensidade || 5
  })) || [];

  return (
    <Box sx={{ animation: 'fadeIn 0.6s ease-out' }}>
      <Typography variant="h3" fontWeight={950} color="white" mb={4} sx={{ fontSize: { xs: '2rem', md: '3.5rem' } }}>
        TrackIECS
      </Typography>

      <Stack spacing={4}>
        {/* HERO CARD - DEGRADÊ RESTAURADO */}
        <Paper elevation={0} sx={{ 
          p: { xs: 4, md: 5 }, borderRadius: 8, 
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          position: 'relative', overflow: 'hidden', minHeight: 220 
        }}>
          <Typography variant="overline" sx={{ fontWeight: 900, color: 'rgba(255,255,255,0.7)', letterSpacing: 2 }}>PRÓXIMA ESCALA</Typography>
          <Typography variant="h2" fontWeight={950} color="white" sx={{ fontSize: { xs: '2rem', md: '3.5rem' } }}>
            {proximo ? proximo.titulo : "Nenhum Culto"}
          </Typography>
          <Button 
            variant="contained" 
            endIcon={<ArrowRight />} 
            onClick={() => navigate('/escalas')}
            sx={{ mt: 3, bgcolor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(5px)', fontWeight: 800, borderRadius: 2 }}
          >
            GERENCIAR
          </Button>
          <Activity size={240} style={{ position: 'absolute', right: -40, bottom: -80, opacity: 0.12, color: 'white' }} />
        </Paper>

        {/* ESTATÍSTICAS EM FILA (STÁTICO - SEM GRID) */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
           <Paper sx={{ flex: 1, p: 3, borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Typography variant="h4" fontWeight={950} color="#818cf8">{musicas.length}</Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 800 }}>LOUVORES NO ACERVO</Typography>
           </Paper>
           <Paper sx={{ flex: 1, p: 3, borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Typography variant="h4" fontWeight={950} color="#34d399">{membros.length}</Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 800 }}>MEMBROS NA EQUIPE</Typography>
           </Paper>
        </Stack>

        {/* GRÁFICO - SEM GRID */}
        <Paper sx={{ p: 4, borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
           <Typography variant="h6" fontWeight={800} color="white" mb={3}>Dinâmica de Intensidade</Typography>
           <Box sx={{ width: '100%', height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <Area type="monotone" dataKey="energia" stroke="#818cf8" fill="#818cf8" fillOpacity={0.2} strokeWidth={4} />
                </AreaChart>
              </ResponsiveContainer>
           </Box>
        </Paper>
      </Stack>
    </Box>
  );
}