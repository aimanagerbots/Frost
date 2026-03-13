'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getMeetings, getMeetingMetrics } from '@/mocks/meetings';
import type { MeetingFilter, Meeting } from '@/modules/meetings/types';

export function useMeetings(filters?: MeetingFilter) {
  return useDemoQuery({
    queryKey: ['meetings', 'list', filters],
    demoQueryFn: () => getMeetings(filters),
    emptyValue: [] as Meeting[],
  });
}

export function useMeetingMetrics() {
  return useDemoQuery({
    queryKey: ['meetings', 'metrics'],
    demoQueryFn: () => getMeetingMetrics(),
    emptyValue: { thisWeek: 0, upcomingToday: 0, actionItemsOpen: 0, completedThisMonth: 0 },
  });
}
