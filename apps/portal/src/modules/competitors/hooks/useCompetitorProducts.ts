'use client';

import { useQuery } from '@tanstack/react-query';
import { getCompetitorProducts } from '@/mocks/competitors';

export function useCompetitorProducts(competitorId?: string) {
  return useQuery({
    queryKey: ['competitors', 'products', competitorId],
    queryFn: () => getCompetitorProducts(competitorId),
  });
}
