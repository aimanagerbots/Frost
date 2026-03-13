'use client';

import { useQuery } from '@tanstack/react-query';
import { getDisposalRecords } from '@/mocks/cultivation';

export function useDisposalRecords() {
  return useQuery({
    queryKey: ['cultivation', 'disposal-records'],
    queryFn: () => getDisposalRecords(),
  });
}
