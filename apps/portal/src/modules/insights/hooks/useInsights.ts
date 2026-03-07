'use client';

import { useQuery } from '@tanstack/react-query';
import { getInsights } from '@/mocks/insights';

export function useInsights(filters?: {
  type?: string;
  severity?: string;
  module?: string;
  actionable?: boolean;
}) {
  return useQuery({
    queryKey: ['insights', 'list', filters],
    queryFn: () => getInsights(filters),
  });
}
