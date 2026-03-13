'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getPipelineStates } from '@/mocks/manufacturing';
import type { PipelineState } from '../types';

export function usePipelineStates(category?: string) {
  return useDemoQuery({
    queryKey: ['manufacturing', 'pipeline-states', category],
    demoQueryFn: () => getPipelineStates(category),
    emptyValue: [] as PipelineState[],
  });
}
