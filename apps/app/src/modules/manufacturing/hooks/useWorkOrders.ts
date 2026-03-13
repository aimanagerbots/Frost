'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getWorkOrders } from '@/mocks/manufacturing';
import type { WorkOrder } from '../types';

interface WorkOrderFilters {
  type?: string;
  status?: string;
  priority?: string;
}

export function useWorkOrders(filters?: WorkOrderFilters) {
  return useDemoQuery({
    queryKey: ['manufacturing', 'work-orders', filters],
    demoQueryFn: () => getWorkOrders(filters),
    emptyValue: [] as WorkOrder[],
  });
}
