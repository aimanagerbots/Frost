import { create } from 'zustand';

interface TeamChatViewStore {
  activeTab: 'dm' | 'room' | 'ai';
  setActiveTab: (tab: 'dm' | 'room' | 'ai') => void;

  activeView: { type: 'channel' | 'dm'; id: string };
  setActiveView: (view: { type: 'channel' | 'dm'; id: string }) => void;

  contextPanelOpen: boolean;
  toggleContextPanel: () => void;

  showOriginal: Set<string>;
  toggleOriginal: (messageId: string) => void;
}

export const useTeamChatStore = create<TeamChatViewStore>((set) => ({
  activeTab: 'dm',
  setActiveTab: (tab) => set({ activeTab: tab }),

  activeView: { type: 'channel', id: 'ch-general' },
  setActiveView: (view) => set({ activeView: view }),

  contextPanelOpen: false,
  toggleContextPanel: () =>
    set((s) => ({ contextPanelOpen: !s.contextPanelOpen })),

  showOriginal: new Set<string>(),
  toggleOriginal: (messageId) =>
    set((s) => {
      const next = new Set(s.showOriginal);
      if (next.has(messageId)) {
        next.delete(messageId);
      } else {
        next.add(messageId);
      }
      return { showOriginal: next };
    }),
}));
