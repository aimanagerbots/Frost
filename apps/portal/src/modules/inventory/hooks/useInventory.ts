'use client';

import { useQuery } from '@tanstack/react-query';
import { getInventoryItems } from '@/mocks/inventory';
import type { InventoryFilter } from '@/modules/inventory/types';

export function useInventory(filters?: InventoryFilter) {
  return useQuery({
    queryKey: ['inventory', 'list', filters],
    queryFn: () => getInventoryItems(filters),
  });
}
