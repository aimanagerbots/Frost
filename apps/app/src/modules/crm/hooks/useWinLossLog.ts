'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getWinLossLog } from '@/mocks/crm-intelligence';
import type { WinLossEntry } from '@/modules/crm/types';

export function useWinLossLog() {
  return useDemoQuery({
    queryKey: ['crm', 'win-loss-log'],
    demoQueryFn: () => getWinLossLog(),
    emptyValue: [] as WinLossEntry[],
  });
}
