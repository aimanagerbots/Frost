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
  isLoading: boolean;
  user: AuthUser | null;
  session: Session | null;
  error: string | null;

  loginWithEmail: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  initSession: () => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
  isAuthenticated: false,
  isLoading: false,
  user: null,
  session: null,
  error: null,

  loginWithEmail: async (email, password) => {
    if (!supabase) {
      set({ error: 'Supabase not configured.' });
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
      set({ error: 'Supabase not configured.' });
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
    if (!supabase) return;

    set({ isLoading: true });

    const { data } = await supabase.auth.getSession();

    if (data.session) {
      const user = data.session.user;
      set({
        isAuthenticated: true,
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
        user: state.user,
      }),
    },
  ),
);
