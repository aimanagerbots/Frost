'use client';

import { useQuery } from '@tanstack/react-query';
import { getOrderPipeline } from '@/mocks/orders';

export function useOrderPipeline() {
  return useQuery({
    queryKey: ['orders', 'pipeline'],
    queryFn: getOrderPipeline,
  });
}
