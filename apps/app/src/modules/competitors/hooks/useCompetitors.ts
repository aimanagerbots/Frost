'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getCompetitors, getCompetitorMetrics } from '@/mocks/competitors';
import type { Competitor, CompetitorMetrics } from '@/modules/competitors/types';

export function useCompetitors() {
  return useDemoQuery({
    queryKey: ['competitors', 'list'],
    demoQueryFn: () => getCompetitors(),
    emptyValue: [] as Competitor[],
  });
}

export function useCompetitorMetrics() {
  return useDemoQuery({
    queryKey: ['competitors', 'metrics'],
    demoQueryFn: () => getCompetitorMetrics(),
    emptyValue: {
      competitorsTracked: 0,
      ourMarketShare: 0,
      topThreat: '',
      recentAlerts: 0,
      avgPriceAdvantage: 0,
      placementsLostThisMonth: 0,
    } as CompetitorMetrics,
  });
}
