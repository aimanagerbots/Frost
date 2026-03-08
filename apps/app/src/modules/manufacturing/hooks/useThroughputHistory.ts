'use client';

import { useQuery } from '@tanstack/react-query';
import { getThroughputHistory } from '@/mocks/manufacturing';

export function useThroughputHistory() {
  return useQuery({
    queryKey: ['manufacturing', 'throughput-history'],
    queryFn: () => getThroughputHistory(),
  });
}
