'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getRoomAlerts } from '@/mocks/cultivation';
import type { RoomAlert } from '../types';

export function useRoomAlerts(roomId?: string) {
  return useDemoQuery({
    queryKey: ['cultivation', 'alerts', roomId],
    demoQueryFn: () => getRoomAlerts(roomId),
    emptyValue: [] as RoomAlert[],
  });
}
