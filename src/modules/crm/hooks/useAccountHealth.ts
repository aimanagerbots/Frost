'use client';

import { useQuery } from '@tanstack/react-query';
import { getAccountHealth } from '@/mocks/crm-details';

export function useAccountHealth(id: string) {
  return useQuery({
    queryKey: ['crm', 'account-health', id],
    queryFn: () => getAccountHealth(id),
    enabled: !!id,
  });
}
