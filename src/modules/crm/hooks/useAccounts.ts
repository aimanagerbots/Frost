'use client';

import { useQuery } from '@tanstack/react-query';
import { getAccounts } from '@/mocks/crm';

interface AccountFilters {
  status?: string;
  region?: string;
  search?: string;
}

export function useAccounts(filters?: AccountFilters) {
  return useQuery({
    queryKey: ['crm', 'accounts', filters],
    queryFn: () => getAccounts(filters),
  });
}
