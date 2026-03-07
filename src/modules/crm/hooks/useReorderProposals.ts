'use client';

import { useQuery } from '@tanstack/react-query';
import { getReorderProposals } from '@/mocks/crm-sales';

export function useReorderProposals(filters?: { status?: string; source?: string }) {
  return useQuery({
    queryKey: ['crm', 'reorder-proposals', filters],
    queryFn: () => getReorderProposals(filters),
  });
}
