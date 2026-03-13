'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getPipelineVelocityMetrics } from '@/mocks/pipeline';
import type { PipelineVelocityMetric } from '../types';

export function usePipelineVelocity() {
  return useDemoQuery({
    queryKey: ['pipeline', 'velocity'],
    demoQueryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return getPipelineVelocityMetrics();
    },
    emptyValue: [] as PipelineVelocityMetric[],
  });
}
