'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getAgentConversation } from '@/mocks/agents';
import type { AgentConversation } from '@/modules/agents/types';

export function useAgentConversation(agentId?: string) {
  return useDemoQuery({
    queryKey: ['agents', 'conversation', agentId],
    demoQueryFn: () => getAgentConversation(agentId!),
    emptyValue: null as AgentConversation | null,
    enabled: !!agentId,
  });
}
