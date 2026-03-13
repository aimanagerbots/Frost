'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getAgentActions } from '@/mocks/agents';
import type { AgentAction } from '@/modules/agents/types';

export function useAgentActions(agentId?: string) {
  return useDemoQuery({
    queryKey: ['agents', 'actions', agentId],
    demoQueryFn: () => getAgentActions(agentId),
    emptyValue: [] as AgentAction[],
  });
}
