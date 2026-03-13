'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getPriceBook } from '@/mocks/crm-sales';
import type { PriceBookEntry } from '@/modules/crm/types';

export function usePriceBook(filters?: { category?: string; search?: string }) {
  return useDemoQuery({
    queryKey: ['crm', 'price-book', filters],
    demoQueryFn: () => getPriceBook(filters),
    emptyValue: [] as PriceBookEntry[],
  });
}
