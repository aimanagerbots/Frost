'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getTasks } from '@/mocks/tasks';
import type { Task, TaskFilter } from '@/modules/tasks/types';

export function useTasks(filters?: TaskFilter) {
  return useDemoQuery({
    queryKey: ['tasks', 'list', filters],
    demoQueryFn: () => getTasks(filters),
    emptyValue: [] as Task[],
  });
}
