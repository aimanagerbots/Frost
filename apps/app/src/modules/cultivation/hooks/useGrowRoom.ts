'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getGrowRoom } from '@/mocks/cultivation';
import type { GrowRoom } from '../types';

export function useGrowRoom(id: string) {
  return useDemoQuery<GrowRoom | undefined>({
    queryKey: ['cultivation', 'grow-room', id],
    demoQueryFn: () => getGrowRoom(id),
    emptyValue: undefined,
    enabled: !!id,
  });
}
