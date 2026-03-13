'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getVendorDayImpact } from '@/mocks/crm-outreach';
import type { VendorDayImpact } from '@/modules/crm/types';

export function useVendorDayImpact(vendorDayId: string | null) {
  return useDemoQuery<VendorDayImpact | null>({
    queryKey: ['crm', 'vendor-day-impact', vendorDayId],
    demoQueryFn: () => getVendorDayImpact(vendorDayId!),
    emptyValue: null,
    enabled: !!vendorDayId,
  });
}
