'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getNonCannabisInventory } from '@/mocks/packaging';
import type { NonCannabisInventory } from '../types';

interface InventoryFilters {
  type?: string;
  status?: string;
}

export function useNonCannabisInventory(filters?: InventoryFilters) {
  return useDemoQuery({
    queryKey: ['packaging', 'materials', filters],
    demoQueryFn: () => getNonCannabisInventory(filters),
    emptyValue: [] as NonCannabisInventory[],
  });
}
