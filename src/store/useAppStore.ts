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
  upsertEvento: (ev: any) => Promise<void>;
  deleteEvento: (id: string) => Promise<void>;
  confirmPresenca: (eventoId: string, membroId: string) => Promise<void>;
  recusarPresenca: (eventoId: string, membroId: string) => Promise<void>;
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
    set({ musicas: mus || [], membros: mem || [], eventos: eve || [] });
  },

  addMusica: async (m) => {
    await supabase.from('musicas').insert([{
      titulo: m.titulo, artista: m.artista, tom: m.tom,
      bpm: m.bpm ? parseInt(m.bpm) : null, intensidade: m.intensidade, letra: m.letra
    }]);
    get().fetchInitialData();
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
  },

  upsertEvento: async (ev) => {
    const dados = {
      titulo: ev.titulo,
      data: ev.data,
      hora_inicio: ev.horaInicio || ev.hora_inicio,
      local: ev.local || 'Principal',
      setlist: ev.setlist || [],
      equipe: ev.equipe || [],
      status: ev.status || 'Pendente'
    };

    const { error } = ev.id 
      ? await supabase.from('eventos').update(dados).eq('id', ev.id)
      : await supabase.from('eventos').insert([dados]);

    if (error) toast.error("Erro ao salvar escala.");
    else {
      await get().fetchInitialData();
      toast.success("Escala salva!");
    }
  },

  deleteEvento: async (id) => {
    await supabase.from('eventos').delete().eq('id', id);
    get().fetchInitialData();
  },

  confirmPresenca: async (evId, mId) => {
    const ev = get().eventos.find(e => e.id === evId);
    if (!ev) return;
    const novaEquipe = ev.equipe.map((s: any) => s.membroId === mId ? { ...s, status: 'Confirmado' } : s);
    await supabase.from('eventos').update({ equipe: novaEquipe }).eq('id', evId);
    get().fetchInitialData();
  },

  recusarPresenca: async (evId, mId) => {
    const ev = get().eventos.find(e => e.id === evId);
    if (!ev) return;
    const novaEquipe = ev.equipe.map((s: any) => s.membroId === mId ? { ...s, status: 'Recusado' } : s);
    await supabase.from('eventos').update({ equipe: novaEquipe }).eq('id', evId);
    get().fetchInitialData();
  }
}));