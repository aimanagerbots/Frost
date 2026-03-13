'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getCompliancePayments } from '@/mocks/crm-intelligence';
import type { CompliancePayment } from '@/modules/crm/types';

export function useCompliancePayments() {
  return useDemoQuery({
    queryKey: ['crm', 'compliance-payments'],
    demoQueryFn: () => getCompliancePayments(),
    emptyValue: [] as CompliancePayment[],
  });
}
