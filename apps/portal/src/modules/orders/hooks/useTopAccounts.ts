'use client';

import { useQuery } from '@tanstack/react-query';
import { getTopAccounts } from '@/mocks/orders';

export function useTopAccounts() {
  return useQuery({
    queryKey: ['orders', 'top-accounts'],
    queryFn: getTopAccounts,
  });
}
