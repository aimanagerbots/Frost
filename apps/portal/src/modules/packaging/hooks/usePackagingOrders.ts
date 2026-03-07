'use client';

import { useQuery } from '@tanstack/react-query';
import { getPackagingOrders } from '@/mocks/packaging';

interface PackagingOrderFilters {
  status?: string;
  category?: string;
  priority?: string;
}

export function usePackagingOrders(filters?: PackagingOrderFilters) {
  return useQuery({
    queryKey: ['packaging', 'orders', filters],
    queryFn: () => getPackagingOrders(filters),
  });
}
