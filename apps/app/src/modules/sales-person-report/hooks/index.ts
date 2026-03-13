'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { MOCK_SALES_REP_REPORTS } from '@/mocks/sales';
import type { SalesRepReport } from '@/modules/sales/types';
import type { SalesRepReportFilters } from '../types';

function filterReports(
  data: SalesRepReport[],
  filters: SalesRepReportFilters
): SalesRepReport[] {
  let results = [...data];

  // Filter by selected sales persons
  if (filters.salesPersons.length > 0) {
    results = results.filter((r) => filters.salesPersons.includes(r.repName));
  }

  // Filter by min total
  if (filters.minTotal) {
    const min = parseFloat(filters.minTotal);
    if (!isNaN(min)) {
      results = results.filter((r) => r.totalSales >= min);
    }
  }

  // Filter by max total
  if (filters.maxTotal) {
    const max = parseFloat(filters.maxTotal);
    if (!isNaN(max)) {
      results = results.filter((r) => r.totalSales <= max);
    }
  }

  return results;
}

export function useSalesRepReport(filters: SalesRepReportFilters) {
  return useDemoQuery({
    queryKey: ['sales-person-report', filters],
    demoQueryFn: async () => {
      // Simulated API delay
      await new Promise((r) => setTimeout(r, 400));
      return filterReports(MOCK_SALES_REP_REPORTS, filters);
    },
    emptyValue: [] as SalesRepReport[],
  });
}
