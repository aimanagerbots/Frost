'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getCouncilSessions } from '@/mocks/council';
import type { CouncilSession } from '../types';

export function useCouncilSessions() {
  return useDemoQuery({
    queryKey: ['council', 'sessions'],
    demoQueryFn: () => getCouncilSessions(),
    emptyValue: [] as CouncilSession[],
  });
}
