'use client';

import { useQuery } from '@tanstack/react-query';
import { getPackagingMetrics } from '@/mocks/packaging';

export function usePackagingMetrics() {
  return useQuery({
    queryKey: ['packaging', 'metrics'],
    queryFn: () => getPackagingMetrics(),
  });
}
