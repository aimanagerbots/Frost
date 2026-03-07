'use client';

import { useQuery } from '@tanstack/react-query';
import { getGrowSupplies } from '@/mocks/cultivation';

export function useGrowSupplies(filters?: { category?: string; status?: string }) {
  return useQuery({
    queryKey: ['cultivation', 'supplies', filters],
    queryFn: () => getGrowSupplies(filters),
  });
}
