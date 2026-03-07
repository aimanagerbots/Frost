'use client';

import { useQuery } from '@tanstack/react-query';
import { getInventoryPipeline } from '@/mocks/inventory';

export function useInventoryPipeline() {
  return useQuery({
    queryKey: ['inventory', 'pipeline'],
    queryFn: getInventoryPipeline,
  });
}
