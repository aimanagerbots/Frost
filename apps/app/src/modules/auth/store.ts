import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string | null;
}

interface AuthState {
  isAuthenticated: boolean;
  isDemoMode: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  session: Session | null;
  error: string | null;

  // Demo mode (existing behavior — unchanged)
  enterDemoMode: () => void;
  toggleDemoMode: () => void;

  // Real auth via Supabase
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  initSession: () => Promise<void>;

  // Shared
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
  isAuthenticated: false,
  isDemoMode: false,
  isLoading: false,
  user: null,
  session: null,
  error: null,

  // --- Demo mode ---
  enterDemoMode: () => {
    set({
      isAuthenticated: true,
      isDemoMode: true,
      isLoading: false,
      user: { id: 'demo', name: 'Demo User', email: 'demo@frostcannabis.co', role: 'admin', department: null },
      session: null,
      error: null,
    });
  },

  // Toggle demo mode without touching user/session (for logged-in admin)
  toggleDemoMode: () => {
    set((state) => ({ isDemoMode: !state.isDemoMode }));
  },

  // --- Real Supabase auth (with demo credential intercept) ---
  loginWithEmail: async (email, password) => {
    // Admin login: admin@frostcannabis.co / cultivera1
    if (email.toLowerCase() === 'admin@frostcannabis.co' && password === 'cultivera1') {
      set({
        isAuthenticated: true,
        isDemoMode: false,
        isLoading: false,
        user: { id: 'admin', name: 'Admin', email: 'admin@frostcannabis.co', role: 'admin', department: null },
        session: null,
        error: null,
      });
      return;
    }

    // Demo login: demo@frostcannabis.co / frost2026
    if (email.toLowerCase() === 'demo@frostcannabis.co' && password === 'frost2026') {
      set({
        isAuthenticated: true,
        isDemoMode: true,
        isLoading: false,
        user: { id: 'demo', name: 'Demo User', email: 'demo@frostcannabis.co', role: 'admin', department: null },
        session: null,
        error: null,
      });
      return;
    }

    if (!supabase) {
      set({ error: 'Supabase not configured. Use demo mode or set environment variables.' });
      return;
    }

    set({ isLoading: true, error: null });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      set({ isLoading: false, error: error.message });
      return;
    }

    if (data.session && data.user) {
      set({
        isAuthenticated: true,
        isDemoMode: false,
        isLoading: false,
        session: data.session,
        user: {
          id: data.user.id,
          name: data.user.user_metadata?.full_name || data.user.email || '',
          email: data.user.email || '',
          role: data.user.user_metadata?.role || 'viewer',
          department: data.user.user_metadata?.department || null,
        },
        error: null,
      });
    }
  },

  signUp: async (email, password, fullName) => {
    if (!supabase) {
      set({ error: 'Supabase not configured. Use demo mode or set environment variables.' });
      return;
    }

    set({ isLoading: true, error: null });

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) {
      set({ isLoading: false, error: error.message });
      return;
    }

    set({ isLoading: false, error: null });
  },

  initSession: async () => {
    // Don't touch Supabase if already in demo mode
    const current = useAuthStore.getState();
    if (current.isDemoMode) return;

    if (!supabase) return;

    set({ isLoading: true });

    const { data } = await supabase.auth.getSession();

    if (data.session) {
      const user = data.session.user;
      set({
        isAuthenticated: true,
        isDemoMode: false,
        isLoading: false,
        session: data.session,
        user: {
          id: user.id,
          name: user.user_metadata?.full_name || user.email || '',
          email: user.email || '',
          role: user.user_metadata?.role || 'viewer',
          department: user.user_metadata?.department || null,
        },
      });
    } else {
      set({ isLoading: false });
    }
  },

  logout: () => {
    if (supabase) {
      supabase.auth.signOut();
    }
    set({
      isAuthenticated: false,
      isDemoMode: false,
      isLoading: false,
      user: null,
      session: null,
      error: null,
    });
  },

  clearError: () => set({ error: null }),
    }),
    {
      name: 'frost-auth',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        isDemoMode: state.isDemoMode,
        user: state.user,
      }),
    },
  ),
);
