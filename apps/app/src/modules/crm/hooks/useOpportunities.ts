'use client';

import { useQuery } from '@tanstack/react-query';
import { getOpportunities } from '@/mocks/crm';
import type { Opportunity } from '@/modules/crm/types';
interface OpportunityFilters {
  accountId?: string;
  stage?: string;
}

export function useOpportunities(filters?: OpportunityFilters) {
  return useQuery({
    queryKey: ['crm', 'opportunities', filters],
    queryFn: async () => {
      return getOpportunities(filters);
    },
  });
}
