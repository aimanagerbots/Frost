'use client';

import { useState, useCallback } from 'react';
import { FileText } from 'lucide-react';
import { SectionHeader, LoadingSkeleton } from '@/components';
import { useOrderSummary, useSalesReps } from '../hooks';
import { SummaryFilters } from './SummaryFilters';
import { SummaryTable } from './SummaryTable';
import { DEFAULT_FILTERS } from '../types';
import type { OrderSummaryFilters } from '../types';

const ACCENT = '#F59E0B';

export function OrderSummaryPage() {
  const [filters, setFilters] = useState<OrderSummaryFilters>(DEFAULT_FILTERS);
  const [activeFilters, setActiveFilters] = useState<OrderSummaryFilters>(DEFAULT_FILTERS);

  const { data, isLoading } = useOrderSummary(activeFilters);
  const { data: salesReps } = useSalesReps();

  const handleSearch = useCallback(() => {
    setActiveFilters(filters);
  }, [filters]);

  const handleReset = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setActiveFilters(DEFAULT_FILTERS);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setFilters((prev) => ({ ...prev, itemsPerPage: size }));
    setActiveFilters((prev) => ({ ...prev, itemsPerPage: size }));
  }, []);

  return (
    <div className="space-y-4">
      <SectionHeader
        icon={FileText}
        title="Order Summary"
        subtitle="View and export order data across all sales reps"
        accentColor={ACCENT}
      />

      <SummaryFilters
        filters={filters}
        onChange={setFilters}
        onSearch={handleSearch}
        onReset={handleReset}
        salesReps={salesReps ?? []}
      />

      {isLoading ? (
        <LoadingSkeleton variant="table" />
      ) : (
        <SummaryTable
          data={data?.rows ?? []}
          grandTotal={data?.grandTotal ?? 0}
          pageSize={activeFilters.itemsPerPage}
          onPageSizeChange={handlePageSizeChange}
          loading={isLoading}
        />
      )}
    </div>
  );
}
