import React from 'react';
import { Box, Typography, Paper, Stack, alpha, Button } from '@mui/material';
import { Music, Users, Activity } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { musicas, membros, eventos } = useAppStore();
  const proximo = eventos?.[0];

  const chartData = proximo?.setlist?.map((id:string, i:number) => ({
    name: i, energia: musicas.find((m:any) => m.id === id)?.intensidade || 5
  })) || [];

  return (
    <Box sx={{ animation: 'fadeIn 0.6s ease' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={900} color="white">Olá, Administrador</Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Gestão ministerial em tempo real.</Typography>
      </Box>

      {/* HERO CARD - PRÓXIMA ESCALA */}
      <Paper sx={{ 
        p: 4, borderRadius: 8, mb: 4, position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
        minHeight: 180, display: 'flex', flexDirection: 'column', justifyContent: 'center'
      }}>
        <Typography variant="overline" sx={{ fontWeight: 900, color: 'rgba(255,255,255,0.8)' }}>PRÓXIMO MOMENTO</Typography>
        <Typography variant="h3" fontWeight={900} color="white">{proximo ? proximo.titulo : "Sem escalas"}</Typography>
        <Activity size={200} style={{ position: 'absolute', right: -30, bottom: -50, opacity: 0.1, color: 'white' }} />
      </Paper>

      {/* STATS EM BOLHAS GLASS */}
      <Stack direction="row" spacing={2} sx={{ mb: 4, overflowX: 'auto', pb: 1 }}>
        <Paper sx={{ p: 2.5, borderRadius: 5, minWidth: 140, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <Music color="#818cf8" size={20} />
          <Typography variant="h5" fontWeight={900} color="white" mt={1}>{musicas.length}</Typography>
          <Typography variant="caption" color="rgba(255,255,255,0.4)" fontWeight={800}>MÚSICAS</Typography>
        </Paper>
        <Paper sx={{ p: 2.5, borderRadius: 5, minWidth: 140, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <Users color="#34d399" size={20} />
          <Typography variant="h5" fontWeight={900} color="white" mt={1}>{membros.length}</Typography>
          <Typography variant="caption" color="rgba(255,255,255,0.4)" fontWeight={800}>EQUIPE</Typography>
        </Paper>
      </Stack>

      {/* GRÁFICO SEGURO */}
      <Paper sx={{ p: 3, borderRadius: 6, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <Typography variant="subtitle1" fontWeight={800} color="white" mb={3}>Dinâmica do Repertório</Typography>
        <Box sx={{ width: '100%', height: 180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <Area type="monotone" dataKey="energia" stroke="#818cf8" fill="#818cf8" fillOpacity={0.2} strokeWidth={4} />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Box>
  );
}