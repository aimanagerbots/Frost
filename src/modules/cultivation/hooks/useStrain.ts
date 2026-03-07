'use client';

import { useQuery } from '@tanstack/react-query';
import { getStrain } from '@/mocks/cultivation';

export function useStrain(id: string) {
  return useQuery({
    queryKey: ['cultivation', 'strain', id],
    queryFn: () => getStrain(id),
    enabled: !!id,
  });
}
