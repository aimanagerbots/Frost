import { create } from 'zustand';
import type { PortalAccount } from '../types';
import { PORTAL_ACCOUNTS } from '../mock-data';

interface PortalAuthState {
  currentAccount: PortalAccount | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (accountId: string) => void;
  logout: () => void;
  switchAccount: (accountId: string) => void;
}

export const usePortalAuth = create<PortalAuthState>((set) => ({
  currentAccount: null,
  isAuthenticated: false,
  isLoading: false,

  login: (accountId: string) => {
    set({ isLoading: true });
    const account = PORTAL_ACCOUNTS.find((a) => a.id === accountId) ?? null;
    set({
      currentAccount: account,
      isAuthenticated: account !== null,
      isLoading: false,
    });
  },

  logout: () => {
    set({
      currentAccount: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  switchAccount: (accountId: string) => {
    set({ isLoading: true });
    const account = PORTAL_ACCOUNTS.find((a) => a.id === accountId) ?? null;
    set({
      currentAccount: account,
      isAuthenticated: account !== null,
      isLoading: false,
    });
  },
}));
