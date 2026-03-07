'use client';

import { useQuery } from '@tanstack/react-query';
import { getTeamMembers, getTeamMetrics } from '@/mocks/team';
import type { TeamFilter } from '@/modules/team/types';

export function useTeamMembers(filters?: TeamFilter) {
  return useQuery({
    queryKey: ['team', 'members', filters],
    queryFn: () => getTeamMembers(filters),
  });
}

export function useTeamMetrics() {
  return useQuery({
    queryKey: ['team', 'metrics'],
    queryFn: () => getTeamMetrics(),
  });
}
