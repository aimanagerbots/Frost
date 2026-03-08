'use client';

import { useQuery } from '@tanstack/react-query';
import { getProductionLines } from '@/mocks/manufacturing';

export function useProductionLines() {
  return useQuery({
    queryKey: ['manufacturing', 'production-lines'],
    queryFn: () => getProductionLines(),
  });
}
