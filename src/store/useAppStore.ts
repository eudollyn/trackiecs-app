import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { Musica, Membro, Evento, User } from '../shared/types';

interface TrackIECSState {
  isAuth: boolean;
  user: User | null;
  musicas: Musica[];
  membros: Membro[];
  eventos: Evento[];
  
  login: (u: User) => void;
  logout: () => void;
  addMusica: (m: Omit<Musica, 'id' | 'createdAt'>) => void;
  deleteMusica: (id: string) => void;
  addMembro: (m: Omit<Membro, 'id'>) => void;
  deleteMembro: (id: string) => void;
  upsertEvento: (ev: any) => void;
  deleteEvento: (id: string) => void;
  // NOVAS ACTIONS
  confirmPresenca: (eventoId: string, membroId: string) => void;
  recusarPresenca: (eventoId: string, membroId: string) => void;
}

export const useAppStore = create<TrackIECSState>()(
  persist(
    (set) => ({
      isAuth: false,
      user: null,
      musicas: [],
      membros: [],
      eventos: [],

      login: (u) => set({ isAuth: true, user: u }),
      logout: () => set({ isAuth: false, user: null }),

      addMusica: (m) => set((s) => ({
        musicas: [{ ...m, id: nanoid(), createdAt: Date.now() }, ...s.musicas]
      })),

      deleteMusica: (id) => set((s) => ({
        musicas: s.musicas.filter(m => m.id !== id)
      })),

      addMembro: (m) => set((s) => ({
        membros: [{ ...m, id: nanoid() }, ...s.membros]
      })),

      deleteMembro: (id) => set((s) => ({
        membros: s.membros.filter(m => m.id !== id)
      })),

      upsertEvento: (ev) => set((s) => {
        const index = s.eventos.findIndex(e => e.id === ev.id);
        const newEv = { 
          id: nanoid(), 
          status: 'Pendente', 
          equipe: (ev.equipe || []).map((slot: any) => ({ ...slot, status: 'Pendente' })), 
          ...ev 
        };
        if (index > -1) {
          const updated = [...s.eventos];
          updated[index] = { ...updated[index], ...ev };
          return { eventos: updated };
        }
        return { eventos: [newEv, ...s.eventos] };
      }),

      deleteEvento: (id) => set((s) => ({
        eventos: s.eventos.filter(e => e.id !== id)
      })),

      confirmPresenca: (eventoId: string, membroId: string) => set((state) => ({
  eventos: state.eventos.map(ev => 
    ev.id === eventoId 
      ? { 
          ...ev, 
          equipe: ev.equipe.map(slot => 
            slot.membroId === membroId ? { ...slot, status: 'Confirmado' } : slot
          ) 
        } 
      : ev
  )
})),

recusarPresenca: (eventoId: string, membroId: string) => set((state) => ({
  eventos: state.eventos.map(ev => 
    ev.id === eventoId 
      ? { 
          ...ev, 
          equipe: ev.equipe.map(slot => 
            slot.membroId === membroId ? { ...slot, status: 'Recusado' } : slot
          ) 
        } 
      : ev
  )
})),

    }),
    { name: 'track-iecs-v3' }
  )
);