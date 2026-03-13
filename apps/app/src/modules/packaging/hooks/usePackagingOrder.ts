'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getPackagingOrder } from '@/mocks/packaging';
import type { PackagingOrder } from '../types';

export function usePackagingOrder(id: string) {
  return useDemoQuery<PackagingOrder | undefined>({
    queryKey: ['packaging', 'order', id],
    demoQueryFn: () => getPackagingOrder(id),
    emptyValue: undefined,
    enabled: !!id,
  });
}
