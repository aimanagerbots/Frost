'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getWorkOrder } from '@/mocks/manufacturing';
import type { WorkOrder } from '../types';

export function useWorkOrder(id: string) {
  return useDemoQuery<WorkOrder | undefined>({
    queryKey: ['manufacturing', 'work-order', id],
    demoQueryFn: () => getWorkOrder(id),
    emptyValue: undefined,
    enabled: !!id,
  });
}
