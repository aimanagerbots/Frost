'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getVendorDays } from '@/mocks/crm-outreach';
import type { VendorDay } from '@/modules/crm/types';

export function useVendorDays() {
  return useDemoQuery({
    queryKey: ['crm', 'vendor-days'],
    demoQueryFn: () => getVendorDays(),
    emptyValue: [] as VendorDay[],
  });
}
