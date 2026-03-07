'use client';

import { useQuery } from '@tanstack/react-query';
import { getApprovalRequests } from '@/mocks/approvals';
import type { ApprovalFilters } from '@/mocks/approvals';

export function useApprovalRequests(filters?: ApprovalFilters) {
  return useQuery({
    queryKey: ['approvals', 'list', filters],
    queryFn: () => getApprovalRequests(filters),
  });
}
