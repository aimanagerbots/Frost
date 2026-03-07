'use client';

import { useQuery } from '@tanstack/react-query';
import { getVMIAccounts, getVMIMetrics, getVMIDailyEmails } from '@/mocks/vmi';

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

export function useVMIDailyEmails() {
  return useQuery({
    queryKey: ['vmi', 'daily-emails'],
    queryFn: () => getVMIDailyEmails(),
  });
}
