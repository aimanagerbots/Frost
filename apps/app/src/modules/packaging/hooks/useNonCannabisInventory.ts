'use client';

import { useQuery } from '@tanstack/react-query';
import { getNonCannabisInventory } from '@/mocks/packaging';

interface InventoryFilters {
  type?: string;
  status?: string;
}

export function useNonCannabisInventory(filters?: InventoryFilters) {
  return useQuery({
    queryKey: ['packaging', 'materials', filters],
    queryFn: () => getNonCannabisInventory(filters),
  });
}
