'use client';

import { useQuery } from '@tanstack/react-query';
import { getMemoryFacts } from '@/mocks/memory';

export function useMemoryFacts(filters?: {
  category?: string;
  verifiedOnly?: boolean;
  minConfidence?: number;
  search?: string;
}) {
  return useQuery({
    queryKey: ['memory', 'facts', filters],
    queryFn: () => getMemoryFacts(filters),
  });
}
