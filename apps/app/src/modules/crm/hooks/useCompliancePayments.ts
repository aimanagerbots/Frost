'use client';

import { useQuery } from '@tanstack/react-query';
import { getCompliancePayments } from '@/mocks/crm-intelligence';

export function useCompliancePayments() {
  return useQuery({
    queryKey: ['crm', 'compliance-payments'],
    queryFn: () => getCompliancePayments(),
  });
}
