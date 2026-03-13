'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getDeliverySchedule } from '@/mocks/delivery';
import type { ScheduleEntry } from '../types';

export function useDeliverySchedule() {
  return useDemoQuery({
    queryKey: ['delivery', 'schedule'],
    demoQueryFn: getDeliverySchedule,
    emptyValue: [] as ScheduleEntry[],
  });
}
