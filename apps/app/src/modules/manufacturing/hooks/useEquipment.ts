'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getEquipment } from '@/mocks/manufacturing';
import type { Equipment } from '../types';

export function useEquipment(lineId?: string) {
  return useDemoQuery({
    queryKey: ['manufacturing', 'equipment', lineId],
    demoQueryFn: () => getEquipment(lineId),
    emptyValue: [] as Equipment[],
  });
}
