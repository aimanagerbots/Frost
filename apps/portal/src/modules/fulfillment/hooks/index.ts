'use client';

import { useQuery } from '@tanstack/react-query';
import { getFulfillmentOrders, getFulfillmentOrder, getFulfillmentMetrics } from '@/mocks/fulfillment';
import type { FulfillmentStatus, FulfillmentPriority } from '../types';

interface FulfillmentFilters {
  status?: FulfillmentStatus;
  priority?: FulfillmentPriority;
  search?: string;
}

export function useFulfillmentOrders(filters?: FulfillmentFilters) {
  return useQuery({
    queryKey: ['fulfillment', 'orders', filters],
    queryFn: () => getFulfillmentOrders(filters),
  });
}

export function useFulfillmentOrder(id: string) {
  return useQuery({
    queryKey: ['fulfillment', 'order', id],
    queryFn: () => getFulfillmentOrder(id),
    enabled: !!id,
  });
}

export function useFulfillmentMetrics() {
  return useQuery({
    queryKey: ['fulfillment', 'metrics'],
    queryFn: getFulfillmentMetrics,
  });
}

export { useFulfillmentProgress } from './useFulfillmentProgress';
export { usePackingOperations } from './usePackingOperations';
