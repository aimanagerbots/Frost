'use client';

import { useQuery } from '@tanstack/react-query';
import { getProductionDistribution } from '@/mocks/manufacturing';

export function useProductionDistribution() {
  return useQuery({
    queryKey: ['manufacturing', 'production-distribution'],
    queryFn: () => getProductionDistribution(),
  });
}
