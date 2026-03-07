'use client';

import { useQuery } from '@tanstack/react-query';
import { getTasks } from '@/mocks/tasks';
import type { TaskFilter } from '@/modules/tasks/types';

export function useTasks(filters?: TaskFilter) {
  return useQuery({
    queryKey: ['tasks', 'list', filters],
    queryFn: () => getTasks(filters),
  });
}
