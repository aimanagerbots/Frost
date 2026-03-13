'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getRevenueByCategory } from '@/mocks/orders';
import type { CategoryRevenue } from '@/modules/orders/types';

export function useRevenueByCategory() {
  return useDemoQuery({
    queryKey: ['orders', 'revenue-by-category'],
    demoQueryFn: getRevenueByCategory,
    emptyValue: [] as CategoryRevenue[],
  });
}
