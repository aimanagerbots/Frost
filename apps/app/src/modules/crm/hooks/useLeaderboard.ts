'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getLeaderboardData } from '@/mocks/crm-sales';
import type { LeaderboardRep } from '@/modules/crm/types';

export function useLeaderboard(period?: string) {
  return useDemoQuery({
    queryKey: ['crm', 'leaderboard', period],
    demoQueryFn: () => getLeaderboardData(period),
    emptyValue: [] as LeaderboardRep[],
  });
}
