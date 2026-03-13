'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getTaskBoard } from '@/mocks/tasks';
import type { TaskBoard } from '@/modules/tasks/types';

export function useTaskBoard() {
  return useDemoQuery({
    queryKey: ['tasks', 'board'],
    demoQueryFn: getTaskBoard,
    emptyValue: { columns: [] } as TaskBoard,
  });
}
