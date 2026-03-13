'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { MOCK_ORDER_SUMMARY, SALES_REPS } from '@/mocks/sales';
import type { OrderSummaryRow } from '@/modules/sales/types';
import type { OrderSummaryFilters } from '../types';

function filterOrders(
  rows: OrderSummaryRow[],
  filters: OrderSummaryFilters
): OrderSummaryRow[] {
  return rows.filter((row) => {
    // Trade name search
    if (
      filters.tradeName &&
      !row.tradeName.toLowerCase().includes(filters.tradeName.toLowerCase())
    ) {
      return false;
    }

    // Status filter
    if (filters.status) {
      const normalizedStatus = row.status.replace(/-/g, ' ').toLowerCase();
      const normalizedFilter = filters.status.toLowerCase();
      if (normalizedStatus !== normalizedFilter) return false;
    }

    // Submitted By filter
    if (filters.submittedBy && row.submittedBy !== filters.submittedBy) {
      return false;
    }

    // Date range filters — submitted date
    if (filters.fromSubmittedDate && row.submittedDate < filters.fromSubmittedDate) {
      return false;
    }
    if (filters.toSubmittedDate && row.submittedDate > filters.toSubmittedDate) {
      return false;
    }

    // Date range filters — est delivery date
    if (filters.fromEstDeliveryDate && (!row.estDeliveryDate || row.estDeliveryDate < filters.fromEstDeliveryDate)) {
      return false;
    }
    if (filters.toEstDeliveryDate && (!row.estDeliveryDate || row.estDeliveryDate > filters.toEstDeliveryDate)) {
      return false;
    }

    // Date range filters — released date
    if (filters.fromReleasedDate && (!row.releasedDate || row.releasedDate < filters.fromReleasedDate)) {
      return false;
    }
    if (filters.toReleasedDate && (!row.releasedDate || row.releasedDate > filters.toReleasedDate)) {
      return false;
    }

    return true;
  });
}

export function useOrderSummary(filters: OrderSummaryFilters) {
  return useDemoQuery({
    queryKey: ['order-summary', filters],
    demoQueryFn: async () => {
      // Simulated API delay
      await new Promise((resolve) => setTimeout(resolve, 400));

      const filtered = filterOrders(MOCK_ORDER_SUMMARY, filters);
      const grandTotal = filtered.reduce((sum, row) => sum + row.orderTotal, 0);

      return {
        rows: filtered,
        grandTotal: Math.round(grandTotal * 100) / 100,
        totalCount: filtered.length,
      };
    },
    emptyValue: {
      rows: [] as OrderSummaryRow[],
      grandTotal: 0,
      totalCount: 0,
    },
  });
}

export function useSalesReps() {
  return useDemoQuery({
    queryKey: ['sales-reps'],
    demoQueryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return SALES_REPS;
    },
    emptyValue: [] as string[],
  });
}
