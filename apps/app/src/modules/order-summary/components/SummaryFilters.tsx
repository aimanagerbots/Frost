'use client';

import { Search, X } from 'lucide-react';
import type { OrderSummaryFilters } from '../types';
import { ORDER_STATUSES } from '../types';

interface SummaryFiltersProps {
  filters: OrderSummaryFilters;
  onChange: (filters: OrderSummaryFilters) => void;
  onSearch: () => void;
  onReset: () => void;
  salesReps: string[];
}

const ACCENT = '#F59E0B';

function DateInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-default bg-base px-3 py-2 text-sm text-text-default placeholder:text-text-muted focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30 [&::-webkit-calendar-picker-indicator]:invert"
        aria-label={label}
      />
      {!value && (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-text-muted">
          {label}
        </span>
      )}
    </div>
  );
}

export function SummaryFilters({
  filters,
  onChange,
  onSearch,
  onReset,
  salesReps,
}: SummaryFiltersProps) {
  const update = (patch: Partial<OrderSummaryFilters>) => {
    onChange({ ...filters, ...patch });
  };

  return (
    <div className="space-y-3 rounded-xl border border-default bg-card p-4">
      {/* Row 1: Date ranges + trade name + submitted by */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {/* From/To Submitted Date */}
        <DateInput
          label="(From) Submitted Date"
          value={filters.fromSubmittedDate}
          onChange={(v) => update({ fromSubmittedDate: v })}
        />
        <DateInput
          label="(To) Submitted Date"
          value={filters.toSubmittedDate}
          onChange={(v) => update({ toSubmittedDate: v })}
        />

        {/* Trade Name */}
        <input
          type="text"
          value={filters.tradeName}
          onChange={(e) => update({ tradeName: e.target.value })}
          placeholder="Trade Name"
          className="rounded-lg border border-default bg-base px-3 py-2 text-sm text-text-default placeholder:text-text-muted focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30"
        />

        {/* From/To Est Delivery Date */}
        <DateInput
          label="(From) Est. Delivery Date"
          value={filters.fromEstDeliveryDate}
          onChange={(v) => update({ fromEstDeliveryDate: v })}
        />
        <DateInput
          label="(To) Est. Delivery Date"
          value={filters.toEstDeliveryDate}
          onChange={(v) => update({ toEstDeliveryDate: v })}
        />

        {/* Submitted By */}
        <select
          value={filters.submittedBy}
          onChange={(e) => update({ submittedBy: e.target.value })}
          className="rounded-lg border border-default bg-base px-3 py-2 text-sm text-text-default focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30"
          aria-label="Submitted By"
        >
          <option value="">Submitted By</option>
          {salesReps.map((rep) => (
            <option key={rep} value={rep}>
              {rep}
            </option>
          ))}
        </select>

        {/* Status */}
        <select
          value={filters.status}
          onChange={(e) => update({ status: e.target.value })}
          className="rounded-lg border border-default bg-base px-3 py-2 text-sm text-text-default focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30"
          aria-label="Status"
        >
          <option value="">Status</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Row 2: Released date, checkboxes, action buttons */}
      <div className="flex flex-wrap items-center gap-3">
        {/* From/To Released Date */}
        <div className="w-40">
          <DateInput
            label="(From) Released Date"
            value={filters.fromReleasedDate}
            onChange={(v) => update({ fromReleasedDate: v })}
          />
        </div>
        <div className="w-40">
          <DateInput
            label="(To) Released Date"
            value={filters.toReleasedDate}
            onChange={(v) => update({ toReleasedDate: v })}
          />
        </div>

        {/* Checkboxes */}
        <label className="flex items-center gap-1.5 text-xs text-text-muted cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.showCancelled}
            onChange={(e) => update({ showCancelled: e.target.checked })}
            className="h-3.5 w-3.5 rounded border-default bg-base accent-amber-500"
          />
          Show Cancelled Orders
        </label>

        <label className="flex items-center gap-1.5 text-xs text-text-muted cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.hideSamplesOnly}
            onChange={(e) => update({ hideSamplesOnly: e.target.checked })}
            className="h-3.5 w-3.5 rounded border-default bg-base accent-amber-500"
          />
          Hide &quot;Samples Only&quot;
        </label>

        <label className="flex items-center gap-1.5 text-xs text-text-muted cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.hideNonSamplesOnly}
            onChange={(e) => update({ hideNonSamplesOnly: e.target.checked })}
            className="h-3.5 w-3.5 rounded border-default bg-base accent-amber-500"
          />
          Hide Non &quot;Samples Only&quot;
        </label>

        {/* Search + Reset buttons */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={onSearch}
            className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-black transition-colors hover:opacity-90"
            style={{ backgroundColor: ACCENT }}
            aria-label="Search orders"
          >
            <Search className="h-4 w-4" />
            Search
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 rounded-lg border border-default bg-base px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-card-hover hover:text-text-default"
            aria-label="Reset filters"
          >
            <X className="h-4 w-4" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
