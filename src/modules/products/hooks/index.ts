'use client';

import { useQuery } from '@tanstack/react-query';
import { getProductConcepts, getRDMetrics } from '@/mocks/products';
import type { ProductFilter } from '@/modules/products/types';

export function useProductConcepts(filters?: ProductFilter) {
  return useQuery({
    queryKey: ['products', 'concepts', filters],
    queryFn: () => getProductConcepts(filters),
  });
}

export function useRDMetrics() {
  return useQuery({
    queryKey: ['products', 'metrics'],
    queryFn: () => getRDMetrics(),
  });
}
