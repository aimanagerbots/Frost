'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getAgents } from '@/mocks/agents';
import type { Agent } from '@/modules/agents/types';

export function useAgents() {
  return useDemoQuery({
    queryKey: ['agents', 'list'],
    demoQueryFn: () => getAgents(),
    emptyValue: [] as Agent[],
  });
}
