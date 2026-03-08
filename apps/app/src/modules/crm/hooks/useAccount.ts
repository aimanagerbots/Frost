'use client';

import { useQuery } from '@tanstack/react-query';
import { getAccount } from '@/mocks/crm';

export function useAccount(id: string) {
  return useQuery({
    queryKey: ['crm', 'account', id],
    queryFn: () => getAccount(id),
    enabled: !!id,
  });
}
