'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getStrain } from '@/mocks/cultivation';
import type { Strain } from '../types';

export function useStrain(id: string) {
  return useDemoQuery<Strain | undefined>({
    queryKey: ['cultivation', 'strain', id],
    demoQueryFn: () => getStrain(id),
    emptyValue: undefined,
    enabled: !!id,
  });
}
