'use client';

import { useState, useCallback } from 'react';
import { PieChart } from 'lucide-react';
import { SectionHeader, LoadingSkeleton } from '@/components';
import { ReportFilters } from './ReportFilters';
import { ReportTable } from './ReportTable';
import { useSalesRepReport } from '../hooks';
import type { SalesRepReportFilters } from '../types';

const ACCENT = '#F59E0B';

const DEFAULT_FILTERS: SalesRepReportFilters = {
  dateFrom: '',
  dateTo: '',
  salesPersons: [],
  clientStatus: 'all',
  minTotal: '',
  maxTotal: '',
  showCancelled: false,
};

export function SalesPersonReportPage() {
  const [filters, setFilters] = useState<SalesRepReportFilters>(DEFAULT_FILTERS);
  const { data, isLoading } = useSalesRepReport(filters);

  const handleReset = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const handleSearch = useCallback(() => {
    // Filters are reactive via TanStack Query, but this provides
    // an explicit search trigger matching the Cultivera UX pattern
  }, []);

  return (
    <div className="space-y-4">
      <SectionHeader
        icon={PieChart}
        title="Sales Person Report"
        subtitle="Performance breakdown by sales representative"
        accentColor={ACCENT}
      />

      <ReportFilters
        filters={filters}
        onChange={setFilters}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {isLoading ? (
        <LoadingSkeleton variant="table" />
      ) : (
        <ReportTable data={data ?? []} loading={isLoading} />
      )}
    </div>
  );
}
