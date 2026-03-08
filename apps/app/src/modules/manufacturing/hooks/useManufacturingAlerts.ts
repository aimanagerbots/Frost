'use client';

import { useQuery } from '@tanstack/react-query';
import { getManufacturingAlerts } from '@/mocks/manufacturing';

export function useManufacturingAlerts() {
  return useQuery({
    queryKey: ['manufacturing', 'alerts'],
    queryFn: () => getManufacturingAlerts(),
  });
}
