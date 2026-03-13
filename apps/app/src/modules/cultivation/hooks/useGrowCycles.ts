'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getGrowCycles } from '@/mocks/cultivation';
import type { GrowCycle } from '../types';

export function useGrowCycles() {
  return useDemoQuery({
    queryKey: ['cultivation', 'grow-cycles'],
    demoQueryFn: () => getGrowCycles(),
    emptyValue: [] as GrowCycle[],
  });
}
