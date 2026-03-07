'use client';

import { useQuery } from '@tanstack/react-query';
import { getVMISellThrough } from '@/mocks/vmi';

export function useVMISellThrough(accountId?: string) {
  return useQuery({
    queryKey: ['vmi', 'sell-through', accountId],
    queryFn: () => getVMISellThrough(accountId),
    enabled: !!accountId,
  });
}
