'use client';

import { useQuery } from '@tanstack/react-query';
import { getInventoryMetrics } from '@/mocks/inventory';

export function useInventoryMetrics() {
  return useQuery({
    queryKey: ['inventory', 'metrics'],
    queryFn: getInventoryMetrics,
  });
}
