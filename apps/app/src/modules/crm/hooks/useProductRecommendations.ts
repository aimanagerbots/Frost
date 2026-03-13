'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getProductRecommendations } from '@/mocks/crm-intelligence';
import type { ProductRecommendation } from '@/modules/crm/types';

export function useProductRecommendations(accountId?: string) {
  return useDemoQuery({
    queryKey: ['crm', 'product-recommendations', accountId],
    demoQueryFn: () => getProductRecommendations(accountId),
    emptyValue: [] as ProductRecommendation[],
  });
}
