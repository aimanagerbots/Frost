'use client';

import { useQuery } from '@tanstack/react-query';
import type { PortalOrder } from '../types';
import { getOrdersForAccount } from '../mock-data';

const ALL_ACCOUNT_IDS = ['acct-1', 'acct-2', 'acct-3'];

export function usePortalOrders(accountId: string) {
  return useQuery<PortalOrder[]>({
    queryKey: ['portal', 'orders', accountId],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return getOrdersForAccount(accountId);
    },
    enabled: !!accountId,
  });
}

export function usePortalOrder(orderId: string) {
  return useQuery<PortalOrder | undefined>({
    queryKey: ['portal', 'order', orderId],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      for (const accountId of ALL_ACCOUNT_IDS) {
        const orders = getOrdersForAccount(accountId);
        const match = orders.find((o) => o.id === orderId);
        if (match) return match;
      }
      return undefined;
    },
  });
}
