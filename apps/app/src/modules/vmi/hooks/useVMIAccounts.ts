'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getVMIAccounts, getVMIMetrics, getVMIDailyEmails } from '@/mocks/vmi';
import type { VMIAccount, VMIMetrics, VMIDailyEmail } from '@/modules/vmi/types';

export function useVMIAccounts() {
  return useDemoQuery({
    queryKey: ['vmi', 'accounts'],
    demoQueryFn: () => getVMIAccounts(),
    emptyValue: [] as VMIAccount[],
  });
}

export function useVMIMetrics() {
  return useDemoQuery({
    queryKey: ['vmi', 'metrics'],
    demoQueryFn: () => getVMIMetrics(),
    emptyValue: {
      enrolledAccounts: 0,
      totalSKUs: 0,
      reorderAlerts: 0,
      avgDailyVelocity: 0,
      avgMarketShare: 0,
      fillRate: 0,
    } as VMIMetrics,
  });
}

export function useVMIDailyEmails() {
  return useDemoQuery({
    queryKey: ['vmi', 'daily-emails'],
    demoQueryFn: () => getVMIDailyEmails(),
    emptyValue: [] as VMIDailyEmail[],
  });
}
