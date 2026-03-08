'use client';

import { useQuery } from '@tanstack/react-query';
import { getMeetings, getMeetingMetrics } from '@/mocks/meetings';
import type { MeetingFilter } from '@/modules/meetings/types';

export function useMeetings(filters?: MeetingFilter) {
  return useQuery({
    queryKey: ['meetings', 'list', filters],
    queryFn: () => getMeetings(filters),
  });
}

export function useMeetingMetrics() {
  return useQuery({
    queryKey: ['meetings', 'metrics'],
    queryFn: () => getMeetingMetrics(),
  });
}
