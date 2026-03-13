'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getProductionLines } from '@/mocks/manufacturing';
import type { ProductionLine } from '../types';

export function useProductionLines() {
  return useDemoQuery({
    queryKey: ['manufacturing', 'production-lines'],
    demoQueryFn: () => getProductionLines(),
    emptyValue: [] as ProductionLine[],
  });
}
