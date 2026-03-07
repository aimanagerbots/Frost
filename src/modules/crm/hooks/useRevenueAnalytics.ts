'use client';

import { useQuery } from '@tanstack/react-query';
import { getRevenueAnalytics } from '@/mocks/crm-intelligence';

export function useRevenueAnalytics() {
  return useQuery({
    queryKey: ['crm', 'revenue-analytics'],
    queryFn: () => getRevenueAnalytics(),
  });
}
