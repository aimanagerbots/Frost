'use client';

import { useQuery } from '@tanstack/react-query';
import { getRoomAlerts } from '@/mocks/cultivation';

export function useRoomAlerts(roomId?: string) {
  return useQuery({
    queryKey: ['cultivation', 'alerts', roomId],
    queryFn: () => getRoomAlerts(roomId),
  });
}
