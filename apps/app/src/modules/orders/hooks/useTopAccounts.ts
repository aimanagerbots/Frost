'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getTopAccounts } from '@/mocks/orders';
import type { TopAccount } from '@/modules/orders/types';

export function useTopAccounts() {
  return useDemoQuery({
    queryKey: ['orders', 'top-accounts'],
    demoQueryFn: getTopAccounts,
    emptyValue: [] as TopAccount[],
  });
}
