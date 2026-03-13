'use client';

import { useQuery } from '@tanstack/react-query';
import { getPackagingLines } from '@/mocks/packaging';

export function usePackagingLines() {
  return useQuery({
    queryKey: ['packaging', 'lines'],
    queryFn: () => getPackagingLines(),
  });
}
