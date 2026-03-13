'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getOrderPipeline } from '@/mocks/orders';
import type { OrderPipelineStage } from '@/modules/orders/types';

export function useOrderPipeline() {
  return useDemoQuery({
    queryKey: ['orders', 'pipeline'],
    demoQueryFn: getOrderPipeline,
    emptyValue: [] as OrderPipelineStage[],
  });
}
