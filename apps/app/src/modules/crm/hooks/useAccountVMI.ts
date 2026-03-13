'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getAccountVMI } from '@/mocks/crm-details';
import type { AccountVMIData } from '@/modules/crm/types';

export function useAccountVMI(id: string) {
  return useDemoQuery<AccountVMIData>({
    queryKey: ['crm', 'account-vmi', id],
    demoQueryFn: () => getAccountVMI(id),
    emptyValue: { enrolled: false, enrolledDate: null, sellThrough: [], inventoryLevels: [], daysOnHand: [], lastReorderDate: null, autoReorderCount: 0 },
    enabled: !!id,
  });
}
