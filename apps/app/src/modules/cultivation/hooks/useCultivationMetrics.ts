'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getCultivationMetrics } from '@/mocks/cultivation';
import type { CultivationMetrics } from '../types';

export function useCultivationMetrics() {
  return useDemoQuery<CultivationMetrics>({
    queryKey: ['cultivation', 'metrics'],
    demoQueryFn: () => getCultivationMetrics(),
    emptyValue: {
      activeRooms: 0,
      totalPlants: 0,
      nextHarvest: '',
      nextHarvestStrain: '',
      daysToNextHarvest: 0,
      avgYieldPerPlant: 0,
      environmentAlerts: 0,
      plantsInFlower: 0,
      plantsInVeg: 0,
      geneticsCount: 0,
      tasksToday: 0,
    },
  });
}
