'use client';

import { useQuery } from '@tanstack/react-query';
import { getInventoryAlerts } from '@/mocks/inventory';

export function useInventoryAlerts() {
  return useQuery({ queryKey: ['inventory', 'alerts'], queryFn: getInventoryAlerts });
}
