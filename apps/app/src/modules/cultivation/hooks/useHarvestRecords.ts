'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getHarvestRecords } from '@/mocks/cultivation';
import type { HarvestRecord } from '../types';

export function useHarvestRecords() {
  return useDemoQuery({
    queryKey: ['cultivation', 'harvests'],
    demoQueryFn: () => getHarvestRecords(),
    emptyValue: [] as HarvestRecord[],
  });
}
