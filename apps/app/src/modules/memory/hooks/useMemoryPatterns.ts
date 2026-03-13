'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getMemoryPatterns } from '@/mocks/memory';
import type { MemoryPattern } from '../types';

export function useMemoryPatterns() {
  return useDemoQuery({
    queryKey: ['memory', 'patterns'],
    demoQueryFn: () => getMemoryPatterns(),
    emptyValue: [] as MemoryPattern[],
  });
}
