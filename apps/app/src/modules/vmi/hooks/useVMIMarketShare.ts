'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getVMIMarketShare } from '@/mocks/vmi';
import type { VMIMarketShare } from '@/modules/vmi/types';

export function useVMIMarketShare(accountId?: string) {
  return useDemoQuery({
    queryKey: ['vmi', 'market-share', accountId],
    demoQueryFn: () => getVMIMarketShare(accountId),
    emptyValue: [] as VMIMarketShare[],
    enabled: !!accountId,
  });
}
