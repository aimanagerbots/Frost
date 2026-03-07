'use client';

import { useQuery } from '@tanstack/react-query';
import { getAccountVMI } from '@/mocks/crm-details';

export function useAccountVMI(id: string) {
  return useQuery({
    queryKey: ['crm', 'account-vmi', id],
    queryFn: () => getAccountVMI(id),
    enabled: !!id,
  });
}
