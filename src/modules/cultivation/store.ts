import { create } from 'zustand';
import type { CultivationView, CultivationChatMode } from './types';

interface CultivationStore {
  activeView: CultivationView;
  selectedRoomId: string | null;
  chatMode: CultivationChatMode;
  language: 'en' | 'es';
  setView: (view: CultivationView) => void;
  navigateToRoom: (id: string) => void;
  setChatMode: (mode: CultivationChatMode) => void;
  setLanguage: (lang: 'en' | 'es') => void;
}

export const useCultivationStore = create<CultivationStore>((set) => ({
  activeView: 'dashboard',
  selectedRoomId: null,
  chatMode: 'cultivation-ai',
  language: 'en',
  setView: (view) => set({ activeView: view, selectedRoomId: null }),
  navigateToRoom: (id) => set({ activeView: 'room', selectedRoomId: id }),
  setChatMode: (mode) => set({ chatMode: mode }),
  setLanguage: (lang) => set({ language: lang }),
}));
