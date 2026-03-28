import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Musica, Membro, Evento, User } from '../shared/types';
import { toast } from 'sonner';

interface TrackIECSState {
  isAuth: boolean;
  user: User | null;
  musicas: Musica[];
  membros: Membro[];
  eventos: Evento[];
  
  login: (u: User) => void;
  logout: () => void;
  fetchInitialData: () => Promise<void>;
  addMusica: (m: any) => Promise<void>;
  deleteMusica: (id: string) => Promise<void>;
  addMembro: (m: any) => Promise<void>;
  deleteMembro: (id: string) => Promise<void>;
}

export const useAppStore = create<TrackIECSState>((set, get) => ({
  isAuth: false,
  user: null,
  musicas: [],
  membros: [],
  eventos: [],

  login: (u) => set({ isAuth: true, user: u }),
  logout: () => set({ isAuth: false, user: null }),

  fetchInitialData: async () => {
    const { data: mus } = await supabase.from('musicas').select('*').order('titulo');
    const { data: mem } = await supabase.from('membros').select('*').order('nome');
    const { data: eve } = await supabase.from('eventos').select('*').order('data', { ascending: false });
    
    set({ 
      musicas: mus || [], 
      membros: mem || [], 
      eventos: eve || [] 
    });
  },

  addMusica: async (m) => {
    const { error } = await supabase.from('musicas').insert([{
      titulo: m.titulo,
      artista: m.artista,
      tom: m.tom,
      bpm: m.bpm ? parseInt(m.bpm) : null,
      intensidade: m.intensidade,
      letra: m.letra,
      link_cifra: m.linkCifra,
      link_video: m.linkVideo
    }]);

    if (error) {
      console.error(error);
      toast.error("Erro ao salvar música no banco.");
    } else {
      await get().fetchInitialData(); // Recarrega a lista na hora
      toast.success("Música salva com sucesso!");
    }
  },

  deleteMusica: async (id) => {
    await supabase.from('musicas').delete().eq('id', id);
    get().fetchInitialData();
  },

  addMembro: async (m) => {
    await supabase.from('membros').insert([m]);
    get().fetchInitialData();
  },

  deleteMembro: async (id) => {
    await supabase.from('membros').delete().eq('id', id);
    get().fetchInitialData();
  }
}));