'use client';

import { useQuery } from '@tanstack/react-query';
import { getPackagingOrder } from '@/mocks/packaging';

export function usePackagingOrder(id: string) {
  return useQuery({
    queryKey: ['packaging', 'order', id],
    queryFn: () => getPackagingOrder(id),
    enabled: !!id,
  });
}
