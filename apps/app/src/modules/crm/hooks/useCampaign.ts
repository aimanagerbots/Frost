'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getCampaign } from '@/mocks/crm-outreach';
import type { CampaignDetail } from '@/modules/crm/types';

export function useCampaign(id: string | null) {
  return useDemoQuery<CampaignDetail | null>({
    queryKey: ['crm', 'campaign', id],
    demoQueryFn: () => getCampaign(id!),
    emptyValue: null,
    enabled: !!id,
  });
}
