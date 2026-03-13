'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getRepPipelineStats } from '@/mocks/pipeline';
import type { RepPipelineStats } from '../types';

export function useRepPipelinePerformance(repId?: string) {
  return useDemoQuery({
    queryKey: ['pipeline', 'rep-performance', repId],
    demoQueryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 250));
      return getRepPipelineStats(repId);
    },
    emptyValue: [] as RepPipelineStats[],
  });
}
