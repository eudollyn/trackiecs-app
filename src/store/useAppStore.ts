import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

export const useAppStore = create<any>()(
  persist(
    (set, get) => ({
      // ESTADOS
      isAuth: false,
      user: null,
      currentMemberId: null,
      musicas: [],
      membros: [],
      eventos: [],

      // AUTH: LOGIN
      login: async (email: string) => {
        const masterEmail = 'ehenriquesilva021@gmail.com';
        const formattedEmail = email.trim().toLowerCase();

        const { data: mem } = await supabase
          .from('membros')
          .select('*')
          .eq('email', formattedEmail)
          .maybeSingle();
        
        if (mem || formattedEmail === masterEmail) {
          set({ 
            isAuth: true, 
            currentMemberId: formattedEmail === masterEmail ? 'admin' : mem?.id,
            user: { nome: mem?.nome || 'Administrador', email: formattedEmail } 
          });
          get().fetchInitialData();
          toast.success("Acesso liberado!");
        } else {
          toast.error("E-mail não cadastrado.");
        }
      },

      // AUTH: AUTO-CADASTRO
      signUp: async (nome: string, email: string, funcoes: string) => {
        const formatEmail = email.trim().toLowerCase();
        
        const { data: existing } = await supabase.from('membros').select('id').eq('email', formatEmail).maybeSingle();
        if (existing) return toast.error("Este e-mail já existe!");

        const { data: newMem, error } = await supabase.from('membros').insert([{
          nome,
          email: formatEmail,
          funcoes: funcoes.split(',').map(f => f.trim())
        }]).select().single();

        if (!error && newMem) {
          set({ 
            isAuth: true, 
            currentMemberId: newMem.id,
            user: { nome: newMem.nome, email: newMem.email } 
          });
          get().fetchInitialData();
          toast.success("Conta criada e logada!");
        } else {
          toast.error("Erro ao criar conta.");
        }
      },

      logout: () => {
        set({ isAuth: false, user: null, currentMemberId: null });
        localStorage.removeItem('trackiecs-auth-storage');
      },

      // CARREGAMENTO
      fetchInitialData: async () => {
        const { data: mus } = await supabase.from('musicas').select('*').order('titulo');
        const { data: mem } = await supabase.from('membros').select('*').order('nome');
        const { data: eve } = await supabase.from('eventos').select('*').order('data');
        set({ musicas: mus || [], membros: mem || [], eventos: eve || [] });
      },

      // MÚSICAS
      addMusica: async (m: any) => {
        await supabase.from('musicas').insert([{
          titulo: m.titulo, artista: m.artista, tom: m.tom,
          bpm: m.bpm ? parseInt(m.bpm) : null, intensidade: m.intensidade, 
          letra: m.letra, link_video: m.linkVideo
        }]);
        get().fetchInitialData();
      },

      deleteMusica: async (id: string) => {
        await supabase.from('musicas').delete().eq('id', id);
        get().fetchInitialData();
      },

      // MEMBROS (INTERNO)
      addMembro: async (m: any) => {
        await supabase.from('membros').insert([{
          nome: m.nome, email: m.email, funcoes: typeof m.funcoes === 'string' ? m.funcoes.split(',') : m.funcoes
        }]);
        get().fetchInitialData();
      },

      deleteMembro: async (id: string) => {
        await supabase.from('membros').delete().eq('id', id);
        get().fetchInitialData();
      },

      // ESCALAS
      upsertEvento: async (ev: any) => {
        const payload = {
          titulo: ev.titulo, data: ev.data, hora_inicio: ev.horaInicio,
          setlist: ev.setlist || [], equipe: ev.equipe || [], status: 'Pendente'
        };
        const { error } = ev.id 
          ? await supabase.from('eventos').update(payload).eq('id', ev.id)
          : await supabase.from('eventos').insert([payload]);
        if (!error) get().fetchInitialData();
      },

      deleteEvento: async (id: string) => {
        await supabase.from('eventos').delete().eq('id', id);
        get().fetchInitialData();
      },
      
      confirmPresenca: async (evId: string, mId: string) => {
        const ev = get().eventos.find((e:any) => e.id === evId);
        const novaEquipe = ev.equipe.map((s:any) => s.membroId === mId ? { ...s, status: 'Confirmado' } : s);
        await supabase.from('eventos').update({ equipe: novaEquipe }).eq('id', evId);
        get().fetchInitialData();
      },

      recusarPresenca: async (evId: string, mId: string) => {
        const ev = get().eventos.find((e:any) => e.id === evId);
        const novaEquipe = ev.equipe.map((s:any) => s.membroId === mId ? { ...s, status: 'Recusado' } : s);
        await supabase.from('eventos').update({ equipe: novaEquipe }).eq('id', evId);
        get().fetchInitialData();
      }
    }),
    {
      name: 'trackiecs-auth-storage',
    }
  )
);