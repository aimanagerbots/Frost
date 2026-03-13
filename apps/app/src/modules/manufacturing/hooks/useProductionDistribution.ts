'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getProductionDistribution } from '@/mocks/manufacturing';
import type { ProductionDistribution } from '../types';

export function useProductionDistribution() {
  return useDemoQuery({
    queryKey: ['manufacturing', 'production-distribution'],
    demoQueryFn: () => getProductionDistribution(),
    emptyValue: [] as ProductionDistribution[],
  });
}
