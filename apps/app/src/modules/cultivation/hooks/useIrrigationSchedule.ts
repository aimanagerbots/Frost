'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getIrrigationEvents } from '@/mocks/cultivation';
import type { IrrigationEvent } from '../types';

export function useIrrigationSchedule(roomId: string) {
  return useDemoQuery({
    queryKey: ['cultivation', 'irrigation-events', roomId],
    demoQueryFn: () => getIrrigationEvents(roomId),
    emptyValue: [] as IrrigationEvent[],
    enabled: !!roomId,
  });
}
