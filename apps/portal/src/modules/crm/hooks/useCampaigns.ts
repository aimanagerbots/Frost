'use client';

import { useQuery } from '@tanstack/react-query';
import { getCampaigns } from '@/mocks/crm-outreach';

export function useCampaigns() {
  return useQuery({
    queryKey: ['crm', 'campaigns'],
    queryFn: () => getCampaigns(),
  });
}
