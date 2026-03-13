'use client';

import { useQuery } from '@tanstack/react-query';
import { getPackagingEquipment } from '@/mocks/packaging';

interface PackagingEquipmentFilters {
  lineId?: string;
  status?: string;
}

export function usePackagingEquipment(filters?: PackagingEquipmentFilters) {
  return useQuery({
    queryKey: ['packaging', 'equipment', filters],
    queryFn: () => getPackagingEquipment(filters),
  });
}
