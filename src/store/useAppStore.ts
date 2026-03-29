import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Musica, Membro, Evento, User } from '../shared/types';
import { toast } from 'sonner';

interface TrackIECSState {
  isAuth: boolean;
  user: User | null;
  currentMemberId: string | null;
  musicas: Musica[];
  membros: Membro[];
  eventos: Evento[];
  
  login: (email: string) => Promise<void>;
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
  currentMemberId: null,
  musicas: [],
  membros: [],
  eventos: [],

  // LOGIN INTELIGENTE: Vincula o e-mail ao membro da tabela
  login: async (email: string) => {
    const { data: mem } = await supabase.from('membros').select('*').eq('email', email).single();
    
    if (mem) {
      set({ 
        isAuth: true, 
        currentMemberId: mem.id,
        user: { id: mem.id, nome: mem.nome, email: mem.email } 
      });
      toast.success(`Bem-vindo, ${mem.nome}!`);
    } else {
      // Caso não ache na tabela de membros, entra como admin genérico para demo
      set({ isAuth: true, currentMemberId: 'admin', user: { id: '0', nome: 'Admin', email } });
      toast.info("Logado como Administrador");
    }
  },

  logout: () => set({ isAuth: false, user: null, currentMemberId: null }),

  fetchInitialData: async () => {
    const { data: mus } = await supabase.from('musicas').select('*').order('titulo');
    const { data: mem } = await supabase.from('membros').select('*').order('nome');
    const { data: eve } = await supabase.from('eventos').select('*').order('data', { ascending: false });
    set({ musicas: mus || [], membros: mem || [], eventos: eve || [] });
  },

  addMusica: async (m) => {
    await supabase.from('musicas').insert([{ ...m, created_at: new Date() }]);
    await get().fetchInitialData();
  },

  deleteMusica: async (id) => {
    await supabase.from('musicas').delete().eq('id', id);
    await get().fetchInitialData();
  },

  addMembro: async (m) => {
    await supabase.from('membros').insert([m]);
    await get().fetchInitialData();
  },

  deleteMembro: async (id) => {
    await supabase.from('membros').delete().eq('id', id);
    await get().fetchInitialData();
  },

  upsertEvento: async (ev) => {
    const dados = {
      titulo: ev.titulo, data: ev.data, hora_inicio: ev.horaInicio,
      local: ev.local || 'Principal', setlist: ev.setlist || [], equipe: ev.equipe || [], status: 'Pendente'
    };
    const { error } = ev.id ? await supabase.from('eventos').update(dados).eq('id', ev.id) : await supabase.from('eventos').insert([dados]);
    if (!error) await get().fetchInitialData();
  },

  deleteEvento: async (id) => {
    await supabase.from('eventos').delete().eq('id', id);
    await get().fetchInitialData();
  },

  confirmPresenca: async (evId, mId) => {
    const ev = get().eventos.find(e => e.id === evId);
    if (!ev) return;
    const novaEquipe = ev.equipe.map((s: any) => s.membroId === mId ? { ...s, status: 'Confirmado' } : s);
    await supabase.from('eventos').update({ equipe: novaEquipe }).eq('id', evId);
    await get().fetchInitialData();
    toast.success("Presença confirmada!");
  },

  recusarPresenca: async (evId, mId) => {
    const ev = get().eventos.find(e => e.id === evId);
    if (!ev) return;
    const novaEquipe = ev.equipe.map((s: any) => s.membroId === mId ? { ...s, status: 'Recusado' } : s);
    await supabase.from('eventos').update({ equipe: novaEquipe }).eq('id', evId);
    await get().fetchInitialData();
    toast.error("Ausência registrada.");
  }
}));