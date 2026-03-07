'use client';

import { useQuery } from '@tanstack/react-query';
import { getCOASubmissions, getCOASubmission, getCOAMetrics } from '@/mocks/coa';
import type { COAStatus } from '../types';

interface COAFilters {
  status?: COAStatus;
  search?: string;
}

export function useCOASubmissions(filters?: COAFilters) {
  return useQuery({
    queryKey: ['coa', 'submissions', filters],
    queryFn: () => getCOASubmissions(filters),
  });
}

export function useCOASubmission(id: string) {
  return useQuery({
    queryKey: ['coa', 'submission', id],
    queryFn: () => getCOASubmission(id),
    enabled: !!id,
  });
}

export function useCOAMetrics() {
  return useQuery({
    queryKey: ['coa', 'metrics'],
    queryFn: getCOAMetrics,
  });
}
