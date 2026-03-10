'use client';

import { useQuery } from '@tanstack/react-query';
import type { PortalRewardsData } from '../types';
import { getRewardsForAccount } from '../mock-data';

export function usePortalRewards(accountId: string) {
  return useQuery<PortalRewardsData>({
    queryKey: ['portal', 'rewards', accountId],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return getRewardsForAccount(accountId);
    },
    enabled: !!accountId,
  });
}
