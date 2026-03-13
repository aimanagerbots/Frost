'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getPlants } from '@/mocks/cultivation';
import type { Plant } from '../types';

export function usePlants(filters?: { roomId?: string; stage?: string; health?: string; search?: string }) {
  return useDemoQuery({
    queryKey: ['cultivation', 'plants', filters],
    demoQueryFn: () => getPlants(filters),
    emptyValue: [] as Plant[],
  });
}
