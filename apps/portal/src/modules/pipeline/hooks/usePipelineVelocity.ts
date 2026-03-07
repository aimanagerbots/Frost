'use client';

import { useQuery } from '@tanstack/react-query';
import { getPipelineVelocityMetrics } from '@/mocks/pipeline';

export function usePipelineVelocity() {
  return useQuery({
    queryKey: ['pipeline', 'velocity'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return getPipelineVelocityMetrics();
    },
  });
}
