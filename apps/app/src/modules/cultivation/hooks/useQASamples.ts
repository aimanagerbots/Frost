'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getQASamples } from '@/mocks/cultivation';
import type { QASample } from '../types';

export function useQASamples() {
  return useDemoQuery({
    queryKey: ['cultivation', 'qa-samples'],
    demoQueryFn: () => getQASamples(),
    emptyValue: [] as QASample[],
  });
}
