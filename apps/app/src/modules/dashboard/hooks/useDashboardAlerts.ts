'use client';

import { useQuery } from '@tanstack/react-query';
import { getDashboardAlerts } from '@/mocks/dashboard';

export function useDashboardAlerts() {
  return useQuery({
    queryKey: ['dashboard', 'alerts'],
    queryFn: getDashboardAlerts,
  });
}
