'use client';

import { useQuery } from '@tanstack/react-query';
import { getCultivationMetrics } from '@/mocks/cultivation';

export function useCultivationMetrics() {
  return useQuery({
    queryKey: ['cultivation', 'metrics'],
    queryFn: () => getCultivationMetrics(),
  });
}
