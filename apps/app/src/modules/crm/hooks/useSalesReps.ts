'use client';

import { useQuery } from '@tanstack/react-query';
import { getSalesReps } from '@/mocks/crm';
import type { SalesRep } from '@/modules/crm/types';
export function useSalesReps() {
  return useQuery({
    queryKey: ['crm', 'sales-reps'],
    queryFn: async () => {
      return getSalesReps();
    },
  });
}
