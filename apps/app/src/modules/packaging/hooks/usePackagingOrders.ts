'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getPackagingOrders } from '@/mocks/packaging';
import type { PackagingOrder } from '../types';

interface PackagingOrderFilters {
  status?: string;
  category?: string;
  priority?: string;
}

export function usePackagingOrders(filters?: PackagingOrderFilters) {
  return useDemoQuery({
    queryKey: ['packaging', 'orders', filters],
    demoQueryFn: () => getPackagingOrders(filters),
    emptyValue: [] as PackagingOrder[],
  });
}
