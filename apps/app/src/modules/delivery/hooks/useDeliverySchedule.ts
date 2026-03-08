'use client';

import { useQuery } from '@tanstack/react-query';
import { getDeliverySchedule } from '@/mocks/delivery';

export function useDeliverySchedule() {
  return useQuery({
    queryKey: ['delivery', 'schedule'],
    queryFn: getDeliverySchedule,
  });
}
