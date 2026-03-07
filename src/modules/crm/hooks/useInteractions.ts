'use client';

import { useQuery } from '@tanstack/react-query';
import { getInteractions } from '@/mocks/crm';

export function useInteractions(accountId?: string) {
  return useQuery({
    queryKey: ['crm', 'interactions', accountId],
    queryFn: () => getInteractions(accountId),
  });
}
