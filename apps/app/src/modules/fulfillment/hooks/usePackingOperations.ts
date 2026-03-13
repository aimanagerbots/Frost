'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getPackingOperations } from '@/mocks/fulfillment';
import type { PackingOperation } from '../types';

export function usePackingOperations() {
  return useDemoQuery({
    queryKey: ['fulfillment', 'packing'],
    demoQueryFn: getPackingOperations,
    emptyValue: [] as PackingOperation[],
  });
}
