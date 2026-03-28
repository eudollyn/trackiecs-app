import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Musica, Membro, Evento } from '../types';

interface AppStore {
  isAuth: boolean;
  user: { nome: string; email: string; avatar: string } | null;
  musicas: Musica[];
  membros: Membro[];
  eventos: Evento[];
  
  // Actions
  login: (userData: any) => void;
  logout: () => void;
  
  upsertMusica: (musica: Musica) => void;
  deleteMusica: (id: string) => void;
  
  upsertMembro: (membro: Membro) => void;
  deleteMembro: (id: string) => void;
  
  upsertEvento: (evento: Evento) => void;
  deleteEvento: (id: string) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      isAuth: false,
      user: null,
      musicas: [],
      membros: [],
      eventos: [],

      login: (userData) => set({ isAuth: true, user: userData }),
      logout: () => set({ isAuth: false, user: null }),

      upsertMusica: (m) => set((s) => ({
        musicas: s.musicas.find(x => x.id === m.id) 
          ? s.musicas.map(x => x.id === m.id ? m : x)
          : [m, ...s.musicas]
      })),

      deleteMusica: (id) => set((s) => ({
        musicas: s.musicas.filter(x => x.id !== id),
        eventos: s.eventos.map(e => ({ ...e, setlist: e.setlist.filter(mId => mId !== id) }))
      })),

      upsertMembro: (m) => set((s) => ({
        membros: s.membros.find(x => x.id === m.id)
          ? s.membros.map(x => x.id === m.id ? m : x)
          : [m, ...s.membros]
      })),

      deleteMembro: (id) => set((s) => ({
        membros: s.membros.filter(x => x.id !== id),
        eventos: s.eventos.map(e => ({ ...e, equipe: e.equipe.filter(eq => eq.membroId !== id) }))
      })),

      upsertEvento: (e) => set((s) => ({
        eventos: s.eventos.find(x => x.id === e.id)
          ? s.eventos.map(x => x.id === e.id ? e : x)
          : [e, ...s.eventos]
      })),

      deleteEvento: (id) => set((s) => ({
        eventos: s.eventos.filter(x => x.id !== id)
      })),
    }),
    {
      name: 'trackiecs-v2-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);