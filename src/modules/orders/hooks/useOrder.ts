'use client';

import { useQuery } from '@tanstack/react-query';
import { getOrder } from '@/mocks/orders';

export function useOrder(id: string | null) {
  return useQuery({
    queryKey: ['orders', 'detail', id],
    queryFn: () => getOrder(id!),
    enabled: !!id,
  });
}
