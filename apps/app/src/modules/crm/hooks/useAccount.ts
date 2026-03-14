'use client';

import { useQuery } from '@tanstack/react-query';
import { getAccount } from '@/mocks/crm';
import type { Account } from '@/modules/crm/types';
export function useAccount(id: string) {
  return useQuery({
    queryKey: ['crm', 'account', id],
    queryFn: async () => {
      return getAccount(id);
    },
    enabled: !!id,
  });
}
