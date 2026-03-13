'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getPipelineMovements } from '@/mocks/pipeline';
import type { PipelineMovement } from '../types';

export function usePipelineMovements(months?: number) {
  return useDemoQuery({
    queryKey: ['pipeline', 'movements', months],
    demoQueryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 250));
      return getPipelineMovements(months);
    },
    emptyValue: [] as PipelineMovement[],
  });
}
