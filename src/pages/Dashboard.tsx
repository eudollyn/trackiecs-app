import React from 'react';
import { Box, Typography, Paper, Stack, alpha, Button, Grid } from '@mui/material'; 
import { Music, Calendar, Activity, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { isAfter, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const navigate = useNavigate();
  const { musicas, membros, eventos, currentMemberId } = useAppStore();
  const isAdmin = currentMemberId === 'admin';
  
  const proximoGeral = eventos
    ?.filter((ev:any) => ev.data && isAfter(parseISO(ev.data), new Date()))
    .sort((a:any, b:any) => parseISO(a.data).getTime() - parseISO(b.data).getTime())[0];

  const minhasEscalas = eventos
    ?.filter((ev:any) => ev.equipe?.some((s:any) => s.membroId === currentMemberId))
    .sort((a:any, b:any) => parseISO(a.data).getTime() - parseISO(b.data).getTime());

  const getDadosEnergia = () => {
    if (!proximoGeral?.setlist) return [];
    return proximoGeral.setlist.map((mId:string, i:number) => ({
      name: musicas.find((m:any) => m.id === mId)?.titulo || i,
      energia: musicas.find((m:any) => m.id === mId)?.intensidade || 5
    }));
  };

  const glassStyle = {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: 6,
    p: 3
  };

  return (
    <Box sx={{ animation: 'fadeIn 0.6s ease-out' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={900} color="white">
          {isAdmin ? "Painel de Gestão" : "Minha Agenda"}
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>Bem-vindo de volta!</Typography>
      </Box>

      {/* Grid corrigido: removi o 'item' que causava erro no mobile */}
      <Grid container spacing={3}>
        {isAdmin ? (
          <>
            <Grid xs={12} md={8}>
              <Paper elevation={0} sx={{ 
                p: 4, borderRadius: 6, background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                position: 'relative', overflow: 'hidden', minHeight: 200 
              }}>
                <Typography variant="overline" sx={{ fontWeight: 900, color: 'rgba(255,255,255,0.7)' }}>CONVOCAÇÃO ATIVA</Typography>
                <Typography variant="h3" fontWeight={900} color="white" mt={1}>
                  {proximoGeral ? proximoGeral.titulo : "Nenhum Culto"}
                </Typography>
                <Button variant="contained" endIcon={<ArrowRight />} onClick={() => navigate('/escalas')} 
                        sx={{ mt: 3, bgcolor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(5px)', fontWeight: 800 }}>
                  Ver Escalas
                </Button>
                <Activity size={200} style={{ position: 'absolute', right: -30, bottom: -50, opacity: 0.1, color: 'white' }} />
              </Paper>
            </Grid>
            <Grid xs={12} md={4}>
               <Stack spacing={2}>
                  <Paper sx={glassStyle}>
                    <Typography variant="h4" fontWeight={900} color="#818cf8">{musicas.length}</Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 900 }}>MÚSICAS</Typography>
                  </Paper>
                  <Paper sx={glassStyle}>
                    <Typography variant="h4" fontWeight={900} color="#34d399">{membros.length}</Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 900 }}>MINISTROS</Typography>
                  </Paper>
               </Stack>
            </Grid>
          </>
        ) : (
          <Grid xs={12}>
             <Paper sx={{ p: 4, borderRadius: 6, border: '1px solid #818cf8', background: 'rgba(129, 140, 248, 0.05)' }}>
                <Typography variant="h5" fontWeight={900} color="white" mb={1}>Você toca na próxima escala!</Typography>
                <Typography color="#818cf8" fontWeight={800}>{minhasEscalas[0]?.titulo || "Sem eventos"}</Typography>
                <Button fullWidth variant="contained" onClick={() => navigate('/escalas')} sx={{ mt: 3, bgcolor: '#818cf8' }}>VER REPERTÓRIO</Button>
             </Paper>
          </Grid>
        )}

        <Grid xs={12}>
           <Paper sx={{ ...glassStyle, minHeight: 350 }}>
              <Typography variant="h6" fontWeight={800} color="white" mb={3}>Dinâmica de Intensidade</Typography>
              {/* Box com altura definida para parar o aviso do Recharts */}
              <Box sx={{ width: '100%', height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={getDadosEnergia()}>
                    <Tooltip contentStyle={{ background: '#131c2e', border: 'none', color: '#fff' }} />
                    <Area type="monotone" dataKey="energia" stroke="#818cf8" fill="#818cf8" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
           </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}