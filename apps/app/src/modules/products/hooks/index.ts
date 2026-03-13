'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getProductConcepts, getRDMetrics } from '@/mocks/products';
import type { ProductFilter, ProductConcept, RDMetrics } from '@/modules/products/types';

export function useProductConcepts(filters?: ProductFilter) {
  return useDemoQuery({
    queryKey: ['products', 'concepts', filters],
    demoQueryFn: () => getProductConcepts(filters),
    emptyValue: [] as ProductConcept[],
  });
}

export function useRDMetrics() {
  return useDemoQuery<RDMetrics>({
    queryKey: ['products', 'metrics'],
    demoQueryFn: () => getRDMetrics(),
    emptyValue: { conceptsInPipeline: 0, avgTimeToLaunch: '0 weeks', launchesThisQuarter: 0, successRate: 0 },
  });
}
