import React from 'react';
import { Box, Typography, Paper, Stack, alpha, Button, Grid } from '@mui/material'; 
import { Music, Calendar, Activity, ArrowRight } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { isAfter, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const navigate = useNavigate();
  const { musicas, membros, eventos, currentMemberId } = useAppStore();
  const isAdmin = currentMemberId === 'admin';
  
  const proximo = eventos?.filter((e:any) => e.data && isAfter(parseISO(e.data), new Date()))
    .sort((a:any, b:any) => parseISO(a.data).getTime() - parseISO(b.data).getTime())[0];

  const getDadosEnergia = () => {
    if (!proximo?.setlist) return [];
    return proximo.setlist.map((id:string, i:number) => ({
      name: musicas.find((m:any) => m.id === id)?.titulo || i,
      energia: musicas.find((m:any) => m.id === id)?.intensidade || 5
    }));
  };

  return (
    <Box sx={{ animation: 'fadeIn 0.6s ease-out' }}>
      <Typography variant="h4" fontWeight={900} color="white" mb={4}>
        {isAdmin ? "Gestão Ministerial" : "Minha Agenda"}
      </Typography>

      <Grid container spacing={3}>
        {isAdmin && (
          <>
            <Grid xs={12} md={8}>
              <Paper sx={{ p: 4, borderRadius: 6, background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', position: 'relative', overflow: 'hidden', minHeight: 200 }}>
                <Typography variant="overline" sx={{ fontWeight: 900, color: 'rgba(255,255,255,0.7)' }}>PRÓXIMO CULTO</Typography>
                <Typography variant="h3" fontWeight={900} color="white" mt={1}>{proximo ? proximo.titulo : "Sem Escalas"}</Typography>
                <Button variant="contained" onClick={() => navigate('/escalas')} sx={{ mt: 3, bgcolor: 'rgba(255,255,255,0.2)', fontWeight: 800 }}>Ver Detalhes</Button>
                <Activity size={180} style={{ position: 'absolute', right: -20, bottom: -40, opacity: 0.1, color: 'white' }} />
              </Paper>
            </Grid>
            <Grid xs={12} md={4}>
               <Stack spacing={2}>
                  <Paper sx={{ p: 3, borderRadius: 5, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <Typography variant="h4" fontWeight={900} color="#818cf8">{musicas.length}</Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 900 }}>MÚSICAS</Typography>
                  </Paper>
                  <Paper sx={{ p: 3, borderRadius: 5, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <Typography variant="h4" fontWeight={900} color="#34d399">{membros.length}</Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 900 }}>MINISTROS</Typography>
                  </Paper>
               </Stack>
            </Grid>
          </>
        )}

        <Grid xs={12}>
           <Paper sx={{ p: 4, borderRadius: 6, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Typography variant="h6" fontWeight={800} color="white" mb={3}>Dinâmica de Intensidade</Typography>
              <Box sx={{ width: '100%', height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={getDadosEnergia()}>
                    <Tooltip contentStyle={{ background: '#131c2e', border: 'none', borderRadius: 10 }} />
                    <Area type="monotone" dataKey="energia" stroke="#818cf8" fill="#818cf8" fillOpacity={0.2} strokeWidth={4} />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
           </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}