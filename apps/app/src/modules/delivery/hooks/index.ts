'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getDeliveryRuns, getDeliveryRun, getDrivers, getDeliveryMetrics } from '@/mocks/delivery';
import type { DeliveryRun, DeliveryDriver, DeliveryMetrics } from '../types';
import type { DeliveryRunStatus } from '../types';

interface DeliveryFilters {
  status?: DeliveryRunStatus;
  search?: string;
}

export function useDeliveryRuns(filters?: DeliveryFilters) {
  return useDemoQuery({
    queryKey: ['delivery', 'runs', filters],
    demoQueryFn: () => getDeliveryRuns(filters),
    emptyValue: [] as DeliveryRun[],
  });
}

export function useDeliveryRun(id: string) {
  return useDemoQuery({
    queryKey: ['delivery', 'run', id],
    demoQueryFn: () => getDeliveryRun(id),
    emptyValue: undefined as DeliveryRun | undefined,
    enabled: !!id,
  });
}

export function useDrivers() {
  return useDemoQuery({
    queryKey: ['delivery', 'drivers'],
    demoQueryFn: getDrivers,
    emptyValue: [] as DeliveryDriver[],
  });
}

export function useDeliveryMetrics() {
  return useDemoQuery({
    queryKey: ['delivery', 'metrics'],
    demoQueryFn: getDeliveryMetrics,
    emptyValue: {
      totalDeliveries: 0,
      completedToday: 0,
      inTransit: 0,
      avgDeliveryTime: 0,
      onTimeRate: 0,
      driversActive: 0,
      revenueDeliveredToday: 0,
      paymentsCollectedToday: 0,
    } as DeliveryMetrics,
  });
}

export { useDeliverySchedule } from './useDeliverySchedule';
