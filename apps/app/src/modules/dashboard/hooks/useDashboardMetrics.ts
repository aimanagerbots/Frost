'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getDashboardMetrics } from '@/mocks/dashboard';
import type { DashboardMetric } from '@/modules/dashboard/types';

export function useDashboardMetrics() {
  return useDemoQuery({
    queryKey: ['dashboard', 'metrics'],
    demoQueryFn: getDashboardMetrics,
    emptyValue: [] as DashboardMetric[],
  });
}
