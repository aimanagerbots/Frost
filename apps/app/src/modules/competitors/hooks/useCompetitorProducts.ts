'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getCompetitorProducts } from '@/mocks/competitors';
import type { CompetitorProduct } from '@/modules/competitors/types';

export function useCompetitorProducts(competitorId?: string) {
  return useDemoQuery({
    queryKey: ['competitors', 'products', competitorId],
    demoQueryFn: () => getCompetitorProducts(competitorId),
    emptyValue: [] as CompetitorProduct[],
  });
}
