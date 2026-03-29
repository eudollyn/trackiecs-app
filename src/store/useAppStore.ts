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

  login: async (email) => {
    const { data: mem } = await supabase.from('membros').select('*').eq('email', email).maybeSingle();
    if (mem) {
      set({ isAuth: true, currentMemberId: mem.id, user: { id: mem.id, nome: mem.nome, email: mem.email } });
      toast.success(`Olá, ${mem.nome}`);
    } else {
      set({ isAuth: true, currentMemberId: 'admin', user: { id: 'admin', nome: 'Admin', email } });
    }
  },

  logout: () => set({ isAuth: false, user: null, currentMemberId: null }),

  fetchInitialData: async () => {
    const { data: mus } = await supabase.from('musicas').select('*').order('titulo');
    const { data: mem } = await supabase.from('membros').select('*').order('nome');
    const { data: eve } = await supabase.from('eventos').select('*').order('data');
    set({ musicas: mus || [], membros: mem || [], eventos: eve || [] });
  },

  addMusica: async (m) => {
    // MAPEAMENTO PARA O BANCO (Snake Case)
    const payload = {
      titulo: m.titulo,
      artista: m.artista,
      tom: m.tom,
      bpm: m.bpm ? parseInt(m.bpm) : null,
      intensidade: parseInt(m.intensidade),
      letra: m.letra,
      link_cifra: m.linkCifra || m.link,
      link_video: m.linkVideo || m.link
    };
    const { error } = await supabase.from('musicas').insert([payload]);
    if (!error) await get().fetchInitialData();
    else toast.error("Erro no Banco: Nome de coluna inválido.");
  },

  addMembro: async (m) => {
    const payload = { 
      nome: m.nome, 
      email: m.email, 
      funcoes: m.funcoes, 
      telefone: m.telefone, 
      ativo: true 
    };
    const { error } = await supabase.from('membros').insert([payload]);
    if (!error) await get().fetchInitialData();
  },

  upsertEvento: async (ev) => {
    const payload = {
      titulo: ev.titulo,
      data: ev.data,
      hora_inicio: ev.horaInicio,
      local: ev.local || 'Principal',
      setlist: ev.setlist || [],
      equipe: ev.equipe || [],
      status: 'Pendente'
    };
    const { error } = ev.id 
      ? await supabase.from('eventos').update(payload).eq('id', ev.id) 
      : await supabase.from('eventos').insert([payload]);
    if (!error) await get().fetchInitialData();
  },

  deleteMusica: async (id) => { await supabase.from('musicas').delete().eq('id', id); get().fetchInitialData(); },
  deleteMembro: async (id) => { await supabase.from('membros').delete().eq('id', id); get().fetchInitialData(); },
  deleteEvento: async (id) => { await supabase.from('eventos').delete().eq('id', id); get().fetchInitialData(); },

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