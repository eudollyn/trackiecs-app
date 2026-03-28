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
  const [showLyrics, setShowLyrics] = useState(true);
  const [timer, setTimer] = useState(0);

  const evento = eventos.find(e => e.id === id);
  const setlistIds = evento?.setlist || [];
  const musicaAtual = musicas.find(m => m.id === setlistIds[currentSongIndex]);

  useEffect(() => {
    const i = setInterval(() => setTimer(s => s + 1), 1000);
    return () => clearInterval(i);
  }, []);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!evento) return <Box sx={{ p: 10, color: 'white' }}>Evento não encontrado</Box>;

  return (
    <Box sx={{ position: 'fixed', inset: 0, bgcolor: '#020617', zIndex: 9999, color: 'white', display: 'flex', flexDirection: 'column' }}>
      
      {/* HEADER COMPACTO PARA CELULAR */}
      <Box sx={{ p: { xs: 2, md: 3 }, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <IconButton onClick={() => navigate(-1)} sx={{ color: 'white' }}><X size={24}/></IconButton>
          
          <Box sx={{ textAlign: 'center', flex: 1, px: 2, overflow: 'hidden' }}>
            <Typography noWrap sx={{ 
              fontWeight: 900, 
              fontSize: { xs: '1.2rem', md: '2rem' }, 
              color: '#818cf8',
              lineHeight: 1.2
            }}>
              {musicaAtual?.titulo || "Fim"}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.5, letterSpacing: 2, textTransform: 'uppercase', display: { xs: 'none', sm: 'block' } }}>
              {evento.titulo}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton 
              onClick={() => setShowLyrics(!showLyrics)} 
              sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}
            >
              {showLyrics ? <Music size={20} /> : <FileText size={20} />}
            </IconButton>
            <Typography sx={{ 
              fontVariantNumeric: 'tabular-nums', 
              fontWeight: 900, 
              color: '#34d399',
              fontSize: { xs: '1rem', md: '1.5rem' }
            }}>
              {formatTime(timer)}
            </Typography>
          </Stack>
        </Stack>
      </Box>

      {/* ÁREA DE CONTEÚDO EXPANDIDA */}
      <Box sx={{ flex: 1, p: { xs: 1.5, md: 3 }, overflow: 'hidden', display: 'flex' }}>
        <Paper elevation={0} sx={{ 
          flex: 1, borderRadius: { xs: 4, md: 6 }, 
          bgcolor: 'rgba(255,255,255,0.02)', 
          border: '1px solid rgba(255,255,255,0.05)', 
          display: 'flex', overflow: 'hidden'
        }}>
          {showLyrics ? (
            <Box sx={{ 
              width: '100%', p: { xs: 2, md: 6 }, 
              overflowY: 'auto', 
              textAlign: 'center' 
            }}>
              <Typography sx={{ 
                whiteSpace: 'pre-line', 
                fontSize: { xs: '1.5rem', md: '2.5rem' }, // Ajustado para não quebrar a tela
                lineHeight: 1.6, 
                fontWeight: 600, 
                color: '#FFF' 
              }}>
                {musicaAtual?.letra || "Sem letra."}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ m: 'auto', textAlign: 'center' }}>
              <Typography sx={{ fontSize: { xs: '8rem', md: '15rem' }, fontWeight: 950, color: '#818cf8', lineHeight: 0.8 }}>
                {musicaAtual?.tom}
              </Typography>
              <Typography sx={{ mt: 2, opacity: 0.4, fontSize: { xs: '1.2rem', md: '3rem' } }}>{musicaAtual?.artista}</Typography>
              <Stack direction="row" spacing={5} sx={{ mt: 5, justifyContent: 'center' }}>
                <Box><Typography variant="caption" sx={{ opacity: 0.3 }}>BPM</Typography><Typography variant="h4" fontWeight={900}>{musicaAtual?.bpm || '--'}</Typography></Box>
                <Box><Typography variant="caption" sx={{ opacity: 0.3 }}>ENERGIA</Typography><Typography variant="h4" fontWeight={900}>{musicaAtual?.intensidade}</Typography></Box>
              </Stack>
            </Box>
          )}
        </Paper>
      </Box>

      {/* CONTROLES INFERIORES */}
      <Stack direction="row" justifyContent="center" spacing={4} sx={{ pb: { xs: 4, md: 6 }, pt: 2 }}>
        <IconButton 
          disabled={currentSongIndex === 0} 
          onClick={() => setCurrentSongIndex(i => i - 1)}
          sx={{ width: 60, height: 60, bgcolor: 'rgba(255,255,255,0.05)', color: 'white' }}
        >
          <ChevronLeft size={30} />
        </IconButton>
        
        <IconButton 
          disabled={currentSongIndex === setlistIds.length - 1} 
          onClick={() => setCurrentSongIndex(i => i + 1)}
          sx={{ width: 80, height: 80, bgcolor: '#818cf8', color: 'white', '&:hover': { bgcolor: '#6366f1' } }}
        >
          <ChevronRight size={40} />
        </IconButton>
      </Stack>
    </Box>
  );
}