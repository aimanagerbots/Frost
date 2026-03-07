'use client';

import { useQuery } from '@tanstack/react-query';
import { getRepPipelineStats } from '@/mocks/pipeline';

export function useRepPipelinePerformance(repId?: string) {
  return useQuery({
    queryKey: ['pipeline', 'rep-performance', repId],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 250));
      return getRepPipelineStats(repId);
    },
  });
}
