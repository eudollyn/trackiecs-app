import React from 'react';
import { Box, Typography, Paper, Stack, Grid, alpha } from '@mui/material';
import { Music, Calendar, Activity } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { parseISO, isAfter } from 'date-fns';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { musicas, membros, eventos } = useAppStore();
  
  const proximo = eventos?.filter((e:any) => e.data && isAfter(parseISO(e.data), new Date()))
    .sort((a:any, b:any) => parseISO(a.data).getTime() - parseISO(b.data).getTime())[0];

  const chartData = proximo?.setlist?.map((id:string, i:number) => ({
    name: musicas.find((m:any) => m.id === id)?.titulo || i,
    energia: musicas.find((m:any) => m.id === id)?.intensidade || 5
  })) || [];

  return (
    <Box sx={{ animation: 'fadeIn 0.5s ease' }}>
      <Typography variant="h4" fontWeight={900} color="white" sx={{ mb: 4, fontSize: {xs: '1.8rem', md: '2.5rem'} }}>Dashboard</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: {xs: 3, md: 4}, borderRadius: 6, background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', position: 'relative', overflow: 'hidden', minHeight: 200 }}>
             <Typography variant="overline" sx={{ fontWeight: 900, color: 'rgba(255,255,255,0.7)' }}>PRÓXIMA ESCALA</Typography>
             <Typography variant="h3" fontWeight={950} color="white" mt={1} sx={{fontSize: {xs: '1.5rem', md: '2.5rem'}}}>{proximo ? proximo.titulo : "Sem eventos agendados"}</Typography>
             <Activity size={200} style={{ position: 'absolute', right: -30, bottom: -40, opacity: 0.1, color: 'white' }} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Stack spacing={2}>
            <Paper sx={{ p: 2, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
               <Typography variant="h4" fontWeight={900} color="#818cf8">{musicas.length}</Typography>
               <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 800 }}>MÚSICAS NO REPERTÓRIO</Typography>
            </Paper>
            <Paper sx={{ p: 2, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
               <Typography variant="h4" fontWeight={900} color="#34d399">{membros.length}</Typography>
               <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 800 }}>MINISTROS CADASTRADOS</Typography>
            </Paper>
          </Stack>
        </Grid>
        <Grid item xs={12}>
           <Paper sx={{ p: 3, borderRadius: 6, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', minHeight: 300 }}>
              <Typography variant="h6" fontWeight={800} color="white" mb={3}>Curva de Intensidade do Louvor</Typography>
              <Box sx={{ width: '100%', height: 200 }}>
                 <ResponsiveContainer>
                    <AreaChart data={chartData}>
                       <Tooltip contentStyle={{ background: '#131c2e', border: 'none', color: '#fff' }} />
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