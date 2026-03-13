'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { MOCK_ORDERS } from '@/mocks/sales';
import type { SalesOrder, SalesOrderStatus } from '@/modules/sales/types';

export interface SalesOrderFilter {
  status?: SalesOrderStatus;
  hideReleased?: boolean;
  hideCancelled?: boolean;
  backordersOnly?: boolean;
  clientName?: string;
  city?: string;
  submittedBy?: string;
  search?: string;
}

function filterOrders(
  orders: SalesOrder[],
  filters: SalesOrderFilter,
): SalesOrder[] {
  let result = [...orders];

  if (filters.status) {
    result = result.filter((o) => o.status === filters.status);
  }

  if (filters.hideReleased) {
    result = result.filter((o) => !o.releasedDate);
  }

  if (filters.clientName) {
    const term = filters.clientName.toLowerCase();
    result = result.filter((o) => o.clientName.toLowerCase().includes(term));
  }

  if (filters.city) {
    const term = filters.city.toLowerCase();
    result = result.filter((o) => o.city.toLowerCase().includes(term));
  }

  if (filters.submittedBy) {
    const term = filters.submittedBy.toLowerCase();
    result = result.filter((o) => o.submittedBy.toLowerCase().includes(term));
  }

  if (filters.search) {
    const term = filters.search.toLowerCase();
    result = result.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(term) ||
        o.clientName.toLowerCase().includes(term) ||
        o.city.toLowerCase().includes(term) ||
        o.submittedBy.toLowerCase().includes(term),
    );
  }

  return result;
}

export function useSalesOrders(filters: SalesOrderFilter = {}) {
  return useDemoQuery({
    queryKey: ['salesOrders', 'list', filters],
    demoQueryFn: async () => {
      // Simulate network delay
      await new Promise((r) => setTimeout(r, 300));
      return filterOrders(MOCK_ORDERS, filters);
    },
    emptyValue: [] as SalesOrder[],
  });
}

export type SalesOrderStatusTab = 'all' | SalesOrderStatus;

export function useSalesOrderCounts() {
  return useDemoQuery({
    queryKey: ['salesOrders', 'counts'],
    demoQueryFn: async () => {
      await new Promise((r) => setTimeout(r, 200));
      const counts: Record<string, number> = { all: MOCK_ORDERS.length };
      for (const order of MOCK_ORDERS) {
        counts[order.status] = (counts[order.status] ?? 0) + 1;
      }
      return counts;
    },
    emptyValue: {} as Record<string, number>,
  });
}
