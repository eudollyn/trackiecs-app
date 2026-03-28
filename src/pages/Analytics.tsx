import React from 'react';
import { Box, Typography, Grid, Paper, Stack, LinearProgress } from '@mui/material';
import { AlertTriangle, History, Mic2, TrendingUp } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { motion } from 'framer-motion';

export default function Analytics() {
  const { musicas, eventos, membros } = useAppStore();

  const glassStyle = {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: 7,
    p: 4,
    color: 'white'
  };

  const tonsCount = musicas.reduce((acc: any, m) => {
    acc[m.tom] = (acc[m.tom] || 0) + 1;
    return acc;
  }, {});

  return (
    <Box 
      component={motion.div} 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.8 }}
    >
      <Typography variant="h3" fontWeight={900} sx={{ color: '#FFF', mb: 1, letterSpacing: '-0.04em' }}>Insights</Typography>
      <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 6 }}>Análise inteligente do seu ministério.</Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper 
            component={motion.div}
            whileHover={{ scale: 1.02 }}
            sx={{ ...glassStyle, borderLeft: '6px solid #f87171', animation: 'float 6s ease-in-out infinite' }}
          >
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <AlertTriangle color="#f87171" size={28} />
              <Typography variant="h5" fontWeight={900}>Saúde da Equipe</Typography>
            </Stack>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)', mb: 4 }}>Ministros com alto volume de escalas:</Typography>
            <Stack spacing={2}>
              {membros.slice(0, 2).map(m => (
                <Box key={m.id} sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 3 }}>
                  <Typography variant="subtitle1" fontWeight={800}>{m.nome}</Typography>
                  <Typography variant="caption" sx={{ color: '#f87171', fontWeight: 700 }}>⚠️ ALERTA DE BURN-OUT</Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper 
            component={motion.div}
            whileHover={{ scale: 1.02 }}
            sx={{ ...glassStyle, borderLeft: '6px solid #fbbf24', animation: 'float 8s ease-in-out infinite 1s' }}
          >
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <History color="#fbbf24" size={28} />
              <Typography variant="h5" fontWeight={900}>Rotatividade</Typography>
            </Stack>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)', mb: 4 }}>Músicas que precisam voltar ao repertório:</Typography>
            <Stack spacing={2}>
              {musicas.slice(0, 3).map(m => (
                <Stack key={m.id} direction="row" justifyContent="space-between" sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 3 }}>
                  <Typography variant="body2" fontWeight={800}>{m.titulo}</Typography>
                  <Typography variant="caption" sx={{ color: '#fbbf24' }}>Gaveta há 45 dias</Typography>
                </Stack>
              ))}
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={glassStyle}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
              <Mic2 color="#818cf8" size={28} />
              <Typography variant="h5" fontWeight={900}>Esforço Vocal (Tons)</Typography>
            </Stack>
            <Grid container spacing={3}>
              {Object.entries(tonsCount).map(([tom, count]: any) => (
                <Grid item xs={6} md={2.4} key={tom}>
                  <Typography variant="h3" fontWeight={900} sx={{ color: '#818cf8', mb: 1 }}>{tom}</Typography>
                  <LinearProgress variant="determinate" value={(count / musicas.length) * 100} sx={{ height: 10, borderRadius: 5, bgcolor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { bgcolor: '#818cf8' } }} />
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', mt: 1, display: 'block' }}>{count} músicas</Typography>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </Box>
  );
}