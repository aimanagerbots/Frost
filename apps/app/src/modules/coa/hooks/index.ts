'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getCOASubmissions, getCOASubmission, getCOAMetrics } from '@/mocks/coa';
import type { COASubmission, COAMetrics, COAStatus } from '../types';

interface COAFilters {
  status?: COAStatus;
  search?: string;
}

export function useCOASubmissions(filters?: COAFilters) {
  return useDemoQuery({
    queryKey: ['coa', 'submissions', filters],
    demoQueryFn: () => getCOASubmissions(filters),
    emptyValue: [] as COASubmission[],
  });
}

export function useCOASubmission(id: string) {
  return useDemoQuery({
    queryKey: ['coa', 'submission', id],
    demoQueryFn: () => getCOASubmission(id),
    emptyValue: undefined as COASubmission | undefined,
    enabled: !!id,
  });
}

export function useCOAMetrics() {
  return useDemoQuery({
    queryKey: ['coa', 'metrics'],
    demoQueryFn: getCOAMetrics,
    emptyValue: {
      totalSubmissions: 0,
      pendingResults: 0,
      passRate: 0,
      avgTurnaround: 0,
      failedThisMonth: 0,
    } as COAMetrics,
  });
}
