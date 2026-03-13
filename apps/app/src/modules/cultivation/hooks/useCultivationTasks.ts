'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getCultivationTasks } from '@/mocks/cultivation';
import type { CultivationTask } from '../types';

export function useCultivationTasks(roomId?: string) {
  return useDemoQuery({
    queryKey: ['cultivation', 'tasks', roomId],
    demoQueryFn: () => getCultivationTasks(roomId),
    emptyValue: [] as CultivationTask[],
  });
}
