import { create } from 'zustand';

export type CardAccent = 'top' | 'left' | 'off';
export type TabStyle = 'pill' | 'underline';
export type HoverIntensity = 'subtle' | 'normal' | 'strong';
export type Theme = 'dark' | 'light';

interface UIPreferences {
  cardAccent: CardAccent;
  tabStyle: TabStyle;
  hoverIntensity: HoverIntensity;
  theme: Theme;
  setCardAccent: (v: CardAccent) => void;
  setTabStyle: (v: TabStyle) => void;
  setHoverIntensity: (v: HoverIntensity) => void;
  setTheme: (v: Theme) => void;
  toggleTheme: () => void;
}

const STORAGE_KEY = 'frost-ui-preferences';

const HOVER_CSS_MAP: Record<HoverIntensity, string> = {
  subtle: 'rgba(91, 184, 230, 0.05)',
  normal: 'rgba(91, 184, 230, 0.15)',
  strong: 'rgba(91, 184, 230, 0.30)',
};

function loadFromStorage(): Partial<UIPreferences> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveToStorage(state: Partial<UIPreferences>) {
  if (typeof window === 'undefined') return;
  const { cardAccent, tabStyle, hoverIntensity, theme } = state as UIPreferences;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ cardAccent, tabStyle, hoverIntensity, theme }));
}

function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.remove('dark', 'light');
  document.documentElement.classList.add(theme);
  // Also sync the legacy frost-theme key for existing ThemeStore consumers
  localStorage.setItem('frost-theme', theme);
}

function applyHoverIntensity(intensity: HoverIntensity) {
  if (typeof document === 'undefined') return;
  document.documentElement.style.setProperty('--accent-hover', HOVER_CSS_MAP[intensity]);
}

const stored = loadFromStorage();

export const useUIPreferences = create<UIPreferences>((set, get) => ({
  cardAccent: (stored.cardAccent as CardAccent) ?? 'top',
  tabStyle: (stored.tabStyle as TabStyle) ?? 'pill',
  hoverIntensity: (stored.hoverIntensity as HoverIntensity) ?? 'strong',
  theme: (stored.theme as Theme) ?? 'dark',

  setCardAccent: (v) =>
    set((s) => {
      const next = { ...s, cardAccent: v };
      saveToStorage(next);
      return { cardAccent: v };
    }),

  setTabStyle: (v) =>
    set((s) => {
      const next = { ...s, tabStyle: v };
      saveToStorage(next);
      return { tabStyle: v };
    }),

  setHoverIntensity: (v) =>
    set((s) => {
      const next = { ...s, hoverIntensity: v };
      saveToStorage(next);
      applyHoverIntensity(v);
      return { hoverIntensity: v };
    }),

  setTheme: (v) =>
    set((s) => {
      const next = { ...s, theme: v };
      saveToStorage(next);
      applyTheme(v);
      return { theme: v };
    }),

  toggleTheme: () => {
    const current = get().theme;
    const next = current === 'dark' ? 'light' : 'dark';
    get().setTheme(next);
  },
}));
