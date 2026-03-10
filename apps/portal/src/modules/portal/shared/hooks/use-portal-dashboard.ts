'use client';

import { useQuery } from '@tanstack/react-query';
import type { DashboardScorecardData, DashboardSavingsData, FlashDeal, AllocationDrop } from '../types';
import { getScorecardForAccount, getSavingsForAccount, getFlashDeals, getAllocationDrops } from '../mock-data';

export function usePortalScorecard(accountId: string) {
  return useQuery<DashboardScorecardData>({
    queryKey: ['portal', 'scorecard', accountId],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return getScorecardForAccount(accountId);
    },
    enabled: !!accountId,
  });
}

export function usePortalSavings(accountId: string) {
  return useQuery<DashboardSavingsData>({
    queryKey: ['portal', 'savings', accountId],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return getSavingsForAccount(accountId);
    },
    enabled: !!accountId,
  });
}

export function useFlashDeals() {
  return useQuery<FlashDeal[]>({
    queryKey: ['portal', 'flash-deals'],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 200));
      return getFlashDeals();
    },
  });
}

export function useAllocationDrops() {
  return useQuery<AllocationDrop[]>({
    queryKey: ['portal', 'allocation-drops'],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 200));
      return getAllocationDrops();
    },
  });
}
