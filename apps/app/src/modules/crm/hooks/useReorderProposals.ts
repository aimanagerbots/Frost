'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getReorderProposals } from '@/mocks/crm-sales';
import type { ReorderProposal } from '@/modules/crm/types';

export function useReorderProposals(filters?: { status?: string; source?: string }) {
  return useDemoQuery({
    queryKey: ['crm', 'reorder-proposals', filters],
    demoQueryFn: () => getReorderProposals(filters),
    emptyValue: [] as ReorderProposal[],
  });
}
