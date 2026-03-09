'use client';

import { useQuery } from '@tanstack/react-query';
import type { PortalDelivery } from '../types';
import { getDeliveriesForAccount } from '../mock-data';

export function usePortalDeliveries(accountId: string) {
  return useQuery<PortalDelivery[]>({
    queryKey: ['portal', 'deliveries', accountId],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return getDeliveriesForAccount(accountId);
    },
    enabled: !!accountId,
  });
}

export function usePortalUpcomingDeliveries(accountId: string) {
  return useQuery<PortalDelivery[]>({
    queryKey: ['portal', 'deliveries', 'upcoming', accountId],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      const all = getDeliveriesForAccount(accountId);
      return all.filter((d) => d.status === 'scheduled' || d.status === 'in-transit');
    },
    enabled: !!accountId,
  });
}
