'use client';

import { useQuery } from '@tanstack/react-query';
import { getLabPartners } from '@/mocks/inventory';

export function useLabPartners() {
  return useQuery({ queryKey: ['inventory', 'lab-partners'], queryFn: getLabPartners });
}
