'use client';

import { useQuery } from '@tanstack/react-query';
import { getInventoryByCategory } from '@/mocks/inventory';

export function useInventoryByCategory() {
  return useQuery({
    queryKey: ['inventory', 'by-category'],
    queryFn: getInventoryByCategory,
  });
}
