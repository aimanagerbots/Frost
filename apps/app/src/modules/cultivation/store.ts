import { create } from 'zustand';
import type { CultivationView } from './types';

interface CultivationStore {
  activeView: CultivationView;
  selectedRoomId: string | null;
  selectedEnvironmentRoomId: string | null;
  setView: (view: CultivationView) => void;
  navigateToRoom: (id: string) => void;
  setEnvironmentRoom: (id: string | null) => void;
}

export const useCultivationStore = create<CultivationStore>((set) => ({
  activeView: 'overview',
  selectedRoomId: null,
  selectedEnvironmentRoomId: null,
  setView: (view) => set({ activeView: view, selectedRoomId: null }),
  navigateToRoom: (id) => set({ activeView: 'environment', selectedRoomId: id, selectedEnvironmentRoomId: id }),
  setEnvironmentRoom: (id) => set({ selectedEnvironmentRoomId: id }),
}));
