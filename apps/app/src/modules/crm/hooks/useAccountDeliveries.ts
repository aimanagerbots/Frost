'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getAccountDeliveries } from '@/mocks/crm-details';
import type { AccountDeliverySummary } from '@/modules/crm/types';

export function useAccountDeliveries(id: string) {
  return useDemoQuery<AccountDeliverySummary>({
    queryKey: ['crm', 'account-deliveries', id],
    demoQueryFn: () => getAccountDeliveries(id),
    emptyValue: { preferredWindow: '', avgDeliveryMinutes: 0, onTimeRate: 0, deliveries: [] },
    enabled: !!id,
  });
}
