'use client';

import { useQuery } from '@tanstack/react-query';
import { getCultivationTasks } from '@/mocks/cultivation';

export function useCultivationTasks(roomId?: string) {
  return useQuery({
    queryKey: ['cultivation', 'tasks', roomId],
    queryFn: () => getCultivationTasks(roomId),
  });
}
