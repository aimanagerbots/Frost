'use client';

import { useQuery } from '@tanstack/react-query';
import { getMovementChartData } from '@/mocks/pipeline';

export function useMovementChartData() {
  return useQuery({
    queryKey: ['pipeline', 'movement-chart'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return getMovementChartData();
    },
  });
}
