'use client';

import { useQuery } from '@tanstack/react-query';
import { getGeneticsLibrary } from '@/mocks/cultivation';

export function useGeneticsLibrary(filters?: { type?: string; motherStatus?: string; search?: string }) {
  return useQuery({
    queryKey: ['cultivation', 'genetics', filters],
    queryFn: () => getGeneticsLibrary(filters),
  });
}
