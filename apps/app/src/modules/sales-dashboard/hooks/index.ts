'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import {
  MOCK_ACCOUNTS,
  MOCK_ORDERS,
  MOCK_CARTS,
} from '@/mocks/sales';
import type {
  SalesDashboardMetrics,
  WeeklySalesData,
  TopReorderAccount,
  TopOrderingClient,
} from '../types';
import type { SalesOrder, Cart, SalesAccount } from '@/modules/sales/types';

// ── Helpers ──────────────────────────────────────────────────────

function delay<T>(data: T, ms = 400): Promise<T> {
  return new Promise((r) => setTimeout(() => r(data), ms));
}

function filterByRep<T extends { assignedSalesRep?: string; submittedBy?: string; clientName?: string }>(
  items: T[],
  myAccountsOnly: boolean,
  currentRep: string,
  accounts?: SalesAccount[],
): T[] {
  if (!myAccountsOnly) return items;
  // Direct rep field
  if ('assignedSalesRep' in items[0]!) {
    return items.filter((i) => (i as unknown as SalesAccount).assignedSalesRep === currentRep);
  }
  // Orders have submittedBy
  if ('submittedBy' in items[0]!) {
    return items.filter((i) => (i as unknown as SalesOrder).submittedBy === currentRep);
  }
  // Carts — match by client name against rep accounts
  if (accounts) {
    const repClients = new Set(accounts.filter((a) => a.assignedSalesRep === currentRep).map((a) => a.clientName));
    return items.filter((i) => repClients.has(i.clientName!));
  }
  return items;
}

// ── Metrics ─────────────────────────────────────────────────────

function buildMetrics(myAccountsOnly: boolean, currentRep: string): SalesDashboardMetrics {
  const accounts = filterByRep(MOCK_ACCOUNTS, myAccountsOnly, currentRep) as SalesAccount[];
  const orders = filterByRep(MOCK_ORDERS, myAccountsOnly, currentRep) as SalesOrder[];
  const carts = filterByRep(MOCK_CARTS, myAccountsOnly, currentRep, MOCK_ACCOUNTS) as Cart[];

  const today = '2026-03-12';
  const thisMonth = '2026-03';

  const ordersToday = orders.filter((o) => o.submittedDate === today);
  const ordersMonth = orders.filter((o) => o.submittedDate.startsWith(thisMonth));
  const invoiced = orders.filter((o) => o.status === 'invoiced' && o.submittedDate.startsWith(thisMonth));
  const future = orders.filter((o) => o.estDeliveryDate && o.estDeliveryDate > today);

  return {
    totalAccounts: accounts.length,
    activeAccounts: accounts.filter((a) => a.status === 'active').length,
    activeCarts: carts.filter((c) => c.status === 'open').length,
    salesYTD: Math.round(orders.reduce((s, o) => s + o.orderTotal, 0)),
    revenueYTD: Math.round(orders.filter((o) => o.status === 'paid').reduce((s, o) => s + o.orderTotal, 0)),
    ordersToday: ordersToday.length,
    ordersTodayTotal: Math.round(ordersToday.reduce((s, o) => s + o.orderTotal, 0)),
    ordersThisMonth: ordersMonth.length,
    ordersThisMonthTotal: Math.round(ordersMonth.reduce((s, o) => s + o.orderTotal, 0)),
    invoicesMTD: invoiced.length,
    invoicesMTDTotal: Math.round(invoiced.reduce((s, o) => s + o.orderTotal, 0)),
    futureSalesOrders: future.length,
    futureSalesTotal: Math.round(future.reduce((s, o) => s + o.orderTotal, 0)),
  };
}

export function useSalesDashboardMetrics(myAccountsOnly: boolean, currentRep: string) {
  return useDemoQuery({
    queryKey: ['sales-dashboard', 'metrics', myAccountsOnly, currentRep],
    demoQueryFn: () => delay(buildMetrics(myAccountsOnly, currentRep)),
    emptyValue: {
      totalAccounts: 0,
      activeAccounts: 0,
      activeCarts: 0,
      salesYTD: 0,
      revenueYTD: 0,
      ordersToday: 0,
      ordersTodayTotal: 0,
      ordersThisMonth: 0,
      ordersThisMonthTotal: 0,
      invoicesMTD: 0,
      invoicesMTDTotal: 0,
      futureSalesOrders: 0,
      futureSalesTotal: 0,
    } as SalesDashboardMetrics,
  });
}

// ── Weekly Sales ────────────────────────────────────────────────

function buildWeeklySales(myAccountsOnly: boolean, currentRep: string): WeeklySalesData[] {
  const orders = filterByRep(MOCK_ORDERS, myAccountsOnly, currentRep) as SalesOrder[];
  // Generate 13 weekly buckets (last ~3 months)
  const weeks: WeeklySalesData[] = [];
  const baseDate = new Date('2026-03-12');
  for (let i = 12; i >= 0; i--) {
    const weekStart = new Date(baseDate.getTime() - i * 7 * 86400000);
    const weekEnd = new Date(weekStart.getTime() + 6 * 86400000);
    const label = `${(weekStart.getMonth() + 1).toString().padStart(2, '0')}/${weekStart.getDate().toString().padStart(2, '0')}`;
    const weekOrders = orders.filter((o) => {
      const d = new Date(o.submittedDate);
      return d >= weekStart && d <= weekEnd;
    });
    weeks.push({
      week: label,
      sales: Math.round(weekOrders.reduce((s, o) => s + o.orderTotal, 0)),
    });
  }
  return weeks;
}

export function useWeeklySales(myAccountsOnly: boolean, currentRep: string) {
  return useDemoQuery({
    queryKey: ['sales-dashboard', 'weekly-sales', myAccountsOnly, currentRep],
    demoQueryFn: () => delay(buildWeeklySales(myAccountsOnly, currentRep)),
    emptyValue: [] as WeeklySalesData[],
  });
}

// ── Active Carts ────────────────────────────────────────────────

function buildActiveCarts(myAccountsOnly: boolean, currentRep: string): Cart[] {
  const carts = filterByRep(MOCK_CARTS, myAccountsOnly, currentRep, MOCK_ACCOUNTS) as Cart[];
  return carts.filter((c) => c.status === 'open').slice(0, 10);
}

export function useActiveCartsSummary(myAccountsOnly: boolean, currentRep: string) {
  return useDemoQuery({
    queryKey: ['sales-dashboard', 'active-carts', myAccountsOnly, currentRep],
    demoQueryFn: () => delay(buildActiveCarts(myAccountsOnly, currentRep)),
    emptyValue: [] as Cart[],
  });
}

// ── Recent Orders ───────────────────────────────────────────────

function buildRecentOrders(myAccountsOnly: boolean, currentRep: string): SalesOrder[] {
  const orders = filterByRep(MOCK_ORDERS, myAccountsOnly, currentRep) as SalesOrder[];
  return [...orders].sort((a, b) => b.submittedDate.localeCompare(a.submittedDate)).slice(0, 10);
}

export function useRecentOrders(myAccountsOnly: boolean, currentRep: string) {
  return useDemoQuery({
    queryKey: ['sales-dashboard', 'recent-orders', myAccountsOnly, currentRep],
    demoQueryFn: () => delay(buildRecentOrders(myAccountsOnly, currentRep)),
    emptyValue: [] as SalesOrder[],
  });
}

// ── Recent Clients (top reorder + top ordering) ─────────────────

function buildTopReorderAccounts(myAccountsOnly: boolean, currentRep: string): TopReorderAccount[] {
  const orders = filterByRep(MOCK_ORDERS, myAccountsOnly, currentRep) as SalesOrder[];
  const map = new Map<string, { count: number; lastOrder: string }>();
  for (const o of orders) {
    const entry = map.get(o.clientName) ?? { count: 0, lastOrder: '2000-01-01' };
    entry.count += 1;
    if (o.submittedDate > entry.lastOrder) entry.lastOrder = o.submittedDate;
    map.set(o.clientName, entry);
  }
  return [...map.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)
    .map(([name, data]) => ({ accountName: name, orderCount: data.count, lastOrder: data.lastOrder }));
}

function buildTopOrderingClients(myAccountsOnly: boolean, currentRep: string): TopOrderingClient[] {
  const orders = filterByRep(MOCK_ORDERS, myAccountsOnly, currentRep) as SalesOrder[];
  const map = new Map<string, number>();
  for (const o of orders) {
    map.set(o.clientName, (map.get(o.clientName) ?? 0) + o.orderTotal);
  }
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, total]) => ({ accountName: name, total: Math.round(total) }));
}

export function useRecentClients(myAccountsOnly: boolean, currentRep: string) {
  return useDemoQuery({
    queryKey: ['sales-dashboard', 'recent-clients', myAccountsOnly, currentRep],
    demoQueryFn: () =>
      delay({
        topReorder: buildTopReorderAccounts(myAccountsOnly, currentRep),
        topOrdering: buildTopOrderingClients(myAccountsOnly, currentRep),
      }),
    emptyValue: {
      topReorder: [] as TopReorderAccount[],
      topOrdering: [] as TopOrderingClient[],
    },
  });
}
