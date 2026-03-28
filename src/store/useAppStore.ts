import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Musica, Membro, Evento } from '../shared/types';

interface TrackIECSState {
  musicas: Musica[];
  membros: Membro[];
  eventos: Evento[];
  
  // Função para carregar tudo do banco ao abrir o app
  fetchInitialData: () => Promise<void>;
  
  // Actions que salvam no Banco
  addMusica: (m: any) => Promise<void>;
  addMembro: (m: any) => Promise<void>;
  upsertEvento: (ev: any) => Promise<void>;
  deleteEvento: (id: string) => Promise<void>;
}

export const useAppStore = create<TrackIECSState>((set, get) => ({
  musicas: [],
  membros: [],
  eventos: [],

  fetchInitialData: async () => {
    const { data: mus } = await supabase.from('musicas').select('*');
    const { data: mem } = await supabase.from('membros').select('*');
    const { data: eve } = await supabase.from('eventos').select('*');
    set({ musicas: mus || [], membros: mem || [], eventos: eve || [] });
  },

  addMusica: async (m) => {
    await supabase.from('musicas').insert([m]);
    get().fetchInitialData();
  },

  addMembro: async (m) => {
    await supabase.from('membros').insert([m]);
    get().fetchInitialData();
  },

  upsertEvento: async (ev) => {
    if (ev.id) {
        await supabase.from('eventos').update(ev).eq('id', ev.id);
    } else {
        await supabase.from('eventos').insert([ev]);
    }
    get().fetchInitialData();
  },

  deleteEvento: async (id) => {
    await supabase.from('eventos').delete().eq('id', id);
    get().fetchInitialData();
  }
}));