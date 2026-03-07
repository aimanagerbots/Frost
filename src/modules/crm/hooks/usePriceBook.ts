'use client';

import { useQuery } from '@tanstack/react-query';
import { getPriceBook } from '@/mocks/crm-sales';

export function usePriceBook(filters?: { category?: string; search?: string }) {
  return useQuery({
    queryKey: ['crm', 'price-book', filters],
    queryFn: () => getPriceBook(filters),
  });
}
