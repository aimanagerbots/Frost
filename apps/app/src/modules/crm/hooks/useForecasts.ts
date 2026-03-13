'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getForecasts } from '@/mocks/crm-intelligence';
import type { Forecast } from '@/modules/crm/types';

export function useForecasts() {
  return useDemoQuery({
    queryKey: ['crm', 'forecasts'],
    demoQueryFn: () => getForecasts(),
    emptyValue: [] as Forecast[],
  });
}
