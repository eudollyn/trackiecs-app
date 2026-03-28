import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Button, Stack, MenuItem, Box, Slider, Typography 
} from '@mui/material'; // Box importado aqui
import { useAppStore } from '../../../store/useAppStore'; // Ajuste o caminho se necessário
import { nanoid } from 'nanoid';
import { useEffect } from 'react';
import { Zap } from 'lucide-react';

const schema = z.object({
  titulo: z.string().min(3, 'Mínimo 3 caracteres'),
  artista: z.string().min(2, 'Obrigatório'),
  tom: z.string().min(1, 'Obrigatório'),
  tomOriginal: z.string().min(1, 'Obrigatório'),
  categoria: z.string().min(1, 'Obrigatório'),
  bpm: z.preprocess((val) => Number(val), z.number().optional()),
  intensidade: z.number().min(1).max(10),
  link: z.string().url('URL inválida').optional().or(z.literal('')),
  letra: z.string().optional(),
});

export default function MusicaDialog({ open, onClose, initialData }: any) {
  // Use addMusica se o seu store não tiver upsertMusica
  const { addMusica } = useAppStore(); 
  
  const { register, handleSubmit, reset, control, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      titulo: '',
      artista: '',
      tom: 'G',
      tomOriginal: 'G',
      categoria: 'Adoração',
      bpm: 70,
      intensidade: 5,
      link: '',
      letra: ''
    }
  });

  const intensityValue = watch('intensidade');

  useEffect(() => {
    if (initialData) reset(initialData);
  }, [initialData, reset, open]);

  const onSubmit = (data: any) => {
    addMusica({ 
      ...data, 
      id: initialData?.id || nanoid(), 
      createdAt: Date.now() 
    });
    onClose();
    reset();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 4 } }}>
      <DialogTitle sx={{ fontWeight: 800 }}>{initialData ? 'Editar Música' : 'Nova Música'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Stack spacing={3}>
            <TextField label="Título da Música" fullWidth {...register('titulo')} error={!!errors.titulo} helperText={errors.titulo?.message as string} />
            <TextField label="Ministério / Artista" fullWidth {...register('artista')} error={!!errors.artista} helperText={errors.artista?.message as string} />
            
            <Stack direction="row" spacing={2}>
              <TextField select label="Tom Atual" fullWidth {...register('tom')}>
                {['C','D','E','F','G','A','B','Am','Dm','Em'].map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
              <TextField select label="Tom Original" fullWidth {...register('tomOriginal')}>
                {['C','D','E','F','G','A','B'].map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
            </Stack>

            <Stack direction="row" spacing={2}>
              <TextField label="BPM" type="number" sx={{ flex: 1 }} {...register('bpm')} />
              <TextField select label="Categoria" sx={{ flex: 1 }} {...register('categoria')}>
                {['Adoração', 'Celebração', 'Abertura', 'Ceia'].map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </TextField>
            </Stack>

            <Box>
              <Typography variant="caption" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: 'text.secondary' }}>
                <Zap size={14} /> INTENSIDADE ({intensityValue}/10)
              </Typography>
              <Controller
                name="intensidade"
                control={control}
                render={({ field }) => (
                  <Slider {...field} min={1} max={10} step={1} valueLabelDisplay="auto" />
                )}
              />
            </Box>

            <TextField label="Letra ou Link da Cifra" multiline rows={4} fullWidth {...register('letra')} />
            <TextField label="Link do Vídeo (YouTube)" fullWidth {...register('link')} error={!!errors.link} helperText={errors.link?.message as string}/>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={onClose} color="inherit">Cancelar</Button>
          <Button type="submit" variant="contained" sx={{ px: 4, fontWeight: 700 }}>Salvar Música</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}