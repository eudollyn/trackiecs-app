import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Stack, IconButton, Paper, Button } from '@mui/material';
import { ChevronLeft, ChevronRight, X, Music, Play, Pause, Zap, Minus, Plus } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

// Escala musical para cálculo de transposição
const SCALE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export default function StageMode() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { eventos, musicas } = useAppStore();
  
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [showLyrics, setShowLyrics] = useState(true);
  const [timer, setTimer] = useState(0);
  
  // Estados para Batida de Luz (BPM) e Auto-scroll
  const [isPulse, setIsPulse] = useState(false);
  const [transpose, setTranspose] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const evento = eventos.find((e: any) => e.id === id);
  const setlistIds = evento?.setlist || [];
  const musicaOriginal = musicas.find((m: any) => m.id === setlistIds[currentSongIndex]);

  // 1. Cronômetro Total
  useEffect(() => {
    const i = setInterval(() => setTimer(s => s + 1), 1000);
    return () => clearInterval(i);
  }, []);

  // 2. LÓGICA DO METRÔNOMO VISUAL (BATIDA DE LUZ)
  useEffect(() => {
    if (!musicaOriginal?.bpm || musicaOriginal.bpm <= 0) return;

    const msPerBeat = 60000 / musicaOriginal.bpm;
    
    const pulseInterval = setInterval(() => {
      setIsPulse(true);
      setTimeout(() => setIsPulse(false), 100); // Duração do "flash" de luz
    }, msPerBeat);

    return () => clearInterval(pulseInterval);
  }, [musicaOriginal, currentSongIndex]);

  // 3. Transposição e Reset
  const getTransposedKey = (originalKey: string) => {
    if (!originalKey) return '---';
    const isMinor = originalKey.includes('m');
    const root = originalKey.replace('m', '').toUpperCase();
    const index = SCALE.indexOf(root);
    if (index === -1) return originalKey;
    let newIndex = (index + transpose) % 12;
    if (newIndex < 0) newIndex += 12;
    return SCALE[newIndex] + (isMinor ? 'm' : '');
  };

  useEffect(() => {
    setTranspose(0);
    setIsScrolling(false);
  }, [currentSongIndex]);

  // 4. Auto-scroll
  useEffect(() => {
    let scrollInterval: any;
    if (isScrolling && scrollRef.current) {
      scrollInterval = setInterval(() => {
        if (scrollRef.current) scrollRef.current.scrollTop += 1;
      }, 60); 
    }
    return () => clearInterval(scrollInterval);
  }, [isScrolling]);

  if (!evento) return <Box sx={{ p: 10, color: 'white', textAlign: 'center' }}>Escala não encontrada.</Box>;

  return (
    <Box sx={{ 
      position: 'fixed', inset: 0, bgcolor: '#020617', zIndex: 9999, color: 'white', 
      display: 'flex', flexDirection: 'column',
      // EFEITO DE LUZ (PULSO) NAS BORDAS
      transition: 'box-shadow 0.1s ease',
      boxShadow: isPulse 
        ? 'inset 0 0 50px rgba(129, 140, 248, 0.4)' 
        : 'inset 0 0 10px rgba(0,0,0,1)'
    }}>
      
      {/* HEADER COMPACTO */}
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <IconButton onClick={() => navigate(-1)} sx={{ color: 'rgba(255,255,255,0.3)' }}><X /></IconButton>
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography sx={{ fontWeight: 900, color: '#818cf8', fontSize: '1.1rem' }}>{musicaOriginal?.titulo}</Typography>
          <Typography variant="caption" sx={{ opacity: 0.5 }}>{musicaOriginal?.artista}</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Paper sx={{ px: 1.5, py: 0.5, bgcolor: '#1e293b', borderRadius: 2, border: isPulse ? '1px solid #818cf8' : '1px solid transparent', transition: '0.1s' }}>
                <Typography variant="body2" sx={{ fontWeight: 900, color: isPulse ? '#FFF' : '#818cf8' }}>
                  {getTransposedKey(musicaOriginal?.tom || 'C')}
                </Typography>
            </Paper>
            <IconButton onClick={() => setIsScrolling(!isScrolling)} sx={{ bgcolor: isScrolling ? '#f87171' : 'rgba(255,255,255,0.1)', color: 'white' }}>
                {isScrolling ? <Pause size={18}/> : <Play size={18}/>}
            </IconButton>
        </Box>
      </Box>

      {/* ÁREA DA LETRA / TOM GIGANTE */}
      <Box sx={{ flex: 1, overflow: 'hidden', p: 1.5 }}>
        <Paper elevation={0} sx={{ height: '100%', borderRadius: 5, bgcolor: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', overflow: 'hidden' }}>
          {showLyrics ? (
            <Box ref={scrollRef} sx={{ width: '100%', height: '100%', overflowY: 'auto', p: { xs: 3, md: 8 }, textAlign: 'center' }}>
              <Typography sx={{ whiteSpace: 'pre-line', fontSize: { xs: '1.7rem', md: '3rem' }, lineHeight: 1.6, fontWeight: 700, color: '#FFF' }}>
                {musicaOriginal?.letra || "Sem letra disponível."}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ m: 'auto', textAlign: 'center' }}>
                <Typography variant="overline" sx={{ letterSpacing: 5, opacity: 0.3 }}>TOM ATUAL</Typography>
                <Typography sx={{ fontSize: {xs: '10rem', md: '15rem'}, fontWeight: 950, color: '#818cf8', lineHeight: 0.8 }}>
                    {getTransposedKey(musicaOriginal?.tom || 'C')}
                </Typography>
                <Stack direction="row" spacing={3} justifyContent="center" mt={6}>
                    <Button variant="outlined" onClick={() => setTranspose(t => t - 1)} startIcon={<Minus />} sx={{ color: 'white' }}>-</Button>
                    <Button variant="outlined" onClick={() => setTranspose(0)} sx={{ color: '#818cf8' }}>RESET</Button>
                    <Button variant="outlined" onClick={() => setTranspose(t => t + 1)} startIcon={<Plus />} sx={{ color: 'white' }}>+</Button>
                </Stack>
            </Box>
          )}
        </Paper>
      </Box>

      {/* NAVEGAÇÃO ENTRE MÚSICAS */}
      <Stack direction="row" justifyContent="center" spacing={4} sx={{ p: 4 }}>
        <IconButton disabled={currentSongIndex === 0} onClick={() => setCurrentSongIndex(i => i - 1)} sx={{ width: 60, height: 60, bgcolor: 'rgba(255,255,255,0.05)', color: 'white' }}>
          <ChevronLeft size={35} />
        </IconButton>
        
        <Button onClick={() => setShowLyrics(!showLyrics)} variant="contained" sx={{ bgcolor: '#818cf8', fontWeight: 900, px: 4, borderRadius: 5 }}>
          {showLyrics ? "TÉCNICO" : "LETRA"}
        </Button>

        <IconButton disabled={currentSongIndex === setlistIds.length - 1} onClick={() => setCurrentSongIndex(i => i + 1)} sx={{ width: 60, height: 60, bgcolor: '#818cf8', color: 'white' }}>
          <ChevronRight size={35} />
        </IconButton>
      </Stack>
    </Box>
  );
}