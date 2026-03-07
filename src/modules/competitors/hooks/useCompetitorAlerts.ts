'use client';

import { useQuery } from '@tanstack/react-query';
import { getCompetitorAlerts } from '@/mocks/competitors';

export function useCompetitorAlerts() {
  return useQuery({
    queryKey: ['competitors', 'alerts'],
    queryFn: () => getCompetitorAlerts(),
  });
}
