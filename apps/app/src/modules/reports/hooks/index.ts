'use client';

import { useQuery } from '@tanstack/react-query';
import { getReports } from '@/mocks/reports';
import type { ReportFilter } from '@/modules/reports/types';

export function useReports(filters?: ReportFilter) {
  return useQuery({
    queryKey: ['reports', 'list', filters],
    queryFn: () => getReports(filters),
  });
}
