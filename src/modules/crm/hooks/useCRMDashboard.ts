'use client';

import { useQuery } from '@tanstack/react-query';
import { getDashboardData } from '@/mocks/crm';

export function useCRMDashboard() {
  return useQuery({
    queryKey: ['crm', 'dashboard'],
    queryFn: getDashboardData,
  });
}
