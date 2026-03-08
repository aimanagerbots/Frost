'use client';

import { useQuery } from '@tanstack/react-query';
import { getOrderMetrics } from '@/mocks/orders';

export function useOrderMetrics() {
  return useQuery({
    queryKey: ['orders', 'metrics'],
    queryFn: getOrderMetrics,
  });
}
