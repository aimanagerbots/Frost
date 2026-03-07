'use client';

import { useQuery } from '@tanstack/react-query';
import { getManufacturingMetrics } from '@/mocks/manufacturing';

export function useManufacturingMetrics() {
  return useQuery({
    queryKey: ['manufacturing', 'metrics'],
    queryFn: () => getManufacturingMetrics(),
  });
}
