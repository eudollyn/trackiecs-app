import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Stack, IconButton, Paper, Button } from '@mui/material';
import { ChevronLeft, ChevronRight, X, Music, Play, Pause, Zap } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function StageMode() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { eventos, musicas } = useAppStore();
  
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [showLyrics, setShowLyrics] = useState(true);
  const [timer, setTimer] = useState(0);
  
  // Estados da Inovação: Metrônomo e Scroll
  const [bpmPulse, setBpmPulse] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const evento = eventos.find(e => e.id === id);
  const setlistIds = evento?.setlist || [];
  const musicaAtual = musicas.find(m => m.id === setlistIds[currentSongIndex]);

  // 1. Cronômetro Total de Palco
  useEffect(() => {
    const i = setInterval(() => setTimer(s => s + 1), 1000);
    return () => clearInterval(i);
  }, []);

  // 2. INOVAÇÃO: Metrônomo Visual (Baseado no BPM da música)
  useEffect(() => {
    if (!musicaAtual?.bpm) return;
    const intervalMs = (60 / musicaAtual.bpm) * 1000;
    const pulseInterval = setInterval(() => {
      setBpmPulse(true);
      setTimeout(() => setBpmPulse(false), 100);
    }, intervalMs);
    return () => clearInterval(pulseInterval);
  }, [musicaAtual]);

  // 3. INOVAÇÃO: Auto-Scroll (Mãos Livres)
  useEffect(() => {
    let scrollInterval: any;
    if (isScrolling && scrollRef.current) {
      scrollInterval = setInterval(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop += 1;
        }
      }, 50); // Velocidade do scroll
    }
    return () => clearInterval(scrollInterval);
  }, [isScrolling]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!evento) return <Box sx={{ p: 10, color: 'white' }}>Evento não encontrado</Box>;

  return (
    <Box sx={{ 
      position: 'fixed', inset: 0, bgcolor: '#020617', zIndex: 9999, color: 'white', 
      display: 'flex', flexDirection: 'column',
      // Pulso visual nas bordas baseado no BPM
      transition: 'box-shadow 0.1s',
      boxShadow: bpmPulse ? 'inset 0 0 40px rgba(129, 140, 248, 0.3)' : 'none'
    }}>
      
      {/* HEADER COMPACTO */}
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <IconButton onClick={() => navigate(-1)} sx={{ color: 'white' }}><X /></IconButton>
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography sx={{ fontWeight: 900, color: '#818cf8', fontSize: '1.2rem' }}>{musicaAtual?.titulo}</Typography>
          <Typography variant="caption" sx={{ opacity: 0.5, letterSpacing: 2 }}>{musicaAtual?.artista}</Typography>
        </Box>

        <Stack direction="row" spacing={1} alignItems="center">
           {showLyrics && (
             <IconButton onClick={() => setIsScrolling(!isScrolling)} sx={{ bgcolor: isScrolling ? '#f87171' : 'rgba(255,255,255,0.1)', color: 'white' }}>
               {isScrolling ? <Pause size={18}/> : <Play size={18}/>}
             </IconButton>
           )}
           <Typography sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 900, color: '#34d399', ml: 1 }}>{formatTime(timer)}</Typography>
        </Stack>
      </Box>

      {/* ÁREA DA LETRA COM SCROLL AUTO */}
      <Box sx={{ flex: 1, overflow: 'hidden', p: 1 }}>
        <Paper elevation={0} sx={{ 
          height: '100%', borderRadius: 4, bgcolor: 'rgba(255,255,255,0.01)', 
          border: '1px solid rgba(255,255,255,0.05)', display: 'flex', overflow: 'hidden'
        }}>
          {showLyrics ? (
            <Box 
              ref={scrollRef}
              sx={{ width: '100%', height: '100%', overflowY: 'auto', p: { xs: 2, md: 6 }, textAlign: 'center' }}
            >
              <Typography sx={{ 
                whiteSpace: 'pre-line', fontSize: { xs: '1.6rem', md: '2.5rem' }, 
                lineHeight: 1.5, fontWeight: 700, color: '#FFF' 
              }}>
                {musicaAtual?.letra || "Letra não cadastrada."}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ m: 'auto', textAlign: 'center' }}>
              <Typography sx={{ fontSize: '12rem', fontWeight: 950, color: '#818cf8', lineHeight: 0.8 }}>{musicaAtual?.tom}</Typography>
              <Stack direction="row" spacing={6} sx={{ mt: 5, justifyContent: 'center' }}>
                <Box><Typography variant="caption" sx={{ opacity: 0.3 }}>BPM</Typography>
                  <Typography variant="h3" fontWeight={900} sx={{ 
                    color: bpmPulse ? '#34d399' : 'white', 
                    transition: '0.1s' 
                  }}>
                    {musicaAtual?.bpm || '--'}
                  </Typography>
                </Box>
                <Box><Typography variant="caption" sx={{ opacity: 0.3 }}>VIBE</Typography><Typography variant="h3" fontWeight={900}>{musicaAtual?.intensidade}</Typography></Box>
              </Stack>
            </Box>
          )}
        </Paper>
      </Box>

      {/* RODAPÉ: CONTROLES DE MÚSICA */}
      <Stack direction="row" justifyContent="center" spacing={4} sx={{ p: 3 }}>
        <IconButton disabled={currentSongIndex === 0} onClick={() => { setCurrentSongIndex(i => i - 1); setIsScrolling(false); }} sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'white' }}>
          <ChevronLeft size={40} />
        </IconButton>
        <Button onClick={() => setShowLyrics(!showLyrics)} variant="contained" startIcon={showLyrics ? <Zap /> : <Music />} sx={{ bgcolor: '#818cf8', fontWeight: 800, borderRadius: 4, px: 4 }}>
          {showLyrics ? "MODO TÉCNICO" : "LER LETRA"}
        </Button>
        <IconButton disabled={currentSongIndex === setlistIds.length - 1} onClick={() => { setCurrentSongIndex(i => i + 1); setIsScrolling(false); }} sx={{ bgcolor: '#818cf8', color: 'white' }}>
          <ChevronRight size={40} />
        </IconButton>
      </Stack>
    </Box>
  );
}