'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getRevenueAnalytics } from '@/mocks/crm-intelligence';
import type { RevenueAnalytics } from '@/modules/crm/types';

export function useRevenueAnalytics() {
  return useDemoQuery<RevenueAnalytics>({
    queryKey: ['crm', 'revenue-analytics'],
    demoQueryFn: () => getRevenueAnalytics(),
    emptyValue: {
      period: '',
      totalRevenue: 0,
      revenueByCategory: [],
      revenueByRep: [],
      revenueByRegion: [],
      topProducts: [],
      monthlyRevenue: [],
    },
  });
}
