'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getPackagingMetrics } from '@/mocks/packaging';
import type { PackagingMetrics } from '../types';

export function usePackagingMetrics() {
  return useDemoQuery<PackagingMetrics>({
    queryKey: ['packaging', 'metrics'],
    demoQueryFn: () => getPackagingMetrics(),
    emptyValue: {
      totalOrders: 0,
      completedToday: 0,
      inProgress: 0,
      materialShortages: 0,
      avgPackagesPerHour: 0,
      topSKU: '',
    },
  });
}
