'use client';

import { useQuery } from '@tanstack/react-query';
import { getForecasts } from '@/mocks/crm-intelligence';

export function useForecasts() {
  return useQuery({
    queryKey: ['crm', 'forecasts'],
    queryFn: () => getForecasts(),
  });
}
