'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getVMISellThrough } from '@/mocks/vmi';
import type { VMISellThrough } from '@/modules/vmi/types';

export function useVMISellThrough(accountId?: string) {
  return useDemoQuery({
    queryKey: ['vmi', 'sell-through', accountId],
    demoQueryFn: () => getVMISellThrough(accountId),
    emptyValue: [] as VMISellThrough[],
    enabled: !!accountId,
  });
}
