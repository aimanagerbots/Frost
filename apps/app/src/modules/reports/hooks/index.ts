'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getReports } from '@/mocks/reports';
import type { ReportFilter, Report } from '@/modules/reports/types';

export function useReports(filters?: ReportFilter) {
  return useDemoQuery({
    queryKey: ['reports', 'list', filters],
    demoQueryFn: () => getReports(filters),
    emptyValue: [] as Report[],
  });
}
