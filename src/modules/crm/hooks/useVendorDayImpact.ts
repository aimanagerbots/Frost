'use client';

import { useQuery } from '@tanstack/react-query';
import { getVendorDayImpact } from '@/mocks/crm-outreach';

export function useVendorDayImpact(vendorDayId: string | null) {
  return useQuery({
    queryKey: ['crm', 'vendor-day-impact', vendorDayId],
    queryFn: () => getVendorDayImpact(vendorDayId!),
    enabled: !!vendorDayId,
  });
}
