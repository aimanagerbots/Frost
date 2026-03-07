import { create } from 'zustand';
import type { ManufacturingView } from './types';

interface ManufacturingStore {
  activeView: ManufacturingView;
  selectedWorkOrderId: string | null;
  setView: (view: ManufacturingView) => void;
  selectWorkOrder: (id: string | null) => void;
}

export const useManufacturingStore = create<ManufacturingStore>((set) => ({
  activeView: 'dashboard',
  selectedWorkOrderId: null,
  setView: (view) => set({ activeView: view, selectedWorkOrderId: null }),
  selectWorkOrder: (id) => set({ selectedWorkOrderId: id }),
}));
