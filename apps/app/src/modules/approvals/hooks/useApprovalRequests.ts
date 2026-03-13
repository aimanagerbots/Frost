'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getApprovalRequests } from '@/mocks/approvals';
import type { ApprovalFilters } from '@/mocks/approvals';

export function useApprovalRequests(filters?: ApprovalFilters) {
  return useDemoQuery({
    queryKey: ['approvals', 'list', filters],
    demoQueryFn: () => getApprovalRequests(filters),
    emptyValue: [] as Awaited<ReturnType<typeof getApprovalRequests>>,
  });
}
