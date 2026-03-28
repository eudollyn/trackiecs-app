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
  letra?: string; // NOVO: Campo para letra/cifra
  linkCifra?: string;
  linkVideo?: string;
  createdAt: number;
}

export interface Membro {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  funcoes: string[];
  ativo: boolean;
  avatarUrl?: string;
}

export interface EventoSlot {
  membroId: string;
  papel: string;
  status: 'Pendente' | 'Confirmado' | 'Recusado'; // EVOLUÇÃO: Status de presença
}

export interface Evento {
  id: string;
  titulo: string;
  data: string;
  horaInicio: string;
  local: string;
  tipo: 'Culto' | 'Ensaio' | 'Evento Especial';
  status: 'Planejado' | 'Confirmado' | 'Concluído';
  setlist: string[];
  equipe: EventoSlot[];
}