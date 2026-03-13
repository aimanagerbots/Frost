'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getCampaigns } from '@/mocks/crm-outreach';
import type { Campaign } from '@/modules/crm/types';

export function useCampaigns() {
  return useDemoQuery({
    queryKey: ['crm', 'campaigns'],
    demoQueryFn: () => getCampaigns(),
    emptyValue: [] as Campaign[],
  });
}
