'use client';

import { useQuery } from '@tanstack/react-query';
import { getMemoryPatterns } from '@/mocks/memory';

export function useMemoryPatterns() {
  return useQuery({
    queryKey: ['memory', 'patterns'],
    queryFn: () => getMemoryPatterns(),
  });
}
