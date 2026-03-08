'use client';

import { useQuery } from '@tanstack/react-query';
import { getOpportunities } from '@/mocks/crm';

interface OpportunityFilters {
  accountId?: string;
  stage?: string;
}

export function useOpportunities(filters?: OpportunityFilters) {
  return useQuery({
    queryKey: ['crm', 'opportunities', filters],
    queryFn: () => getOpportunities(filters),
  });
}
