'use client';

import { useQuery } from '@tanstack/react-query';
import { getSalesReps } from '@/mocks/crm';

export function useSalesReps() {
  return useQuery({
    queryKey: ['crm', 'sales-reps'],
    queryFn: getSalesReps,
  });
}
