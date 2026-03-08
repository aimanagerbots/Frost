'use client';

import { useQuery } from '@tanstack/react-query';
import { getHarvestRecords } from '@/mocks/cultivation';

export function useHarvestRecords() {
  return useQuery({
    queryKey: ['cultivation', 'harvests'],
    queryFn: () => getHarvestRecords(),
  });
}
