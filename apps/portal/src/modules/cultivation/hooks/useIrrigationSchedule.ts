'use client';

import { useQuery } from '@tanstack/react-query';
import { getIrrigationEvents } from '@/mocks/cultivation';

export function useIrrigationSchedule(roomId: string) {
  return useQuery({
    queryKey: ['cultivation', 'irrigation-events', roomId],
    queryFn: () => getIrrigationEvents(roomId),
    enabled: !!roomId,
  });
}
