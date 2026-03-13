'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getAccountPayments } from '@/mocks/crm-details';
import type { AccountPaymentSummary } from '@/modules/crm/types';

export function useAccountPayments(id: string) {
  return useDemoQuery<AccountPaymentSummary>({
    queryKey: ['crm', 'account-payments', id],
    demoQueryFn: () => getAccountPayments(id),
    emptyValue: { outstanding: 0, reliability: 0, avgDaysToPay: 0, payments: [] },
    enabled: !!id,
  });
}
