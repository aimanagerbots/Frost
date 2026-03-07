'use client';

import { useQuery } from '@tanstack/react-query';
import { getCampaign } from '@/mocks/crm-outreach';

export function useCampaign(id: string | null) {
  return useQuery({
    queryKey: ['crm', 'campaign', id],
    queryFn: () => getCampaign(id!),
    enabled: !!id,
  });
}
