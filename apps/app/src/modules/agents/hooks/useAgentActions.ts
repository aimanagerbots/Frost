'use client';

import { useQuery } from '@tanstack/react-query';
import { getAgentActions } from '@/mocks/agents';

export function useAgentActions(agentId?: string) {
  return useQuery({
    queryKey: ['agents', 'actions', agentId],
    queryFn: () => getAgentActions(agentId),
  });
}
