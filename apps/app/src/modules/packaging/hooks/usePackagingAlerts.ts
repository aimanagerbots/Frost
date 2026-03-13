'use client';

import { useQuery } from '@tanstack/react-query';
import { getPackagingAlerts } from '@/mocks/packaging';

export function usePackagingAlerts() {
  return useQuery({
    queryKey: ['packaging', 'alerts'],
    queryFn: () => getPackagingAlerts(),
  });
}
