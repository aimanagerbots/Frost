'use client';

import { useQuery } from '@tanstack/react-query';
import { getQASamples } from '@/mocks/cultivation';

export function useQASamples() {
  return useQuery({
    queryKey: ['cultivation', 'qa-samples'],
    queryFn: () => getQASamples(),
  });
}
