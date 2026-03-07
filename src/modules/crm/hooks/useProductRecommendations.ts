'use client';

import { useQuery } from '@tanstack/react-query';
import { getProductRecommendations } from '@/mocks/crm-intelligence';

export function useProductRecommendations(accountId?: string) {
  return useQuery({
    queryKey: ['crm', 'product-recommendations', accountId],
    queryFn: () => getProductRecommendations(accountId),
  });
}
