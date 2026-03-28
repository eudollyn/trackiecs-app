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
  artista: string; // Obrigatório para o layout
  tom: string;
  tomOriginal?: string; // Adicionado para bater com o Dialog
  bpm?: number;
  intensidade: number; // 1 a 10
  letra?: string;
  categoria?: string; 
  linkCifra?: string;
  linkVideo?: string;
  link?: string; 
  tags?: string[]; // Adicionado para o salvamento
  ativo?: boolean; // Adicionado para o salvamento
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
  status: 'Pendente' | 'Confirmado' | 'Recusado';
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