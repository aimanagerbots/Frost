'use client';

import { useQuery } from '@tanstack/react-query';
import { getDashboardMetrics } from '@/mocks/dashboard';

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['dashboard', 'metrics'],
    queryFn: getDashboardMetrics,
  });
}
