'use client';

import { useQuery } from '@tanstack/react-query';
import { getCannabisInventory } from '@/mocks/inventory';
import type { InventoryFilter } from '@/modules/inventory/types';

export function useCannabisInventory(filters?: InventoryFilter) {
  return useQuery({
    queryKey: ['inventory', 'cannabis', filters],
    queryFn: () => getCannabisInventory(filters),
  });
}
