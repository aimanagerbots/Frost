'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getGrowSupplies } from '@/mocks/cultivation';
import type { GrowSupply } from '../types';

export function useGrowSupplies(filters?: { category?: string; status?: string }) {
  return useDemoQuery({
    queryKey: ['cultivation', 'supplies', filters],
    demoQueryFn: () => getGrowSupplies(filters),
    emptyValue: [] as GrowSupply[],
  });
}
