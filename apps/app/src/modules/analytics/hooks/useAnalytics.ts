'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { MOCK_SALES_REP_REPORTS, MOCK_ACCOUNTS } from '@/mocks/sales';

// ── Types ────────────────────────────────────────────────────────

export interface MonthlySalesRow {
  month: string;
  revenue: number;
  orderCount: number;
  avgOrderValue: number;
}

export interface ClientByProductData {
  accounts: string[];
  categories: string[];
  matrix: number[][];
}

export interface ProductByClientData {
  products: string[];
  clients: string[];
  matrix: number[][];
}

// ── Deterministic seed helper ────────────────────────────────────

function seededValue(seed: number): number {
  // Simple deterministic hash
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

// ── Monthly Sales ────────────────────────────────────────────────

function generateMonthlySales(): MonthlySalesRow[] {
  const months = [
    'Apr 2025', 'May 2025', 'Jun 2025', 'Jul 2025',
    'Aug 2025', 'Sep 2025', 'Oct 2025', 'Nov 2025',
    'Dec 2025', 'Jan 2026', 'Feb 2026', 'Mar 2026',
  ];

  return months.map((month, i) => {
    const variation = 1 + (seededValue(i + 1) - 0.5) * 0.30; // ±15%
    const revenue = Math.round(180000 * variation);
    const orderCount = Math.round(45 + seededValue(i + 100) * 35);
    const avgOrderValue = Math.round(revenue / orderCount);
    return { month, revenue, orderCount, avgOrderValue };
  });
}

export function useMonthlySales() {
  return useDemoQuery({
    queryKey: ['analytics', 'monthly-sales'],
    demoQueryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return generateMonthlySales();
    },
    emptyValue: [] as MonthlySalesRow[],
  });
}

// ── Sales By Person ──────────────────────────────────────────────

export function useSalesByPerson() {
  return useDemoQuery({
    queryKey: ['analytics', 'sales-by-person'],
    demoQueryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return MOCK_SALES_REP_REPORTS;
    },
    emptyValue: [] as typeof MOCK_SALES_REP_REPORTS,
  });
}

// ── Client By Product ────────────────────────────────────────────

const PRODUCT_CATEGORIES = ['flower', 'preroll', 'vaporizer', 'concentrate', 'edible', 'beverage'];

function generateClientByProductMatrix(): ClientByProductData {
  const topAccounts = MOCK_ACCOUNTS
    .slice(0, 15)
    .map((a) => a.clientName);

  const matrix = topAccounts.map((_, ai) =>
    PRODUCT_CATEGORIES.map((_, ci) => {
      const seed = (ai + 1) * 7 + (ci + 1) * 13;
      const base = seededValue(seed);
      // Flower tends higher, beverage lower
      const categoryWeight = [1.8, 1.2, 0.9, 1.0, 0.7, 0.4][ci];
      return Math.round(base * 18000 * categoryWeight);
    })
  );

  return {
    accounts: topAccounts,
    categories: PRODUCT_CATEGORIES,
    matrix,
  };
}

export function useClientByProduct() {
  return useDemoQuery({
    queryKey: ['analytics', 'client-by-product'],
    demoQueryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return generateClientByProductMatrix();
    },
    emptyValue: { accounts: [], categories: [], matrix: [] } as ClientByProductData,
  });
}

// ── Product By Client ────────────────────────────────────────────

function generateProductByClientMatrix(): ProductByClientData {
  const cbp = generateClientByProductMatrix();

  // Transpose: rows = categories, cols = accounts
  const matrix = cbp.categories.map((_, ci) =>
    cbp.accounts.map((_, ai) => cbp.matrix[ai][ci])
  );

  return {
    products: cbp.categories,
    clients: cbp.accounts,
    matrix,
  };
}

export function useProductByClient() {
  return useDemoQuery({
    queryKey: ['analytics', 'product-by-client'],
    demoQueryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return generateProductByClientMatrix();
    },
    emptyValue: { products: [], clients: [], matrix: [] } as ProductByClientData,
  });
}
