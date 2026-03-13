'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getMemoryFacts } from '@/mocks/memory';
import type { MemoryFact } from '../types';

export function useMemoryFacts(filters?: {
  category?: string;
  verifiedOnly?: boolean;
  minConfidence?: number;
  search?: string;
}) {
  return useDemoQuery({
    queryKey: ['memory', 'facts', filters],
    demoQueryFn: () => getMemoryFacts(filters),
    emptyValue: [] as MemoryFact[],
  });
}
