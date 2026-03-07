'use client';

import { useQuery } from '@tanstack/react-query';
import { getCOASubmissions } from '@/mocks/inventory';
import type { COASubmission } from '@/modules/inventory/types';

export function useCOASubmissions(filters?: { status?: COASubmission['status']; search?: string }) {
  return useQuery({
    queryKey: ['inventory', 'coa-submissions', filters],
    queryFn: () => getCOASubmissions(filters),
  });
}
