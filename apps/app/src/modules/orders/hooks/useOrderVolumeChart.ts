'use client';

import { useQuery } from '@tanstack/react-query';
import { getOrderVolumeChart } from '@/mocks/orders';

export function useOrderVolumeChart() {
  return useQuery({
    queryKey: ['orders', 'volume-chart'],
    queryFn: getOrderVolumeChart,
  });
}
