'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getDashboardAlerts } from '@/mocks/dashboard';
import type { DashboardAlert } from '@/modules/dashboard/types';

export function useDashboardAlerts() {
  return useDemoQuery({
    queryKey: ['dashboard', 'alerts'],
    demoQueryFn: getDashboardAlerts,
    emptyValue: [] as DashboardAlert[],
  });
}
