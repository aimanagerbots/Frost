'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getManufacturingBatches } from '@/mocks/manufacturing';
import type { ManufacturingBatch } from '../types';

export function useManufacturingBatches(filters?: { category?: string }) {
  return useDemoQuery({
    queryKey: ['manufacturing', 'batches', filters],
    demoQueryFn: () => getManufacturingBatches(filters),
    emptyValue: [] as ManufacturingBatch[],
  });
}
