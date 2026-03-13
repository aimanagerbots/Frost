'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getAccountHealth } from '@/mocks/crm-details';
import type { AccountHealthData } from '@/modules/crm/types';

export function useAccountHealth(id: string) {
  return useDemoQuery<AccountHealthData>({
    queryKey: ['crm', 'account-health', id],
    demoQueryFn: () => getAccountHealth(id),
    emptyValue: { score: 0, trend: 'stable', factors: [], recommendations: [], history: [] },
    enabled: !!id,
  });
}
