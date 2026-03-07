'use client';

import { cn } from '@/lib/utils';
import { Filter, X } from 'lucide-react';
import type { SalesRep } from '../../types';

interface Filters {
  region: string;
  rep: string;
  healthTier: string;
  vmi: string;
  payment: string;
  category: string;
}

interface AccountsFilterBarProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  regions: string[];
  reps: SalesRep[];
  visible: boolean;
  onToggle: () => void;
}

const HEALTH_TIERS = [
  { value: '', label: 'All Health' },
  { value: 'thriving', label: 'Thriving (80+)' },
  { value: 'healthy', label: 'Healthy (60-79)' },
  { value: 'at-risk', label: 'At-Risk (40-59)' },
  { value: 'churning', label: 'Churning (<40)' },
];

const PAYMENT_OPTIONS = [
  { value: '', label: 'All Payment' },
  { value: 'excellent', label: 'Excellent' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' },
];

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'flower', label: 'Flower' },
  { value: 'preroll', label: 'Preroll' },
  { value: 'vaporizer', label: 'Vaporizer' },
  { value: 'concentrate', label: 'Concentrate' },
  { value: 'edible', label: 'Edible' },
  { value: 'beverage', label: 'Beverage' },
];

const DEFAULT_FILTERS: Filters = {
  region: '',
  rep: '',
  healthTier: '',
  vmi: '',
  payment: '',
  category: '',
};

function SelectFilter({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-default bg-base px-3 py-1.5 text-sm text-text-default focus:border-hover focus:outline-none"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export type { Filters as AccountFilters };

export function AccountsFilterBar({
  filters,
  onFiltersChange,
  regions,
  reps,
  visible,
  onToggle,
}: AccountsFilterBarProps) {
  const activeCount = Object.values(filters).filter(Boolean).length;
  const update = (key: keyof Filters, value: string) =>
    onFiltersChange({ ...filters, [key]: value });

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={onToggle}
        className={cn(
          'flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors',
          visible
            ? 'border-[#F59E0B]/40 bg-[#F59E0B]/10 text-[#F59E0B]'
            : 'border-default bg-card text-text-muted hover:text-text-default'
        )}
      >
        <Filter className="h-4 w-4" />
        Filters
        {activeCount > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F59E0B] text-xs font-medium text-black">
            {activeCount}
          </span>
        )}
      </button>

      {visible && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-default bg-card p-3">
          <SelectFilter
            value={filters.region}
            onChange={(v) => update('region', v)}
            options={[
              { value: '', label: 'All Regions' },
              ...regions.map((r) => ({ value: r, label: r })),
            ]}
          />
          <SelectFilter
            value={filters.rep}
            onChange={(v) => update('rep', v)}
            options={[
              { value: '', label: 'All Reps' },
              ...reps.map((r) => ({ value: r.id, label: r.name })),
            ]}
          />
          <SelectFilter
            value={filters.healthTier}
            onChange={(v) => update('healthTier', v)}
            options={HEALTH_TIERS}
          />
          <SelectFilter
            value={filters.vmi}
            onChange={(v) => update('vmi', v)}
            options={[
              { value: '', label: 'VMI: All' },
              { value: 'yes', label: 'VMI Enrolled' },
              { value: 'no', label: 'Not Enrolled' },
            ]}
          />
          <SelectFilter
            value={filters.payment}
            onChange={(v) => update('payment', v)}
            options={PAYMENT_OPTIONS}
          />
          <SelectFilter
            value={filters.category}
            onChange={(v) => update('category', v)}
            options={CATEGORIES}
          />
          {activeCount > 0 && (
            <button
              onClick={() => onFiltersChange(DEFAULT_FILTERS)}
              className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-text-muted hover:text-text-default"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  );
}
