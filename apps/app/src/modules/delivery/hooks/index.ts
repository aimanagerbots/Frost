'use client';

import { useQuery } from '@tanstack/react-query';
import { getDeliveryRuns, getDeliveryRun, getDrivers, getDeliveryMetrics } from '@/mocks/delivery';
import type { DeliveryRunStatus } from '../types';

interface DeliveryFilters {
  status?: DeliveryRunStatus;
  search?: string;
}

export function useDeliveryRuns(filters?: DeliveryFilters) {
  return useQuery({
    queryKey: ['delivery', 'runs', filters],
    queryFn: () => getDeliveryRuns(filters),
  });
}

export function useDeliveryRun(id: string) {
  return useQuery({
    queryKey: ['delivery', 'run', id],
    queryFn: () => getDeliveryRun(id),
    enabled: !!id,
  });
}

export function useDrivers() {
  return useQuery({
    queryKey: ['delivery', 'drivers'],
    queryFn: getDrivers,
  });
}

export function useDeliveryMetrics() {
  return useQuery({
    queryKey: ['delivery', 'metrics'],
    queryFn: getDeliveryMetrics,
  });
}

export { useDeliverySchedule } from './useDeliverySchedule';
