import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Stack, IconButton, Paper, Grid, Button } from '@mui/material';
import { ChevronLeft, ChevronRight, X, Clock, FileText, Music } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function StageMode() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { eventos, musicas } = useAppStore();
  
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [showLyrics, setShowLyrics] = useState(true); // Começa na letra por padrão
  const [timer, setTimer] = useState(0);

  const evento = eventos.find(e => e.id === id);
  const musicaAtual = musicas.find(m => m.id === (evento?.setlist[currentSongIndex]));

  useEffect(() => {
    const i = setInterval(() => setTimer(s => s + 1), 1000);
    return () => clearInterval(i);
  }, []);

  if (!evento) return <Box sx={{ p: 10, color: 'white' }}>Evento não encontrado</Box>;

  return (
    <Box sx={{ position: 'fixed', inset: 0, bgcolor: '#020617', zIndex: 9999, color: 'white', p: 4, display: 'flex', flexDirection: 'column' }}>
      
      {/* HEADER LIMPO */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ color: 'rgba(255,255,255,0.3)' }}><X size={30}/></IconButton>
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" fontWeight={900} sx={{ color: '#818cf8' }}>{musicaAtual?.titulo}</Typography>
          <Typography variant="overline" sx={{ opacity: 0.5, letterSpacing: 4 }}>{evento.titulo}</Typography>
        </Box>

        <Stack direction="row" spacing={2}>
           <Button 
            variant="contained" 
            startIcon={showLyrics ? <Music /> : <FileText />} 
            onClick={() => setShowLyrics(!showLyrics)}
            sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 3, fontWeight: 800, color: 'white' }}
           >
             {showLyrics ? "Ver Tom" : "Ver Letra"}
           </Button>
           <Typography variant="h4" sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 900, color: '#34d399', ml: 2 }}>
             {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
           </Typography>
        </Stack>
      </Stack>

      <Grid container spacing={3} sx={{ flex: 1, overflow: 'hidden' }}>
        {/* ÁREA PRINCIPAL DA MÚSICA */}
        <Grid item xs={12} md={9} sx={{ height: '100%' }}>
          <Paper elevation={0} sx={{ 
            height: '100%', borderRadius: 6, bgcolor: 'rgba(255,255,255,0.02)', 
            border: '2px solid rgba(255,255,255,0.05)', display: 'flex', p: 4,
            overflow: 'hidden' // Container pai fixo
          }}>
            {showLyrics ? (
              <Box sx={{ 
                width: '100%', 
                height: '100%', 
                overflowY: 'auto', // ATIVA A ROLAGEM DA LETRA
                pr: 2,
                '&::-webkit-scrollbar': { width: '8px' },
                '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '10px' }
              }}>
                <Typography sx={{ 
                  whiteSpace: 'pre-line', 
                  fontSize: '2.5rem', // FONTE GIGANTE PARA PALCO
                  lineHeight: 1.5, 
                  textAlign: 'center', 
                  fontWeight: 700,
                  color: '#FFFFFF', // BRANCO PURO PARA CONTRASTE
                  textShadow: '0 0 20px rgba(0,0,0,0.5)'
                }}>
                  {musicaAtual?.letra || "Letra não cadastrada."}
                </Typography>
              </Box>
            ) : (
              <Box sx={{ m: 'auto', textAlign: 'center' }}>
                <Typography variant="h1" sx={{ fontSize: '18rem', fontWeight: 950, color: '#818cf8', lineHeight: 0.8 }}>{musicaAtual?.tom}</Typography>
                <Typography variant="h3" sx={{ mt: 4, opacity: 0.4 }}>{musicaAtual?.artista}</Typography>
                <Stack direction="row" spacing={10} sx={{ mt: 8, justifyContent: 'center' }}>
                  <Box><Typography sx={{ opacity: 0.3, letterSpacing: 2 }}>BPM</Typography><Typography variant="h2" fontWeight={900}>{musicaAtual?.bpm || '--'}</Typography></Box>
                  <Box><Typography sx={{ opacity: 0.3, letterSpacing: 2 }}>ENERGIA</Typography><Typography variant="h2" fontWeight={900}>{musicaAtual?.intensidade}</Typography></Box>
                </Stack>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* LISTA LATERAL (SETLIST) */}
        <Grid item xs={12} md={3} sx={{ height: '100%' }}>
           <Stack spacing={2} sx={{ height: '100%', overflowY: 'auto' }}>
              <Typography variant="overline" sx={{ opacity: 0.3, fontWeight: 900 }}>SETLIST</Typography>
              {evento.setlist.map((mid, idx) => {
                const m = musicas.find(x => x.id === mid);
                const active = idx === currentSongIndex;
                return (
                  <Paper 
                    key={mid} 
                    onClick={() => setCurrentSongIndex(idx)}
                    sx={{ 
                      p: 3, borderRadius: 4, cursor: 'pointer',
                      bgcolor: active ? '#818cf8' : 'rgba(255,255,255,0.03)', 
                      color: active ? 'white' : 'rgba(255,255,255,0.3)',
                      border: active ? 'none' : '1px solid rgba(255,255,255,0.05)'
                    }}
                  >
                    <Typography variant="h6" fontWeight={800} noWrap>{idx + 1}. {m?.titulo}</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 800 }}>{m?.tom}</Typography>
                  </Paper>
                );
              })}
           </Stack>
        </Grid>
      </Grid>

      {/* NAVEGAÇÃO INFERIOR */}
      <Stack direction="row" justifyContent="center" spacing={4} sx={{ mt: 3 }}>
        <IconButton disabled={currentSongIndex === 0} onClick={() => setCurrentSongIndex(i => i - 1)} sx={{ width: 80, height: 80, bgcolor: 'rgba(255,255,255,0.05)', color: 'white' }}><ChevronLeft size={40} /></IconButton>
        <IconButton disabled={currentSongIndex === evento.setlist.length - 1} onClick={() => setCurrentSongIndex(i => i + 1)} sx={{ width: 80, height: 80, bgcolor: '#818cf8', color: 'white' }}><ChevronRight size={40} /></IconButton>
      </Stack>
    </Box>
  );
}