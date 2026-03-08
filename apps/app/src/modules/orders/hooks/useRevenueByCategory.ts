'use client';

import { useQuery } from '@tanstack/react-query';
import { getRevenueByCategory } from '@/mocks/orders';

export function useRevenueByCategory() {
  return useQuery({
    queryKey: ['orders', 'revenue-by-category'],
    queryFn: getRevenueByCategory,
  });
}
