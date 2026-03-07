'use client';

import { useQuery } from '@tanstack/react-query';
import { getGrowRooms } from '@/mocks/cultivation';

export function useGrowRooms() {
  return useQuery({
    queryKey: ['cultivation', 'grow-rooms'],
    queryFn: () => getGrowRooms(),
  });
}
