'use client';

import { useQuery } from '@tanstack/react-query';
import { getKnowledgeEntries } from '@/mocks/council';

export function useKnowledgeBase(category?: string) {
  return useQuery({
    queryKey: ['council', 'knowledge', category ?? 'all'],
    queryFn: () => getKnowledgeEntries(category),
  });
}
