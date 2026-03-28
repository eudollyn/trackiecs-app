import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Stack, MenuItem } from '@mui/material';
import { useAppStore } from '../../../shared/store/useAppStore';
import { nanoid } from 'nanoid';
import { useEffect } from 'react';

const schema = z.object({
  titulo: z.string().min(3, 'Mínimo 3 caracteres'),
  tom: z.string().min(1, 'Obrigatório'),
  tomOriginal: z.string().min(1, 'Obrigatório'),
  categoria: z.string().min(1, 'Obrigatório'),
  bpm: z.preprocess((val) => Number(val), z.number().optional()),
  link: z.string().url('URL inválida').optional().or(z.literal('')),
});

export default function MusicaDialog({ open, onClose, initialData }: any) {
  const { upsertMusica } = useAppStore();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

  useEffect(() => {
    if (initialData) reset(initialData);
    else reset({ titulo: '', tom: 'G', tomOriginal: 'G', categoria: 'Adoração', bpm: 0, link: '' });
  }, [initialData, reset, open]);

  const onSubmit = (data: any) => {
    upsertMusica({ ...data, id: initialData?.id || nanoid(), ativo: true, tags: [] });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{initialData ? 'Editar Música' : 'Nova Música'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Stack spacing={2.5}>
            <TextField label="Título" fullWidth {...register('titulo')} error={!!errors.titulo} helperText={errors.titulo?.message as string} />
            <Stack direction="row" spacing={2}>
              <TextField select label="Tom Atual" fullWidth {...register('tom')}>
                {['C','D','E','F','G','A','B'].map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
              <TextField select label="Tom Original" fullWidth {...register('tomOriginal')}>
                {['C','D','E','F','G','A','B'].map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
            </Stack>
            <TextField label="BPM" type="number" fullWidth {...register('bpm')} />
            <TextField label="Link (YouTube/Drive)" fullWidth {...register('link')} error={!!errors.link} helperText={errors.link?.message as string}/>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={onClose} color="inherit">Cancelar</Button>
          <Button type="submit" variant="contained">Salvar</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}