'use client';

import { useQuery } from '@tanstack/react-query';
import { getNonCannabisInventory } from '@/mocks/inventory';

export function useNonCannabisInventory() {
  return useQuery({ queryKey: ['inventory', 'non-cannabis'], queryFn: getNonCannabisInventory });
}
