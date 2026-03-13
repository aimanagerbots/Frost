import { create } from 'zustand';
import type { PackagingView } from './types';

interface PackagingStore {
  activeView: PackagingView;
  selectedOrderId: string | null;
  setView: (view: PackagingView) => void;
  selectOrder: (id: string | null) => void;
}

export const usePackagingStore = create<PackagingStore>((set) => ({
  activeView: 'dashboard',
  selectedOrderId: null,
  setView: (view) => set({ activeView: view, selectedOrderId: null }),
  selectOrder: (id) => set({ selectedOrderId: id }),
}));
