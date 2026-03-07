'use client';

import { useQuery } from '@tanstack/react-query';
import { getAccountFiles } from '@/mocks/crm-details';

export function useAccountFiles(id: string) {
  return useQuery({
    queryKey: ['crm', 'account-files', id],
    queryFn: () => getAccountFiles(id),
    enabled: !!id,
  });
}
