'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getMovementChartData } from '@/mocks/pipeline';
import type { MovementChartData } from '../types';

export function useMovementChartData() {
  return useDemoQuery({
    queryKey: ['pipeline', 'movement-chart'],
    demoQueryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return getMovementChartData();
    },
    emptyValue: [] as MovementChartData[],
  });
}
