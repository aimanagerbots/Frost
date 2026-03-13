'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getOrderVolumeChart } from '@/mocks/orders';
import type { OrderVolumeWeek } from '@/modules/orders/types';

export function useOrderVolumeChart() {
  return useDemoQuery({
    queryKey: ['orders', 'volume-chart'],
    demoQueryFn: getOrderVolumeChart,
    emptyValue: [] as OrderVolumeWeek[],
  });
}
