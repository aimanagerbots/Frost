'use client';

import { useQuery } from '@tanstack/react-query';
import { getWorkOrder } from '@/mocks/manufacturing';

export function useWorkOrder(id: string) {
  return useQuery({
    queryKey: ['manufacturing', 'work-order', id],
    queryFn: () => getWorkOrder(id),
    enabled: !!id,
  });
}
