'use client';

import { useQuery } from '@tanstack/react-query';
import { getInventoryByState } from '@/mocks/inventory';

export function useInventoryByState() {
  return useQuery({
    queryKey: ['inventory', 'by-state'],
    queryFn: getInventoryByState,
  });
}
