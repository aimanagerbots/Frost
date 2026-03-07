'use client';

import { useQuery } from '@tanstack/react-query';
import { getMemoryLayers } from '@/mocks/memory';

export function useMemoryLayers() {
  return useQuery({
    queryKey: ['memory', 'layers'],
    queryFn: () => getMemoryLayers(),
  });
}
