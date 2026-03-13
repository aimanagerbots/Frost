'use client';

import { useQuery } from '@tanstack/react-query';
import { getPackagingThroughput } from '@/mocks/packaging';

export function usePackagingThroughput() {
  return useQuery({
    queryKey: ['packaging', 'throughput'],
    queryFn: () => getPackagingThroughput(),
  });
}
