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
  
  // Transposição: 0 é o original. +1 sobe meio tom, -1 desce meio tom.
  const [transpose, setTranspose] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const evento = eventos.find(e => e.id === id);
  const setlistIds = evento?.setlist || [];
  const musicaOriginal = musicas.find(m => m.id === setlistIds[currentSongIndex]);

  // Função mágica de transposição
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
    const i = setInterval(() => setTimer(s => s + 1), 1000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    setTranspose(0); // Reseta transposição ao mudar de música
  }, [currentSongIndex]);

  useEffect(() => {
    let scrollInterval: any;
    if (isScrolling && scrollRef.current) {
      scrollInterval = setInterval(() => {
        if (scrollRef.current) scrollRef.current.scrollTop += 1;
      }, 60); 
    }
    return () => clearInterval(scrollInterval);
  }, [isScrolling]);

  if (!evento) return <Box sx={{ p: 10, color: 'white' }}>Evento não encontrado</Box>;

  return (
    <Box sx={{ position: 'fixed', inset: 0, bgcolor: '#020617', zIndex: 9999, color: 'white', display: 'flex', flexDirection: 'column' }}>
      
      {/* HEADER */}
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <IconButton onClick={() => navigate(-1)} sx={{ color: 'white' }}><X /></IconButton>
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography sx={{ fontWeight: 900, color: '#818cf8', fontSize: {xs: '1rem', md: '1.4rem'} }}>{musicaOriginal?.titulo}</Typography>
          <Typography variant="caption" sx={{ opacity: 0.5, letterSpacing: 2 }}>{musicaOriginal?.artista}</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Paper sx={{ px: 2, py: 0.5, bgcolor: '#1e293b', borderRadius: 2, border: '1px solid #818cf8' }}>
                <Typography variant="h6" sx={{ fontWeight: 900, color: '#818cf8' }}>
                  {getTransposedKey(musicaOriginal?.tom || 'C')}
                </Typography>
            </Paper>
            {showLyrics && (
                <IconButton onClick={() => setIsScrolling(!isScrolling)} sx={{ bgcolor: isScrolling ? '#f87171' : '#34d399', color: 'white' }}>
                    {isScrolling ? <Pause size={18}/> : <Play size={18}/>}
                </IconButton>
            )}
        </Box>
      </Box>

      {/* CONTEÚDO */}
      <Box sx={{ flex: 1, overflow: 'hidden', p: 1.5 }}>
        <Paper elevation={0} sx={{ height: '100%', borderRadius: 5, bgcolor: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', overflow: 'hidden' }}>
          {showLyrics ? (
            <Box ref={scrollRef} sx={{ width: '100%', height: '100%', overflowY: 'auto', p: { xs: 2, md: 8 }, textAlign: 'center' }}>
              <Typography sx={{ whiteSpace: 'pre-line', fontSize: { xs: '1.6rem', md: '3rem' }, lineHeight: 1.5, fontWeight: 700, color: '#FFF' }}>
                {musicaOriginal?.letra || "Sem letra."}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ m: 'auto', textAlign: 'center' }}>
                <Typography variant="overline" sx={{ letterSpacing: 5, color: 'rgba(255,255,255,0.3)' }}>TOM DE EXECUÇÃO</Typography>
                <Typography sx={{ fontSize: {xs: '10rem', md: '15rem'}, fontWeight: 950, color: '#818cf8', lineHeight: 0.8 }}>
                    {getTransposedKey(musicaOriginal?.tom || 'C')}
                </Typography>
                
                {/* BOTÕES DE TRANSPOSIÇÃO NO MODO TÉCNICO */}
                <Stack direction="row" spacing={2} justifyContent="center" mt={4}>
                    <Button variant="outlined" onClick={() => setTranspose(t => t - 1)} startIcon={<Minus />} sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.1)' }}>MEIO TOM</Button>
                    <Button variant="outlined" onClick={() => setTranspose(0)} sx={{ color: '#818cf8', borderColor: '#818cf8' }}>ORIGINAL</Button>
                    <Button variant="outlined" onClick={() => setTranspose(t => t + 1)} startIcon={<Plus />} sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.1)' }}>MEIO TOM</Button>
                </Stack>
            </Box>
          )}
        </Paper>
      </Box>

      {/* FOOTER */}
      <Stack direction="row" justifyContent="center" spacing={4} sx={{ p: 4 }}>
        <IconButton disabled={currentSongIndex === 0} onClick={() => setCurrentSongIndex(i => i - 1)} sx={{ width: 70, height: 70, bgcolor: 'rgba(255,255,255,0.05)', color: 'white' }}>
          <ChevronLeft size={40} />
        </IconButton>
        
        <Button onClick={() => setShowLyrics(!showLyrics)} variant="contained" sx={{ bgcolor: '#818cf8', fontWeight: 900, px: 5, borderRadius: 10 }}>
          {showLyrics ? "MODO TÉCNICO" : "LER LETRA"}
        </Button>

        <IconButton disabled={currentSongIndex === setlistIds.length - 1} onClick={() => setCurrentSongIndex(i => i + 1)} sx={{ width: 70, height: 70, bgcolor: '#818cf8', color: 'white' }}>
          <ChevronRight size={40} />
        </IconButton>
      </Stack>
    </Box>
  );
}