'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getAccountOrders } from '@/mocks/crm-details';
import type { AccountOrder } from '@/modules/crm/types';

export function useAccountOrders(id: string) {
  return useDemoQuery({
    queryKey: ['crm', 'account-orders', id],
    demoQueryFn: () => getAccountOrders(id),
    emptyValue: [] as AccountOrder[],
    enabled: !!id,
  });
}
