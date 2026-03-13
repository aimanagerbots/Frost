'use client';

import { useQuery } from '@tanstack/react-query';
import { MOCK_ACCOUNT_GROUPS, MOCK_ACCOUNTS } from '@/mocks/sales';
import type { AccountGroup } from '@/modules/sales/types';
import type { SalesAccount } from '@/modules/sales/types';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function useAccountGroups() {
  return useQuery<AccountGroup[]>({
    queryKey: ['account-groups'],
    queryFn: async () => {
      await delay(400);
      return MOCK_ACCOUNT_GROUPS;
    },
  });
}

export function useAccountGroup(id: string | null) {
  return useQuery<AccountGroup | undefined>({
    queryKey: ['account-groups', id],
    queryFn: async () => {
      await delay(300);
      return MOCK_ACCOUNT_GROUPS.find((g) => g.id === id);
    },
    enabled: !!id,
  });
}

export function useGroupAccounts(groupId: string | null) {
  return useQuery<SalesAccount[]>({
    queryKey: ['account-groups', groupId, 'accounts'],
    queryFn: async () => {
      await delay(350);
      // Simulate accounts belonging to this group — take a slice based on the group's accountCount
      const group = MOCK_ACCOUNT_GROUPS.find((g) => g.id === groupId);
      if (!group) return [];
      const startIdx = MOCK_ACCOUNT_GROUPS.indexOf(group) * 3;
      return MOCK_ACCOUNTS.slice(startIdx, startIdx + group.accountCount);
    },
    enabled: !!groupId,
  });
}

export function useAllAccounts() {
  return useQuery<SalesAccount[]>({
    queryKey: ['accounts'],
    queryFn: async () => {
      await delay(300);
      return MOCK_ACCOUNTS;
    },
  });
}
