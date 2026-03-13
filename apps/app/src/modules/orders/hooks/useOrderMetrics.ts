'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getOrderMetrics } from '@/mocks/orders';
import type { OrderMetrics } from '@/modules/orders/types';

export function useOrderMetrics() {
  return useDemoQuery({
    queryKey: ['orders', 'metrics'],
    demoQueryFn: getOrderMetrics,
    emptyValue: {
      totalOrders: 0,
      pendingCount: 0,
      avgFulfillmentDays: 0,
      onTimeRate: 0,
      avgOrderValue: 0,
      revenueThisMonth: 0,
    } as OrderMetrics,
  });
}
