'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getDocuments } from '@/mocks/docs';
import type { DocFilter, Document } from '@/modules/docs/types';

export function useDocuments(filters?: DocFilter) {
  return useDemoQuery({
    queryKey: ['docs', 'list', filters],
    demoQueryFn: () => getDocuments(filters),
    emptyValue: [] as Document[],
  });
}
