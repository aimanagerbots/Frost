'use client';

import { useQuery } from '@tanstack/react-query';
import { getComplianceLicenses } from '@/mocks/crm-intelligence';

export function useComplianceLicenses() {
  return useQuery({
    queryKey: ['crm', 'compliance-licenses'],
    queryFn: () => getComplianceLicenses(),
  });
}
