import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  readonly isLoggedIn: boolean;
  readonly customerName: string;
  readonly customerEmail: string;
  login: (name: string, email: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      customerName: '',
      customerEmail: '',
      login: (name, email) =>
        set({ isLoggedIn: true, customerName: name, customerEmail: email }),
      logout: () =>
        set({ isLoggedIn: false, customerName: '', customerEmail: '' }),
    }),
    {
      name: 'frost-auth',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
