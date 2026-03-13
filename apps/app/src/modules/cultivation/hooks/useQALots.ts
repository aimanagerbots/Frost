'use client';

import { useQuery } from '@tanstack/react-query';
import { getQALots } from '@/mocks/cultivation';

export function useQALots() {
  return useQuery({
    queryKey: ['cultivation', 'qa-lots'],
    queryFn: () => getQALots(),
  });
}
