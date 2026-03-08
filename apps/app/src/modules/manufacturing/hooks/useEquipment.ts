'use client';

import { useQuery } from '@tanstack/react-query';
import { getEquipment } from '@/mocks/manufacturing';

export function useEquipment(lineId?: string) {
  return useQuery({
    queryKey: ['manufacturing', 'equipment', lineId],
    queryFn: () => getEquipment(lineId),
  });
}
