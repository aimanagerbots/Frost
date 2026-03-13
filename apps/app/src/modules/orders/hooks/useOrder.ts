'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getOrder } from '@/mocks/orders';
import type { Order } from '@/modules/orders/types';

export function useOrder(id: string | null) {
  return useDemoQuery({
    queryKey: ['orders', 'detail', id],
    demoQueryFn: () => getOrder(id!),
    emptyValue: undefined as Order | undefined,
    enabled: !!id,
  });
}
