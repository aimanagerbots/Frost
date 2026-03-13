'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { MOCK_ACCOUNT_GROUPS, MOCK_ACCOUNTS } from '@/mocks/sales';
import type { AccountGroup } from '@/modules/sales/types';
import type { SalesAccount } from '@/modules/sales/types';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function useAccountGroups() {
  return useDemoQuery<AccountGroup[]>({
    queryKey: ['account-groups'],
    demoQueryFn: async () => {
      await delay(400);
      return MOCK_ACCOUNT_GROUPS;
    },
    emptyValue: [] as AccountGroup[],
  });
}

export function useAccountGroup(id: string | null) {
  return useDemoQuery<AccountGroup | undefined>({
    queryKey: ['account-groups', id],
    demoQueryFn: async () => {
      await delay(300);
      return MOCK_ACCOUNT_GROUPS.find((g) => g.id === id);
    },
    emptyValue: undefined,
    enabled: !!id,
  });
}

export function useGroupAccounts(groupId: string | null) {
  return useDemoQuery<SalesAccount[]>({
    queryKey: ['account-groups', groupId, 'accounts'],
    demoQueryFn: async () => {
      await delay(350);
      // Simulate accounts belonging to this group — take a slice based on the group's accountCount
      const group = MOCK_ACCOUNT_GROUPS.find((g) => g.id === groupId);
      if (!group) return [];
      const startIdx = MOCK_ACCOUNT_GROUPS.indexOf(group) * 3;
      return MOCK_ACCOUNTS.slice(startIdx, startIdx + group.accountCount);
    },
    emptyValue: [] as SalesAccount[],
    enabled: !!groupId,
  });
}

export function useAllAccounts() {
  return useDemoQuery<SalesAccount[]>({
    queryKey: ['accounts'],
    demoQueryFn: async () => {
      await delay(300);
      return MOCK_ACCOUNTS;
    },
    emptyValue: [] as SalesAccount[],
  });
}
