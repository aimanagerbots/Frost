'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getFulfillmentOrders, getFulfillmentOrder, getFulfillmentMetrics } from '@/mocks/fulfillment';
import type { FulfillmentOrder, FulfillmentMetrics, FulfillmentStatus, FulfillmentPriority } from '../types';

interface FulfillmentFilters {
  status?: FulfillmentStatus;
  priority?: FulfillmentPriority;
  search?: string;
}

export function useFulfillmentOrders(filters?: FulfillmentFilters) {
  return useDemoQuery({
    queryKey: ['fulfillment', 'orders', filters],
    demoQueryFn: () => getFulfillmentOrders(filters),
    emptyValue: [] as FulfillmentOrder[],
  });
}

export function useFulfillmentOrder(id: string) {
  return useDemoQuery({
    queryKey: ['fulfillment', 'order', id],
    demoQueryFn: () => getFulfillmentOrder(id),
    emptyValue: undefined as FulfillmentOrder | undefined,
    enabled: !!id,
  });
}

export function useFulfillmentMetrics() {
  return useDemoQuery({
    queryKey: ['fulfillment', 'metrics'],
    demoQueryFn: getFulfillmentMetrics,
    emptyValue: {
      totalOrders: 0,
      completedToday: 0,
      inProgress: 0,
      avgPickTime: 0,
      accuracyRate: 0,
      itemsPerHour: 0,
    } as FulfillmentMetrics,
  });
}

export { useFulfillmentProgress } from './useFulfillmentProgress';
export { usePackingOperations } from './usePackingOperations';
