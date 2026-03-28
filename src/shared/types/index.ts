export type Tonality = 'C' | 'Cm' | 'D' | 'Dm' | 'E' | 'Em' | 'F' | 'Fm' | 'G' | 'Gm' | 'A' | 'Am' | 'B' | 'Bm' | 'Bb' | 'Eb' | 'Ab' | 'Db' | 'Gb';

export interface User {
  id: string;
  nome: string;
  email: string;
  avatar?: string;
}

export interface Musica {
  id: string;
  titulo: string;
  artista: string;
  tom: string;
  bpm?: number;
  intensidade: number;
  letra?: string;
  link_cifra?: string;
  link_video?: string;
  createdAt: number;
}

export interface EventoSlot {
  membroId: string;
  papel: string;
  status: 'Pendente' | 'Confirmado' | 'Recusado';
}

export interface Evento {
  id: string;
  titulo: string;
  data: string;
  hora_inicio: string;
  local: string;
  setlist: string[];
  equipe: EventoSlot[];
  status: string;
}