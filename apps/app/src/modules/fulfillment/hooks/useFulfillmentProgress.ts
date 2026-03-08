'use client';

import { useQuery } from '@tanstack/react-query';
import { getFulfillmentProgress } from '@/mocks/fulfillment';

export function useFulfillmentProgress() {
  return useQuery({
    queryKey: ['fulfillment', 'progress'],
    queryFn: getFulfillmentProgress,
  });
}
