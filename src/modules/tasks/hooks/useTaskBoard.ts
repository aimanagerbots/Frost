'use client';

import { useQuery } from '@tanstack/react-query';
import { getTaskBoard } from '@/mocks/tasks';

export function useTaskBoard() {
  return useQuery({
    queryKey: ['tasks', 'board'],
    queryFn: getTaskBoard,
  });
}
