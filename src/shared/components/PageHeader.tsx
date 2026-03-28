import { Box, Typography, Button, Stack } from '@mui/material';
import { Plus } from 'lucide-react';

interface PageHeaderProps {
  titulo: string;
  subtitulo: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
}

export function PageHeader({ titulo, subtitulo, ctaLabel, onCtaClick }: PageHeaderProps) {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'start', sm: 'center' }} sx={{ mb: 4 }} spacing={2}>
      <Box>
        <Typography variant="h4">{titulo}</Typography>
        <Typography color="text.secondary">{subtitulo}</Typography>
      </Box>
      {ctaLabel && (
        <Button variant="contained" startIcon={<Plus size={18} />} onClick={onCtaClick}>
          {ctaLabel}
        </Button>
      )}
    </Stack>
  );
}