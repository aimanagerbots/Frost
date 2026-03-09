'use client';

import { useQuery } from '@tanstack/react-query';
import type { PortalInvoice } from '../types';
import { getInvoicesForAccount } from '../mock-data';

export function usePortalInvoices(accountId: string) {
  return useQuery<PortalInvoice[]>({
    queryKey: ['portal', 'invoices', accountId],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return getInvoicesForAccount(accountId);
    },
    enabled: !!accountId,
  });
}

export function usePortalOutstandingInvoices(accountId: string) {
  return useQuery<PortalInvoice[]>({
    queryKey: ['portal', 'invoices', 'outstanding', accountId],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      const all = getInvoicesForAccount(accountId);
      return all.filter((inv) => inv.status === 'outstanding' || inv.status === 'overdue');
    },
    enabled: !!accountId,
  });
}
