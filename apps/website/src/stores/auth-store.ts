'use client';

import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  readonly isLoggedIn: boolean;
  readonly customerName: string;
  readonly customerEmail: string;
  login: (name: string, email: string) => void;
  logout: () => void;
}

const useAuthStoreRaw = create<AuthState>()(
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
    { name: 'frost-auth' },
  ),
);

/**
 * Hydration-safe hook. Returns defaults during SSR/first render,
 * then live store values after client hydration completes.
 * Prevents Next.js hydration mismatch from persisted localStorage data.
 */
export function useAuthStore<T>(selector: (state: AuthState) => T): T {
  const value = useAuthStoreRaw(selector);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    // Return default (non-persisted) value during SSR and first client render
    return selector({
      isLoggedIn: false,
      customerName: '',
      customerEmail: '',
      login: useAuthStoreRaw.getState().login,
      logout: useAuthStoreRaw.getState().logout,
    });
  }

  return value;
}
