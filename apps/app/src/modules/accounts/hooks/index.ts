'use client';

import { useQuery } from '@tanstack/react-query';
import { useDemoQuery } from '@/lib/use-demo-query';
import {
  MOCK_ACCOUNTS,
  MOCK_CONTACTS,
  MOCK_ORDERS,
} from '@/mocks/sales';
import type { AccountListTab, AccountDiscount } from '../types';
import type { SalesAccount } from '@/modules/sales/types';
import { useAuthStore } from '@/modules/auth/store';
import { supabase } from '@/lib/supabase';

// ── DB row → SalesAccount mapper ────────────────────────────────

interface DBAccount {
  id: string;
  name: string;
  license_number: string | null;
  address_street: string | null;
  address_city: string | null;
  address_state: string | null;
  address_zip: string | null;
  pipeline_status: string;
  pipeline_code: string | null;
  health_score: number;
  total_revenue: number;
  total_orders: number;
  average_order_value: number;
  assigned_rep_id: string | null;
  is_active: boolean;
}

function mapStatus(pipeline: string): 'active' | 'inactive' | 'recovery' {
  if (pipeline === 'active' || pipeline === 'inquiry') return 'active';
  if (pipeline === 'recovery') return 'recovery';
  return 'inactive';
}

function mapToSalesAccount(a: DBAccount): SalesAccount {
  return {
    id: a.id,
    clientName: a.name,
    address: [a.address_street, a.address_city, a.address_state].filter(Boolean).join(', ') || 'N/A',
    city: a.address_city ?? '',
    licenseUBI: a.license_number ?? '',
    email: '',
    status: mapStatus(a.pipeline_status),
    deliveryDays: [],
    amPm: 'am',
    specialInstructions: '',
    labelBarcodePreference: '',
    fulfillmentPriority: 'fifo',
    assignedSalesRep: a.assigned_rep_id ?? 'Unassigned',
    contactCount: 0,
    orderCount: a.total_orders,
    pipelineCode: a.pipeline_code ?? undefined,
  };
}

// ── Simulated delay ──────────────────────────────────────────────

function delay(ms = 400): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// ── useAccounts — list filtered by tab ──────────────────────────

export function useAccounts(tab: AccountListTab) {
  const { isDemoMode } = useAuthStore();

  return useQuery({
    queryKey: ['accounts', tab, isDemoMode],
    queryFn: async () => {
      if (isDemoMode) {
        await delay();
        if (tab === 'all') return MOCK_ACCOUNTS;
        return MOCK_ACCOUNTS.filter((a) => a.status === tab);
      }

      if (!supabase) return [];

      const { data, error } = await supabase
        .from('accounts')
        .select('id, name, license_number, address_street, address_city, address_state, address_zip, pipeline_status, pipeline_code, health_score, total_revenue, total_orders, average_order_value, assigned_rep_id, is_active')
        .eq('is_active', true)
        .order('name');

      if (error) throw new Error(error.message);

      const mapped = (data as DBAccount[]).map(mapToSalesAccount);
      if (tab === 'all') return mapped;
      return mapped.filter((a) => a.status === tab);
    },
    enabled: true,
  });
}

// ── useAccount — single account by id ───────────────────────────

export function useAccount(id: string | null) {
  const { isDemoMode } = useAuthStore();

  return useQuery({
    queryKey: ['account', id, isDemoMode],
    queryFn: async () => {
      if (isDemoMode) {
        await delay(300);
        return MOCK_ACCOUNTS.find((a) => a.id === id) ?? null;
      }

      if (!supabase) return null;

      const { data, error } = await supabase
        .from('accounts')
        .select('id, name, license_number, address_street, address_city, address_state, address_zip, pipeline_status, pipeline_code, health_score, total_revenue, total_orders, average_order_value, assigned_rep_id, is_active')
        .eq('id', id!)
        .single();

      if (error) throw new Error(error.message);
      return mapToSalesAccount(data as DBAccount);
    },
    enabled: !!id,
  });
}

// ── useAccountContacts ──────────────────────────────────────────

export function useAccountContacts(accountId: string | null) {
  const { isDemoMode } = useAuthStore();

  return useQuery({
    queryKey: ['account-contacts', accountId, isDemoMode],
    queryFn: async () => {
      if (isDemoMode) {
        await delay(300);
        return MOCK_CONTACTS.filter((c) => c.accountId === accountId);
      }

      if (!supabase) return [];

      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('account_id', accountId!)
        .eq('is_active', true);

      if (error) throw new Error(error.message);
      return data ?? [];
    },
    enabled: !!accountId,
  });
}

// ── useAccountOrders ────────────────────────────────────────────

export function useAccountOrders(accountId: string | null) {
  return useDemoQuery({
    queryKey: ['account-orders', accountId],
    demoQueryFn: async () => {
      await delay(350);
      const account = MOCK_ACCOUNTS.find((a) => a.id === accountId);
      if (!account) return [];
      return MOCK_ORDERS.filter((o) => o.clientName === account.clientName);
    },
    emptyValue: [] as typeof MOCK_ORDERS,
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
  return useDemoQuery({
    queryKey: ['account-discounts', accountId],
    demoQueryFn: async () => {
      await delay(300);
      return generateDiscounts();
    },
    emptyValue: [] as AccountDiscount[],
    enabled: !!accountId,
  });
}

// ── useSalesReps ────────────────────────────────────────────────

export function useSalesReps() {
  return useDemoQuery({
    queryKey: ['sales-reps'],
    demoQueryFn: async () => {
      await delay(200);
      return ['Support Cultivera', 'Nichole Cluff', 'Stacia Hartwell', 'Richard Maloney', 'Michael Perkins'];
    },
    emptyValue: [] as string[],
  });
}
