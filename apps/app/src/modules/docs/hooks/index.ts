'use client';

import { useQuery } from '@tanstack/react-query';
import { getDocuments } from '@/mocks/docs';
import type { DocFilter } from '@/modules/docs/types';

export function useDocuments(filters?: DocFilter) {
  return useQuery({
    queryKey: ['docs', 'list', filters],
    queryFn: () => getDocuments(filters),
  });
}
