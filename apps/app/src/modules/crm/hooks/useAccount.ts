'use client';

import { useQuery } from '@tanstack/react-query';
import { getAccount } from '@/mocks/crm';
import type { Account } from '@/modules/crm/types';
import { useAuthStore } from '@/modules/auth/store';
import { apiFetch } from '@/lib/api';

export function useAccount(id: string) {
  const { isDemoMode, session } = useAuthStore();

  return useQuery({
    queryKey: ['crm', 'account', id],
    queryFn: async () => {
      if (isDemoMode) return getAccount(id);
      return apiFetch<Account>(`/api/crm/accounts/${id}`, {
        token: session?.access_token,
      });
    },
    enabled: !!id,
  });
}
