import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

export const useAppStore = create<any>((set, get) => ({
  isAuth: false,
  user: null,
  currentMemberId: null,
  musicas: [],
  membros: [],
  eventos: [],

  login: async (email: string) => {
  const masterEmail = 'ehenriquesilva021@gmail.com'; // SEU E-MAIL MESTRE
  const { data: mem } = await supabase.from('membros').select('*').eq('email', email).maybeSingle();
  
  set({ 
    isAuth: true, 
    // Se for o seu e-mail, o ID é 'admin' para liberar todos os botões
    currentMemberId: email === masterEmail ? 'admin' : (mem?.id || 'membro_logado'), 
    user: { 
      nome: mem?.nome || 'Administrador', 
      email 
    } 
  });
  get().fetchInitialData();
},

  logout: () => set({ isAuth: false, user: null }),

  fetchInitialData: async () => {
    const { data: mus } = await supabase.from('musicas').select('*').order('titulo');
    const { data: mem } = await supabase.from('membros').select('*').order('nome');
    const { data: eve } = await supabase.from('eventos').select('*').order('data');
    set({ musicas: mus || [], membros: mem || [], eventos: eve || [] });
  },

  addMusica: async (m: any) => {
    const { error } = await supabase.from('musicas').insert([{
      titulo: m.titulo, artista: m.artista, tom: m.tom,
      bpm: m.bpm ? parseInt(m.bpm) : null, intensidade: m.intensidade, 
      letra: m.letra, link_video: m.linkVideo
    }]);
    if (error) toast.error("Erro ao salvar música");
    else { toast.success("Música salva!"); get().fetchInitialData(); }
  },

  addMembro: async (m: any) => {
    const { error } = await supabase.from('membros').insert([{
      nome: m.nome, email: m.email, funcoes: typeof m.funcoes === 'string' ? m.funcoes.split(',') : m.funcoes
    }]);
    if (error) toast.error("Erro ao salvar membro");
    else { toast.success("Membro salvo!"); get().fetchInitialData(); }
  },

  upsertEvento: async (ev: any) => {
    const payload = {
      titulo: ev.titulo, data: ev.data, hora_inicio: ev.horaInicio,
      setlist: ev.setlist || [], equipe: ev.equipe || [], status: 'Pendente'
    };
    const { error } = ev.id 
      ? await supabase.from('eventos').update(payload).eq('id', ev.id)
      : await supabase.from('eventos').insert([payload]);
    
    if (error) toast.error("Erro ao salvar escala");
    else { toast.success("Escala salva!"); get().fetchInitialData(); }
  },

  deleteMusica: async (id: string) => { await supabase.from('musicas').delete().eq('id', id); get().fetchInitialData(); },
  deleteMembro: async (id: string) => { await supabase.from('membros').delete().eq('id', id); get().fetchInitialData(); },
  deleteEvento: async (id: string) => { await supabase.from('eventos').delete().eq('id', id); get().fetchInitialData(); },
  
  confirmPresenca: async (evId: string, mId: string) => {
    const ev = get().eventos.find((e:any) => e.id === evId);
    const novaEquipe = ev.equipe.map((s:any) => s.membroId === mId ? { ...s, status: 'Confirmado' } : s);
    await supabase.from('eventos').update({ equipe: novaEquipe }).eq('id', evId);
    get().fetchInitialData();
  }
}));