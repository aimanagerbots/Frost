'use client';

import { useQuery } from '@tanstack/react-query';
import { getVendorDays } from '@/mocks/crm-outreach';

export function useVendorDays() {
  return useQuery({
    queryKey: ['crm', 'vendor-days'],
    queryFn: () => getVendorDays(),
  });
}
