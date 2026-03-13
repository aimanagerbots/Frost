'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getInsights } from '@/mocks/insights';
import type { Insight } from '../types';

export function useInsights(filters?: {
  type?: string;
  severity?: string;
  module?: string;
  actionable?: boolean;
}) {
  return useDemoQuery({
    queryKey: ['insights', 'list', filters],
    demoQueryFn: () => getInsights(filters),
    emptyValue: [] as Insight[],
  });
}
