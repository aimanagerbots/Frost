'use client';

import { useQuery } from '@tanstack/react-query';
import { getAgentConversation } from '@/mocks/agents';

export function useAgentConversation(agentId?: string) {
  return useQuery({
    queryKey: ['agents', 'conversation', agentId],
    queryFn: () => getAgentConversation(agentId!),
    enabled: !!agentId,
  });
}
