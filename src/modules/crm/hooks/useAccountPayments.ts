'use client';

import { useQuery } from '@tanstack/react-query';
import { getAccountPayments } from '@/mocks/crm-details';

export function useAccountPayments(id: string) {
  return useQuery({
    queryKey: ['crm', 'account-payments', id],
    queryFn: () => getAccountPayments(id),
    enabled: !!id,
  });
}
