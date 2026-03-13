'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getPackagingLines } from '@/mocks/packaging';
import type { PackagingLine } from '../types';

export function usePackagingLines() {
  return useDemoQuery({
    queryKey: ['packaging', 'lines'],
    demoQueryFn: () => getPackagingLines(),
    emptyValue: [] as PackagingLine[],
  });
}
