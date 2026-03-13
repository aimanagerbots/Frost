'use client';

import { useQuery } from '@tanstack/react-query';
import {
  MOCK_ACCOUNTS,
  MOCK_CONTACTS,
  MOCK_ORDERS,
} from '@/mocks/sales';
import type { AccountListTab, AccountDiscount } from '../types';

// ── Simulated delay ──────────────────────────────────────────────

function delay(ms = 400): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// ── useAccounts — list filtered by tab ──────────────────────────

export function useAccounts(tab: AccountListTab) {
  return useQuery({
    queryKey: ['accounts', tab],
    queryFn: async () => {
      await delay();
      if (tab === 'all') return MOCK_ACCOUNTS;
      return MOCK_ACCOUNTS.filter((a) => a.status === tab);
    },
  });
}

// ── useAccount — single account by id ───────────────────────────

export function useAccount(id: string | null) {
  return useQuery({
    queryKey: ['account', id],
    queryFn: async () => {
      await delay(300);
      return MOCK_ACCOUNTS.find((a) => a.id === id) ?? null;
    },
    enabled: !!id,
  });
}

// ── useAccountContacts ──────────────────────────────────────────

export function useAccountContacts(accountId: string | null) {
  return useQuery({
    queryKey: ['account-contacts', accountId],
    queryFn: async () => {
      await delay(300);
      return MOCK_CONTACTS.filter((c) => c.accountId === accountId);
    },
    enabled: !!accountId,
  });
}

// ── useAccountOrders ────────────────────────────────────────────

export function useAccountOrders(accountId: string | null) {
  return useQuery({
    queryKey: ['account-orders', accountId],
    queryFn: async () => {
      await delay(350);
      const account = MOCK_ACCOUNTS.find((a) => a.id === accountId);
      if (!account) return [];
      return MOCK_ORDERS.filter((o) => o.clientName === account.clientName);
    },
    enabled: !!accountId,
  });
}

// ── useAccountDiscounts ─────────────────────────────────────────

const PRODUCT_NAMES = [
  'Premium Flower - Platinum Pineapple 3.5g',
  'Premium Flower - Green Crack 3.5g',
  'Premium Flower - Moonbow 3.5g',
  'RTM | Preroll Material - PP 1g',
  'Edible - Orange Crush Gummies 10pk',
];

function generateDiscounts(): AccountDiscount[] {
  return PRODUCT_NAMES.map((name, i) => ({
    id: `disc-${i}`,
    productName: name,
    price: 20 + i * 5,
    discountPrice: 15 + i * 4,
    quantity: 10 + i * 5,
  }));
}

export function useAccountDiscounts(accountId: string | null) {
  return useQuery({
    queryKey: ['account-discounts', accountId],
    queryFn: async () => {
      await delay(300);
      return generateDiscounts();
    },
    enabled: !!accountId,
  });
}

// ── useSalesReps ────────────────────────────────────────────────

export function useSalesReps() {
  return useQuery({
    queryKey: ['sales-reps'],
    queryFn: async () => {
      await delay(200);
      return ['Support Cultivera', 'Nichole Cluff', 'Stacia Hartwell', 'Richard Maloney', 'Michael Perkins'];
    },
  });
}
