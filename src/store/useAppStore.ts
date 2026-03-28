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
  
  // Auth
  login: (u: User) => void;
  logout: () => void;
  
  // Geral
  fetchInitialData: () => Promise<void>;
  
  // Músicas
  addMusica: (m: any) => Promise<void>;
  deleteMusica: (id: string) => Promise<void>;

  // Membros
  addMembro: (m: any) => Promise<void>;
  deleteMembro: (id: string) => Promise<void>;

  // EVENTOS (ESCALAS) - Adicionado e Corrigido
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
    try {
      const { data: mus } = await supabase.from('musicas').select('*').order('titulo');
      const { data: mem } = await supabase.from('membros').select('*').order('nome');
      const { data: eve } = await supabase.from('eventos').select('*').order('data', { ascending: false });
      
      set({ 
        musicas: mus || [], 
        membros: mem || [], 
        eventos: eve || [] 
      });
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  },

  // Músicas
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
      toast.error("Erro ao salvar música.");
    } else {
      await get().fetchInitialData();
      toast.success("Música salva!");
    }
  },

  deleteMusica: async (id) => {
    await supabase.from('musicas').delete().eq('id', id);
    get().fetchInitialData();
  },

  // Membros
  addMembro: async (m) => {
    const { error } = await supabase.from('membros').insert([m]);
    if (error) toast.error("Erro ao salvar membro.");
    else {
      await get().fetchInitialData();
      toast.success("Membro adicionado!");
    }
  },

  deleteMembro: async (id) => {
    await supabase.from('membros').delete().eq('id', id);
    get().fetchInitialData();
  },

  // EVENTOS (Lógica de Upsert e Presença)
  upsertEvento: async (ev) => {
    // Mapeamento para o Banco (CamelCase para snake_case)
    const dadosParaSalvar = {
      titulo: ev.titulo,
      data: ev.data,
      hora_inicio: ev.horaInicio,
      local: ev.local || 'Principal',
      setlist: ev.setlist || [],
      equipe: ev.equipe || [],
      status: ev.status || 'Pendente'
    };

    let error;
    if (ev.id) {
      const { error: err } = await supabase.from('eventos').update(dadosParaSalvar).eq('id', ev.id);
      error = err;
    } else {
      const { error: err } = await supabase.from('eventos').insert([dadosParaSalvar]);
      error = err;
    }

    if (error) {
      console.error("Erro Supabase:", error);
      toast.error("Erro ao salvar escala.");
    } else {
      await get().fetchInitialData();
      toast.success("Escala atualizada!");
    }
  },

  deleteEvento: async (id) => {
    const { error } = await supabase.from('eventos').delete().eq('id', id);
    if (!error) get().fetchInitialData();
  },

  confirmPresenca: async (eventoId, membroId) => {
    const evento = get().eventos.find(e => e.id === eventoId);
    if (!evento) return;

    const novaEquipe = evento.equipe.map(slot => 
      slot.membroId === membroId ? { ...slot, status: 'Confirmado' } : slot
    );

    const { error } = await supabase.from('eventos').update({ equipe: novaEquipe }).eq('id', eventoId);
    if (!error) get().fetchInitialData();
  },

  recusarPresenca: async (eventoId, membroId) => {
    const evento = get().eventos.find(e => e.id === eventoId);
    if (!evento) return;

    const novaEquipe = evento.equipe.map(slot => 
      slot.membroId === membroId ? { ...slot, status: 'Recusado' } : slot
    );

    const { error } = await supabase.from('eventos').update({ equipe: novaEquipe }).eq('id', eventoId);
    if (!error) get().fetchInitialData();
  }
}));