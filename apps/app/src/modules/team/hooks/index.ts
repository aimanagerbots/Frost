'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getTeamMembers, getTeamMetrics } from '@/mocks/team';
import type { TeamFilter, TeamMember } from '@/modules/team/types';

export function useTeamMembers(filters?: TeamFilter) {
  return useDemoQuery({
    queryKey: ['team', 'members', filters],
    demoQueryFn: () => getTeamMembers(filters),
    emptyValue: [] as TeamMember[],
  });
}

export function useTeamMetrics() {
  return useDemoQuery({
    queryKey: ['team', 'metrics'],
    demoQueryFn: () => getTeamMetrics(),
    emptyValue: { total: 0, active: 0, divisions: 0, onLeave: 0 },
  });
}

export { useTeamDashboard } from './useTeamDashboard';
