'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getOrders } from '@/mocks/orders';
import type { Order, OrderFilter } from '@/modules/orders/types';

export function useOrders(filters?: OrderFilter) {
  return useDemoQuery({
    queryKey: ['orders', 'list', filters],
    demoQueryFn: () => getOrders(filters),
    emptyValue: [] as Order[],
  });
}
