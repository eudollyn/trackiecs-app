import React, { useState } from 'react';
import { 
  Box, Typography, Button, TextField, Grid, Card, 
  CardContent, Chip, Stack, InputAdornment, IconButton, 
  Tooltip, alpha, useTheme 
} from '@mui/material';
import { Plus, Search, Music as MusicIcon, PlayCircle, Edit3, Trash2, SlidersHorizontal } from 'lucide-react';
import { useAppStore } from '../../shared/store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import MusicaDialog from './components/MusicaDialog'; // Diálogo com React Hook Form

export default function MusicasPage() {
  const theme = useTheme();
  const { musicas, deleteMusica } = useAppStore();
  const [search, setSearch] = useState('');
  const [selectedMusica, setSelectedMusica] = useState<any>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const filtered = musicas.filter(m => 
    m.titulo.toLowerCase().includes(search.toLowerCase()) || 
    m.tom.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4">Repertório</Typography>
          <Typography color="text.secondary">Gerencie {musicas.length} canções do seu catálogo</Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<Plus size={18}/>} 
          onClick={() => { setSelectedMusica(null); setDialogOpen(true); }}
        >
          Nova Música
        </Button>
      </Stack>

      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        <TextField 
          fullWidth 
          placeholder="Buscar por título ou tom..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Search size={18} color={theme.palette.text.secondary}/></InputAdornment>,
          }}
          sx={{ bgcolor: 'white' }}
        />
        <Button variant="outlined" color="inherit" startIcon={<SlidersHorizontal size={18}/>}>
          Filtros
        </Button>
      </Stack>

      <Grid container spacing={3}>
        <AnimatePresence mode='popLayout'>
          {filtered.map((m) => (
            <Grid item xs={12} sm={6} md={4} key={m.id} component={motion.div} layout
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
              <Card sx={{ 
                height: '100%', 
                transition: '0.2s', 
                '&:hover': { transform: 'translateY(-4px)', boxShadow: theme.shadows[3], borderColor: theme.palette.primary.main } 
              }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Box sx={{ p: 1, bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: 2, display: 'flex' }}>
                      <MusicIcon size={20} color={theme.palette.primary.main} />
                    </Box>
                    <Stack direction="row" spacing={0.5}>
                      <IconButton size="small" onClick={() => { setSelectedMusica(m); setDialogOpen(true); }}>
                        <Edit3 size={16} />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => { deleteMusica(m.id); toast.success('Música removida'); }}>
                        <Trash2 size={16} />
                      </IconButton>
                    </Stack>
                  </Stack>

                  <Typography variant="h6" sx={{ mb: 1 }} noWrap>{m.titulo}</Typography>
                  
                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Chip label={m.tom} size="small" color="primary" sx={{ fontWeight: 800 }} />
                    <Chip label={m.categoria} size="small" variant="outlined" />
                  </Stack>

                  <Stack direction="row" spacing={2}>
                    {m.bpm && <Typography variant="caption" color="text.secondary"><b>BPM:</b> {m.bpm}</Typography>}
                    {m.link && (
                      <IconButton size="small" href={m.link} target="_blank" sx={{ ml: 'auto' }}>
                        <PlayCircle size={18} />
                      </IconButton>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </AnimatePresence>
      </Grid>

      <MusicaDialog 
        open={isDialogOpen} 
        onClose={() => setDialogOpen(false)} 
        initialData={selectedMusica} 
      />
    </Box>
  );
}