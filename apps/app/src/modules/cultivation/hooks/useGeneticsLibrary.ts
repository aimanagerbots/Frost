'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getGeneticsLibrary } from '@/mocks/cultivation';
import type { Strain } from '../types';

export function useGeneticsLibrary(filters?: { type?: string; motherStatus?: string; search?: string }) {
  return useDemoQuery({
    queryKey: ['cultivation', 'genetics', filters],
    demoQueryFn: () => getGeneticsLibrary(filters),
    emptyValue: [] as Strain[],
  });
}
