'use client';

import { useQuery } from '@tanstack/react-query';
import { getCouncilSessions } from '@/mocks/council';

export function useCouncilSessions() {
  return useQuery({
    queryKey: ['council', 'sessions'],
    queryFn: () => getCouncilSessions(),
  });
}
