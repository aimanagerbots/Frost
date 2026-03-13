'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getComplianceLicenses } from '@/mocks/crm-intelligence';
import type { ComplianceLicense } from '@/modules/crm/types';

export function useComplianceLicenses() {
  return useDemoQuery({
    queryKey: ['crm', 'compliance-licenses'],
    demoQueryFn: () => getComplianceLicenses(),
    emptyValue: [] as ComplianceLicense[],
  });
}
