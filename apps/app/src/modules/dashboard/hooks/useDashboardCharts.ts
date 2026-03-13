'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getDashboardCharts } from '@/mocks/dashboard';
import type { DashboardChartsData } from '@/modules/dashboard/types';

export function useDashboardCharts() {
  return useDemoQuery({
    queryKey: ['dashboard', 'charts'],
    demoQueryFn: getDashboardCharts,
    emptyValue: {
      revenueTrend: [],
      ordersByStatus: [],
      divisionWorkload: [],
      topProducts: [],
    } as DashboardChartsData,
  });
}
