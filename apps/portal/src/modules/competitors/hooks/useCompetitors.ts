'use client';

import { useQuery } from '@tanstack/react-query';
import { getCompetitors, getCompetitorMetrics } from '@/mocks/competitors';

export function useCompetitors() {
  return useQuery({
    queryKey: ['competitors', 'list'],
    queryFn: () => getCompetitors(),
  });
}

export function useCompetitorMetrics() {
  return useQuery({
    queryKey: ['competitors', 'metrics'],
    queryFn: () => getCompetitorMetrics(),
  });
}
