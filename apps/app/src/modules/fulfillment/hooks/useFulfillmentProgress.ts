'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getFulfillmentProgress } from '@/mocks/fulfillment';
import type { FulfillmentProgress } from '../types';

export function useFulfillmentProgress() {
  return useDemoQuery({
    queryKey: ['fulfillment', 'progress'],
    demoQueryFn: getFulfillmentProgress,
    emptyValue: {
      stages: [],
      totalUnitsToday: 0,
      unitsPicked: 0,
      unitsPacked: 0,
      unitsReady: 0,
      throughputTarget: 0,
    } as FulfillmentProgress,
  });
}
