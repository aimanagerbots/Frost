'use client';

import { useQuery } from '@tanstack/react-query';
import { getAccountDeliveries } from '@/mocks/crm-details';

export function useAccountDeliveries(id: string) {
  return useQuery({
    queryKey: ['crm', 'account-deliveries', id],
    queryFn: () => getAccountDeliveries(id),
    enabled: !!id,
  });
}
