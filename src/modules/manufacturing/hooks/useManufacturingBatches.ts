'use client';

import { useQuery } from '@tanstack/react-query';
import { getManufacturingBatches } from '@/mocks/manufacturing';

export function useManufacturingBatches(filters?: { category?: string }) {
  return useQuery({
    queryKey: ['manufacturing', 'batches', filters],
    queryFn: () => getManufacturingBatches(filters),
  });
}
