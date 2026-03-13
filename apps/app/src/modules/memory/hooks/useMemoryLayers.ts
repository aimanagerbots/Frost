'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getMemoryLayers } from '@/mocks/memory';
import type { MemoryLayer } from '../types';

export function useMemoryLayers() {
  return useDemoQuery({
    queryKey: ['memory', 'layers'],
    demoQueryFn: () => getMemoryLayers(),
    emptyValue: [] as MemoryLayer[],
  });
}
