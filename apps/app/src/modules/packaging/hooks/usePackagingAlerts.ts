'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getPackagingAlerts } from '@/mocks/packaging';
import type { PackagingAlert } from '../types';

export function usePackagingAlerts() {
  return useDemoQuery({
    queryKey: ['packaging', 'alerts'],
    demoQueryFn: () => getPackagingAlerts(),
    emptyValue: [] as PackagingAlert[],
  });
}
