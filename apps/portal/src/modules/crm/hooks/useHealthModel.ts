'use client';

import { useQuery } from '@tanstack/react-query';
import { getHealthModel } from '@/mocks/crm-intelligence';

export function useHealthModel() {
  return useQuery({
    queryKey: ['crm', 'health-model'],
    queryFn: () => getHealthModel(),
  });
}
