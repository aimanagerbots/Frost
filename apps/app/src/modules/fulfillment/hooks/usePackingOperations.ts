'use client';

import { useQuery } from '@tanstack/react-query';
import { getPackingOperations } from '@/mocks/fulfillment';

export function usePackingOperations() {
  return useQuery({
    queryKey: ['fulfillment', 'packing'],
    queryFn: getPackingOperations,
  });
}
