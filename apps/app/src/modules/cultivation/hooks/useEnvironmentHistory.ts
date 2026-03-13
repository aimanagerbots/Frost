'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getEnvironmentHistory } from '@/mocks/cultivation';
import type { EnvironmentReading } from '../types';

export function useEnvironmentHistory(roomId: string) {
  return useDemoQuery({
    queryKey: ['cultivation', 'environment-history', roomId],
    demoQueryFn: () => getEnvironmentHistory(roomId),
    emptyValue: [] as EnvironmentReading[],
    enabled: !!roomId,
  });
}
