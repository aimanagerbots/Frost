'use client';

import { useQuery } from '@tanstack/react-query';
import { getAccountOrders } from '@/mocks/crm-details';

export function useAccountOrders(id: string) {
  return useQuery({
    queryKey: ['crm', 'account-orders', id],
    queryFn: () => getAccountOrders(id),
    enabled: !!id,
  });
}
