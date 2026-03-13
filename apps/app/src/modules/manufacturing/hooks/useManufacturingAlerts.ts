'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getManufacturingAlerts } from '@/mocks/manufacturing';
import type { ManufacturingAlert } from '../types';

export function useManufacturingAlerts() {
  return useDemoQuery({
    queryKey: ['manufacturing', 'alerts'],
    demoQueryFn: () => getManufacturingAlerts(),
    emptyValue: [] as ManufacturingAlert[],
  });
}
