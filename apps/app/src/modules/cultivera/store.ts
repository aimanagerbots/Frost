import { create } from 'zustand';
import type { CultiveraView } from './types';

interface CultiveraStore {
  activeView: CultiveraView;
  selectedOrderId: string | null;
  selectedSyncRunId: string | null;
  selectedCampaignId: string | null;
  setView: (view: CultiveraView) => void;
  selectOrder: (id: string | null) => void;
  selectSyncRun: (id: string | null) => void;
  selectCampaign: (id: string | null) => void;
}

export const useCultiveraStore = create<CultiveraStore>((set) => ({
  activeView: 'dashboard',
  selectedOrderId: null,
  selectedSyncRunId: null,
  selectedCampaignId: null,
  setView: (view) => set({ activeView: view, selectedOrderId: null, selectedSyncRunId: null, selectedCampaignId: null }),
  selectOrder: (id) => set({ selectedOrderId: id }),
  selectSyncRun: (id) => set({ selectedSyncRunId: id }),
  selectCampaign: (id) => set({ selectedCampaignId: id }),
}));
