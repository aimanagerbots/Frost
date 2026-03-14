'use client';

import { useQuery } from '@tanstack/react-query';
import { getInteractions } from '@/mocks/crm';
import type { Interaction } from '@/modules/crm/types';
export function useInteractions(accountId?: string) {
  return useQuery({
    queryKey: ['crm', 'interactions', accountId],
    queryFn: async () => {
      return getInteractions(accountId);
    },
  });
}
