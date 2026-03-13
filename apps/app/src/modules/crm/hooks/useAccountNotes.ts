'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getAccountNotes } from '@/mocks/crm-details';
import type { AccountNote } from '@/modules/crm/types';

export function useAccountNotes(id: string) {
  return useDemoQuery({
    queryKey: ['crm', 'account-notes', id],
    demoQueryFn: () => getAccountNotes(id),
    emptyValue: [] as AccountNote[],
    enabled: !!id,
  });
}
