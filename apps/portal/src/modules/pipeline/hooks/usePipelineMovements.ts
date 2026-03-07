'use client';

import { useQuery } from '@tanstack/react-query';
import { getPipelineMovements } from '@/mocks/pipeline';

export function usePipelineMovements(months?: number) {
  return useQuery({
    queryKey: ['pipeline', 'movements', months],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 250));
      return getPipelineMovements(months);
    },
  });
}
