'use client';

import { useQuery } from '@tanstack/react-query';
import { getWorkOrders } from '@/mocks/manufacturing';

interface WorkOrderFilters {
  type?: string;
  status?: string;
  priority?: string;
}

export function useWorkOrders(filters?: WorkOrderFilters) {
  return useQuery({
    queryKey: ['manufacturing', 'work-orders', filters],
    queryFn: () => getWorkOrders(filters),
  });
}
