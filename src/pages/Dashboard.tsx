import React from 'react';
import { Box, Typography, Paper, Stack, alpha, Button, Avatar, Grid } from '@mui/material'; 
import { Music, Calendar, Clock, Activity, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { isAfter, parseISO, format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const navigate = useNavigate();
  const { musicas, membros, eventos, currentMemberId } = useAppStore();

  const isAdmin = currentMemberId === 'admin';
  
  // Próximo evento geral
  const proximoGeral = eventos
    ?.filter(ev => ev.data && isAfter(parseISO(ev.data), new Date()))
    .sort((a, b) => parseISO(a.data).getTime() - parseISO(b.data).getTime())[0];

  // Próximos eventos ONDE EU ESTOU ESCALADO
  const minhasEscalas = eventos
    ?.filter(ev => ev.equipe?.some((s:any) => s.membroId === currentMemberId))
    .sort((a, b) => parseISO(a.data).getTime() - parseISO(b.data).getTime());

  const getDadosEnergia = () => {
    const ev = proximoGeral;
    if (!ev?.setlist) return [];
    return ev.setlist.map((mId:string, i:number) => ({
      name: musicas.find(m => m.id === mId)?.titulo || i,
      energia: musicas.find(m => m.id === mId)?.intensidade || 5
    }));
  };

  const glassStyle = {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: 5,
    p: 3
  };

  return (
    <Box sx={{ animation: 'fadeIn 0.6s ease-out' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={900} color="white">
          {isAdmin ? "Painel de Gestão" : "Minha Agenda"}
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>Bem-vindo de volta ao TrackIECS</Typography>
      </Box>

      <Grid container spacing={3}>
        {/* SE FOR ADMIN: MOSTRA O PULSO DO MINISTÉRIO */}
        {isAdmin && (
          <>
            <Grid item xs={12} lg={8}>
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
                  Gerenciar Escala
                </Button>
                <Activity size={240} style={{ position: 'absolute', right: -40, bottom: -60, opacity: 0.1, color: 'white' }} />
              </Paper>
            </Grid>
            <Grid item xs={12} lg={4}>
               <Stack spacing={2}>
                  <Paper sx={glassStyle}>
                    <Typography variant="h4" fontWeight={900} color="#818cf8">{musicas.length}</Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 900 }}>MÚSICAS NO ACERVO</Typography>
                  </Paper>
                  <Paper sx={glassStyle}>
                    <Typography variant="h4" fontWeight={900} color="#34d399">{membros.length}</Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 900 }}>MINISTROS ATIVOS</Typography>
                  </Paper>
               </Stack>
            </Grid>
          </>
        )}

        {/* SE FOR MÚSICO: MOSTRA "SUA PRÓXIMA TOCADA" */}
        {!isAdmin && (
          <Grid item xs={12}>
             {minhasEscalas?.length > 0 ? (
               <Paper sx={{ p: 4, borderRadius: 6, border: '2px solid #818cf8', background: 'rgba(129, 140, 248, 0.05)' }}>
                  <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                    <CheckCircle2 color="#818cf8" />
                    <Typography variant="h5" fontWeight={900} color="white">Você toca no próximo evento!</Typography>
                  </Stack>
                  <Typography variant="h3" color="white" fontWeight={900} mb={3}>{minhasEscalas[0].titulo}</Typography>
                  <Button variant="contained" fullWidth size="large" onClick={() => navigate('/escalas')} sx={{ bgcolor: '#818cf8', py: 2, fontWeight: 900 }}>VER MINHAS FUNÇÕES E REPERTÓRIO</Button>
               </Paper>
             ) : (
               <Paper sx={glassStyle}>
                 <Typography color="white">Você ainda não foi escalado para os próximos dias.</Typography>
               </Paper>
             )}
          </Grid>
        )}

        {/* GRÁFICO (RECHART) SEMPRE VISÍVEL PARA PLANEJAMENTO */}
        <Grid item xs={12}>
           <Paper sx={{ ...glassStyle, height: 350 }}>
              <Typography variant="h6" fontWeight={800} color="white" mb={3}>Curva de Intensidade do Repertório</Typography>
              <Box sx={{ width: '100%', height: 230 }}>
                <ResponsiveContainer>
                  <AreaChart data={getDadosEnergia()}>
                    <Tooltip contentStyle={{ background: '#131c2e', border: 'none', borderRadius: 10, color: '#fff' }} />
                    <Area type="monotone" dataKey="energia" stroke="#818cf8" strokeWidth={4} fill="#818cf8" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
           </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}