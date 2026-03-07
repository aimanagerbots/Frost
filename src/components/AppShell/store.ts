import { create } from 'zustand';

interface SidebarState {
  collapsed: boolean;
  mobileOpen: boolean;
  toggleCollapsed: () => void;
  setMobileOpen: (open: boolean) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  collapsed: false,
  mobileOpen: false,
  toggleCollapsed: () => set((s) => ({ collapsed: !s.collapsed })),
  setMobileOpen: (open) => set({ mobileOpen: open }),
}));

interface CommandPaletteState {
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
}

export const useCommandPaletteStore = create<CommandPaletteState>((set) => ({
  commandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
}));

type Theme = 'dark' | 'light';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: (typeof window !== 'undefined'
    ? (localStorage.getItem('frost-theme') as Theme) || 'dark'
    : 'dark'),
  toggleTheme: () =>
    set((s) => {
      const next = s.theme === 'dark' ? 'light' : 'dark';
      if (typeof window !== 'undefined') {
        localStorage.setItem('frost-theme', next);
        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.classList.add(next);
      }
      return { theme: next };
    }),
}));
