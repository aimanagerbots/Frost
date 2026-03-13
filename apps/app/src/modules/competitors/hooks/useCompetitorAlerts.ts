'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getCompetitorAlerts } from '@/mocks/competitors';
import type { CompetitorAlert } from '@/modules/competitors/types';

export function useCompetitorAlerts() {
  return useDemoQuery({
    queryKey: ['competitors', 'alerts'],
    demoQueryFn: () => getCompetitorAlerts(),
    emptyValue: [] as CompetitorAlert[],
  });
}
