'use client';

import { useQuery } from '@tanstack/react-query';
import { getVMIAccounts, getVMIMetrics } from '@/mocks/vmi';

export function useVMIAccounts() {
  return useQuery({
    queryKey: ['vmi', 'accounts'],
    queryFn: () => getVMIAccounts(),
  });
}

export function useVMIMetrics() {
  return useQuery({
    queryKey: ['vmi', 'metrics'],
    queryFn: () => getVMIMetrics(),
  });
}
