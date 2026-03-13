'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getDisposalRecords } from '@/mocks/cultivation';
import type { DisposalRecord } from '../types';

export function useDisposalRecords() {
  return useDemoQuery({
    queryKey: ['cultivation', 'disposal-records'],
    demoQueryFn: () => getDisposalRecords(),
    emptyValue: [] as DisposalRecord[],
  });
}
