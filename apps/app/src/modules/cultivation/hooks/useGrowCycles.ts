'use client';

import { useQuery } from '@tanstack/react-query';
import { getGrowCycles } from '@/mocks/cultivation';

export function useGrowCycles() {
  return useQuery({
    queryKey: ['cultivation', 'grow-cycles'],
    queryFn: () => getGrowCycles(),
  });
}
