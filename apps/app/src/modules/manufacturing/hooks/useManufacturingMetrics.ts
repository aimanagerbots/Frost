'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getManufacturingMetrics } from '@/mocks/manufacturing';
import type { ManufacturingMetrics } from '../types';

export function useManufacturingMetrics() {
  return useDemoQuery<ManufacturingMetrics>({
    queryKey: ['manufacturing', 'metrics'],
    demoQueryFn: () => getManufacturingMetrics(),
    emptyValue: {
      totalWorkOrders: 0,
      completedToday: 0,
      inProgress: 0,
      avgCompletionTime: 0,
      throughputRate: 0,
      bottleneckState: '',
      capacityUtilization: 0,
    },
  });
}
