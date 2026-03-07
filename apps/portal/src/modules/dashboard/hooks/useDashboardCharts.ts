'use client';

import { useQuery } from '@tanstack/react-query';
import { getDashboardCharts } from '@/mocks/dashboard';

export function useDashboardCharts() {
  return useQuery({
    queryKey: ['dashboard', 'charts'],
    queryFn: getDashboardCharts,
  });
}
