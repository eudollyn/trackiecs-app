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
  // ESTADOS INICIAIS
  isAuth: false,
  user: null,
  musicas: [],
  membros: [],
  eventos: [],

  // AUTENTICAÇÃO SIMPLES (PARA DEMO)
  login: (u) => set({ isAuth: true, user: u }),
  logout: () => set({ isAuth: false, user: null }),

  // CARREGAMENTO GLOBAL
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
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
    }
  },

  // MÚSICAS
  addMusica: async (m) => {
    const { error } = await supabase.from('musicas').insert([{
      titulo: m.titulo, artista: m.artista, tom: m.tom,
      bpm: m.bpm ? parseInt(m.bpm) : null, intensidade: m.intensidade,
      letra: m.letra, link_cifra: m.linkCifra, link_video: m.linkVideo
    }]);
    if (!error) {
      await get().fetchInitialData();
      toast.success("Música salva!");
    } else {
      toast.error("Erro ao salvar música.");
    }
  },

  deleteMusica: async (id) => {
    const { error } = await supabase.from('musicas').delete().eq('id', id);
    if (!error) get().fetchInitialData();
  },

  // MEMBROS
  addMembro: async (m) => {
    const { error } = await supabase.from('membros').insert([{
      nome: m.nome, email: m.email, funcoes: m.funcoes, ativo: true
    }]);
    if (!error) {
      await get().fetchInitialData();
      toast.success("Membro adicionado!");
    }
  },

  deleteMembro: async (id) => {
    const { error } = await supabase.from('membros').delete().eq('id', id);
    if (!error) get().fetchInitialData();
  },

  // ESCALAS (EVENTOS)
  upsertEvento: async (ev) => {
    const dados = {
      titulo: ev.titulo,
      data: ev.data,
      hora_inicio: ev.horaInicio,
      local: ev.local || 'Principal',
      setlist: ev.setlist || [],
      equipe: ev.equipe || [],
      status: ev.status || 'Pendente'
    };

    const { error } = ev.id 
      ? await supabase.from('eventos').update(dados).eq('id', ev.id)
      : await supabase.from('eventos').insert([dados]);

    if (!error) {
      await get().fetchInitialData();
      toast.success("Escala agendada!");
    } else {
      console.error(error);
      toast.error("Erro ao salvar escala.");
    }
  },

  deleteEvento: async (id) => {
    const { error } = await supabase.from('eventos').delete().eq('id', id);
    if (!error) get().fetchInitialData();
  },

  // PRESENÇA EM TEMPO REAL
  confirmPresenca: async (evId, mId) => {
    const ev = get().eventos.find(e => e.id === evId);
    if (!ev) return;
    const novaEquipe = ev.equipe.map((s: any) => s.membroId === mId ? { ...s, status: 'Confirmado' } : s);
    const { error } = await supabase.from('eventos').update({ equipe: novaEquipe }).eq('id', evId);
    if (!error) get().fetchInitialData();
  },

  recusarPresenca: async (evId, mId) => {
    const ev = get().eventos.find(e => e.id === evId);
    if (!ev) return;
    const novaEquipe = ev.equipe.map((s: any) => s.membroId === mId ? { ...s, status: 'Recusado' } : s);
    const { error } = await supabase.from('eventos').update({ equipe: novaEquipe }).eq('id', evId);
    if (!error) get().fetchInitialData();
  }
}));