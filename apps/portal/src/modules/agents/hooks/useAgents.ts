'use client';

import { useQuery } from '@tanstack/react-query';
import { getAgents } from '@/mocks/agents';

export function useAgents() {
  return useQuery({
    queryKey: ['agents', 'list'],
    queryFn: () => getAgents(),
  });
}
