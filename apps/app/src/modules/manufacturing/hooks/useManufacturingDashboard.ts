'use client';

import { useQuery } from '@tanstack/react-query';
import { getManufacturingMetrics } from '@/mocks/manufacturing';

export function useManufacturingDashboard() {
  return useQuery({
    queryKey: ['manufacturing', 'dashboard'],
    queryFn: () => getManufacturingMetrics(),
  });
}
