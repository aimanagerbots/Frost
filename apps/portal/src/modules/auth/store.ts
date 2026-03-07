import { create } from 'zustand';

interface AuthUser {
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isDemoMode: boolean;
  user: AuthUser | null;
  login: (email: string, password: string) => void;
  enterDemoMode: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isDemoMode: false,
  user: null,
  login: (_email, _password) => {
    set({
      isAuthenticated: true,
      isDemoMode: false,
      user: { name: 'Jake Morrison', email: _email, role: 'Sales Manager' },
    });
  },
  enterDemoMode: () => {
    set({
      isAuthenticated: true,
      isDemoMode: true,
      user: { name: 'Demo User', email: 'demo@frost.com', role: 'Sales Manager' },
    });
  },
  logout: () => {
    set({ isAuthenticated: false, isDemoMode: false, user: null });
  },
}));
