'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getPackagingEquipment } from '@/mocks/packaging';
import type { PackagingEquipment } from '../types';

interface PackagingEquipmentFilters {
  lineId?: string;
  status?: string;
}

export function usePackagingEquipment(filters?: PackagingEquipmentFilters) {
  return useDemoQuery({
    queryKey: ['packaging', 'equipment', filters],
    demoQueryFn: () => getPackagingEquipment(filters),
    emptyValue: [] as PackagingEquipment[],
  });
}
