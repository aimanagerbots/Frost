'use client';

import { useQuery } from '@tanstack/react-query';
import { getInteractions } from '@/mocks/crm';
import type { Interaction } from '@/modules/crm/types';
import { useAuthStore } from '@/modules/auth/store';
import { apiFetch } from '@/lib/api';

export function useInteractions(accountId?: string) {
  const { isDemoMode, session } = useAuthStore();

  return useQuery({
    queryKey: ['crm', 'interactions', accountId],
    queryFn: async () => {
      if (isDemoMode) return getInteractions(accountId);
      const params = new URLSearchParams();
      if (accountId) params.set('account_id', accountId);
      const qs = params.toString();
      const path = '/api/crm/interactions' + (qs ? '?' + qs : '');
      return apiFetch<Interaction[]>(path, {
        token: session?.access_token,
      });
    },
  });
}
