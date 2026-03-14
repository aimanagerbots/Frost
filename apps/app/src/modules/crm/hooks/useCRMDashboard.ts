'use client';

import { useQuery } from '@tanstack/react-query';
import { getDashboardData } from '@/mocks/crm';
import type { CRMDashboardData } from '@/modules/crm/types';
export function useCRMDashboard() {
  return useQuery({
    queryKey: ['crm', 'dashboard'],
    queryFn: async () => {
      return getDashboardData();
    },
  });
}
