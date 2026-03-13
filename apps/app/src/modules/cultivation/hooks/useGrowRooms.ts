'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getGrowRooms } from '@/mocks/cultivation';
import type { GrowRoom } from '../types';

export function useGrowRooms() {
  return useDemoQuery({
    queryKey: ['cultivation', 'grow-rooms'],
    demoQueryFn: () => getGrowRooms(),
    emptyValue: [] as GrowRoom[],
  });
}
