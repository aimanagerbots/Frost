'use client';

import { useQuery } from '@tanstack/react-query';
import { getOrders } from '@/mocks/orders';
import type { OrderFilter } from '@/modules/orders/types';

export function useOrders(filters?: OrderFilter) {
  return useQuery({
    queryKey: ['orders', 'list', filters],
    queryFn: () => getOrders(filters),
  });
}
