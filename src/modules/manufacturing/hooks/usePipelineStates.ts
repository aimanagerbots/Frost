'use client';

import { useQuery } from '@tanstack/react-query';
import { getPipelineStates } from '@/mocks/manufacturing';

export function usePipelineStates(category?: string) {
  return useQuery({
    queryKey: ['manufacturing', 'pipeline-states', category],
    queryFn: () => getPipelineStates(category),
  });
}
