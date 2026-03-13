'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getThroughputHistory } from '@/mocks/manufacturing';
import type { ThroughputDataPoint } from '../types';

export function useThroughputHistory() {
  return useDemoQuery({
    queryKey: ['manufacturing', 'throughput-history'],
    demoQueryFn: () => getThroughputHistory(),
    emptyValue: [] as ThroughputDataPoint[],
  });
}
