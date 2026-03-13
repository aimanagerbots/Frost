'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getKnowledgeEntries } from '@/mocks/council';
import type { KnowledgeEntry } from '../types';

export function useKnowledgeBase(category?: string) {
  return useDemoQuery({
    queryKey: ['council', 'knowledge', category ?? 'all'],
    demoQueryFn: () => getKnowledgeEntries(category),
    emptyValue: [] as KnowledgeEntry[],
  });
}
