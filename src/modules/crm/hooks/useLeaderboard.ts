'use client';

import { useQuery } from '@tanstack/react-query';
import { getLeaderboardData } from '@/mocks/crm-sales';

export function useLeaderboard(period?: string) {
  return useQuery({
    queryKey: ['crm', 'leaderboard', period],
    queryFn: () => getLeaderboardData(period),
  });
}
