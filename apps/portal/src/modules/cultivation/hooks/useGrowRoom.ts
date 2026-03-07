'use client';

import { useQuery } from '@tanstack/react-query';
import { getGrowRoom } from '@/mocks/cultivation';

export function useGrowRoom(id: string) {
  return useQuery({
    queryKey: ['cultivation', 'grow-room', id],
    queryFn: () => getGrowRoom(id),
    enabled: !!id,
  });
}
