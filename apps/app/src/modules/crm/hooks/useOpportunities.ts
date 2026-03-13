'use client';

import { useQuery } from '@tanstack/react-query';
import { getOpportunities } from '@/mocks/crm';
import type { Opportunity } from '@/modules/crm/types';
import { useAuthStore } from '@/modules/auth/store';
import { apiFetch } from '@/lib/api';

interface OpportunityFilters {
  accountId?: string;
  stage?: string;
}

export function useOpportunities(filters?: OpportunityFilters) {
  const { isDemoMode, session } = useAuthStore();

  return useQuery({
    queryKey: ['crm', 'opportunities', filters],
    queryFn: async () => {
      if (isDemoMode) return getOpportunities(filters);
      const params = new URLSearchParams();
      if (filters?.stage) params.set('stage', filters.stage);
      if (filters?.accountId) params.set('account_id', filters.accountId);
      const qs = params.toString();
      const path = '/api/crm/opportunities' + (qs ? '?' + qs : '');
      return apiFetch<Opportunity[]>(path, {
        token: session?.access_token,
      });
    },
  });
}
