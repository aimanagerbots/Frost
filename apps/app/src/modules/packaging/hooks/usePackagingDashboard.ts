'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getPackagingThroughput } from '@/mocks/packaging';
import type { PackagingThroughputDataPoint } from '../types';

export function usePackagingThroughput() {
  return useDemoQuery({
    queryKey: ['packaging', 'throughput'],
    demoQueryFn: () => getPackagingThroughput(),
    emptyValue: [] as PackagingThroughputDataPoint[],
  });
}
