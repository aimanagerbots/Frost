'use client';

import { useQuery } from '@tanstack/react-query';
import { getVMIMarketShare } from '@/mocks/vmi';

export function useVMIMarketShare(accountId?: string) {
  return useQuery({
    queryKey: ['vmi', 'market-share', accountId],
    queryFn: () => getVMIMarketShare(accountId),
    enabled: !!accountId,
  });
}
