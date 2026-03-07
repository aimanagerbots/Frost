'use client';

import { useQuery } from '@tanstack/react-query';
import { getAccountNotes } from '@/mocks/crm-details';

export function useAccountNotes(id: string) {
  return useQuery({
    queryKey: ['crm', 'account-notes', id],
    queryFn: () => getAccountNotes(id),
    enabled: !!id,
  });
}
