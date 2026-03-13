'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getHealthModel } from '@/mocks/crm-intelligence';
import type { AccountHealthModel } from '@/modules/crm/types';

export function useHealthModel() {
  return useDemoQuery<AccountHealthModel>({
    queryKey: ['crm', 'health-model'],
    demoQueryFn: () => getHealthModel(),
    emptyValue: { factors: [], distribution: [], avgScore: 0, avgScoreTrend: [], correlations: [] },
  });
}
