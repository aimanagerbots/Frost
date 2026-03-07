'use client';

import { useQuery } from '@tanstack/react-query';
import { getWinLossLog } from '@/mocks/crm-intelligence';

export function useWinLossLog() {
  return useQuery({
    queryKey: ['crm', 'win-loss-log'],
    queryFn: () => getWinLossLog(),
  });
}
