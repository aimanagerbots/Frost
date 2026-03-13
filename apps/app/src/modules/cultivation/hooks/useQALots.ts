'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getQALots } from '@/mocks/cultivation';
import type { QALot } from '../types';

export function useQALots() {
  return useDemoQuery({
    queryKey: ['cultivation', 'qa-lots'],
    demoQueryFn: () => getQALots(),
    emptyValue: [] as QALot[],
  });
}
