'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SALES_REPS } from '@/mocks/sales';
import type { SalesRepReportFilters, DateQuickLink } from '../types';

const ACCENT = '#F59E0B';

interface ReportFiltersProps {
  filters: SalesRepReportFilters;
  onChange: (filters: SalesRepReportFilters) => void;
  onSearch: () => void;
  onReset: () => void;
}

const DATE_QUICK_LINKS: { key: DateQuickLink; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'today', label: 'Today' },
  { key: 'yesterday', label: 'Yesterday' },
  { key: 'last7', label: 'Last 7 Days' },
  { key: 'last10', label: 'Last 10 Days' },
  { key: 'last15', label: 'Last 15 Days' },
  { key: 'weekToDate', label: 'Week To Date' },
  { key: 'monthToDate', label: 'Month To Date' },
  { key: 'yearToDate', label: 'Year To Date' },
];

const CLIENT_STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
] as const;

function getDateRange(quick: DateQuickLink): { from: string; to: string } {
  const today = new Date('2026-03-12');
  const fmt = (d: Date) => d.toISOString().split('T')[0];
  const to = fmt(today);

  switch (quick) {
    case 'today':
      return { from: to, to };
    case 'yesterday': {
      const y = new Date(today);
      y.setDate(y.getDate() - 1);
      return { from: fmt(y), to: fmt(y) };
    }
    case 'last7': {
      const d = new Date(today);
      d.setDate(d.getDate() - 7);
      return { from: fmt(d), to };
    }
    case 'last10': {
      const d = new Date(today);
      d.setDate(d.getDate() - 10);
      return { from: fmt(d), to };
    }
    case 'last15': {
      const d = new Date(today);
      d.setDate(d.getDate() - 15);
      return { from: fmt(d), to };
    }
    case 'weekToDate': {
      const d = new Date(today);
      d.setDate(d.getDate() - d.getDay());
      return { from: fmt(d), to };
    }
    case 'monthToDate': {
      const d = new Date(today.getFullYear(), today.getMonth(), 1);
      return { from: fmt(d), to };
    }
    case 'yearToDate': {
      const d = new Date(today.getFullYear(), 0, 1);
      return { from: fmt(d), to };
    }
    default:
      return { from: '', to: '' };
  }
}

export function ReportFilters({ filters, onChange, onSearch, onReset }: ReportFiltersProps) {
  const [activeQuick, setActiveQuick] = useState<DateQuickLink>('all');
  const [repDropdownOpen, setRepDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setRepDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleQuickLink = (key: DateQuickLink) => {
    setActiveQuick(key);
    const range = getDateRange(key);
    onChange({ ...filters, dateFrom: range.from, dateTo: range.to });
  };

  const toggleRep = (rep: string) => {
    const next = filters.salesPersons.includes(rep)
      ? filters.salesPersons.filter((r) => r !== rep)
      : [...filters.salesPersons, rep];
    onChange({ ...filters, salesPersons: next });
  };

  const inputClass =
    'h-9 rounded-lg border border-default bg-base px-3 text-sm text-text-default placeholder:text-text-muted focus:border-hover focus:outline-none';

  return (
    <div className="space-y-3">
      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="number"
          placeholder="Min Total"
          value={filters.minTotal}
          onChange={(e) => onChange({ ...filters, minTotal: e.target.value })}
          className={cn(inputClass, 'w-28')}
        />
        <input
          type="number"
          placeholder="Max Total"
          value={filters.maxTotal}
          onChange={(e) => onChange({ ...filters, maxTotal: e.target.value })}
          className={cn(inputClass, 'w-28')}
        />

        {/* Sales Persons multi-select */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setRepDropdownOpen(!repDropdownOpen)}
            className={cn(
              inputClass,
              'flex w-56 items-center justify-between gap-2 cursor-pointer'
            )}
          >
            <span className="truncate">
              {filters.salesPersons.length === 0
                ? 'Search by Sales Persons'
                : `${filters.salesPersons.length} selected`}
            </span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-text-muted" />
          </button>
          {repDropdownOpen && (
            <div className="absolute top-full left-0 z-50 mt-1 w-64 rounded-lg border border-default bg-elevated shadow-xl">
              {SALES_REPS.map((rep) => {
                const selected = filters.salesPersons.includes(rep);
                return (
                  <button
                    key={rep}
                    type="button"
                    onClick={() => toggleRep(rep)}
                    className={cn(
                      'flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-card-hover',
                      selected && 'text-amber-400'
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-4 w-4 shrink-0 items-center justify-center rounded border',
                        selected ? 'border-amber-500 bg-amber-500/20' : 'border-default'
                      )}
                    >
                      {selected && <Check className="h-3 w-3" />}
                    </div>
                    {rep}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Client status dropdown */}
        <select
          value={filters.clientStatus}
          onChange={(e) =>
            onChange({
              ...filters,
              clientStatus: e.target.value as SalesRepReportFilters['clientStatus'],
            })
          }
          className={cn(inputClass, 'w-40 cursor-pointer')}
        >
          {CLIENT_STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Date range inputs */}
        <input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => {
            setActiveQuick('all');
            onChange({ ...filters, dateFrom: e.target.value });
          }}
          className={cn(inputClass, 'w-36')}
          placeholder="Order Date From"
        />
        <input
          type="date"
          value={filters.dateTo}
          onChange={(e) => {
            setActiveQuick('all');
            onChange({ ...filters, dateTo: e.target.value });
          }}
          className={cn(inputClass, 'w-36')}
          placeholder="Order Date To"
        />

        {/* Show Cancelled toggle */}
        <label className="flex items-center gap-2 text-sm text-text-muted cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.showCancelled}
            onChange={(e) => onChange({ ...filters, showCancelled: e.target.checked })}
            className="h-4 w-4 rounded border-default accent-amber-500"
          />
          Show Cancelled
        </label>

        {/* Search button */}
        <button
          type="button"
          onClick={onSearch}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-white transition-colors hover:opacity-90"
          style={{ backgroundColor: ACCENT }}
          title="Search"
        >
          <Search className="h-4 w-4" />
        </button>

        {/* Reset button */}
        <button
          type="button"
          onClick={onReset}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-default bg-base text-text-muted transition-colors hover:bg-card-hover"
          title="Reset filters"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Quick date links */}
      <div className="flex flex-wrap items-center gap-2">
        {DATE_QUICK_LINKS.map((link) => (
          <button
            key={link.key}
            type="button"
            onClick={() => handleQuickLink(link.key)}
            className={cn(
              'rounded-md border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition-colors',
              activeQuick === link.key
                ? 'border-amber-500 bg-amber-500/15 text-amber-400'
                : 'border-default bg-base text-text-muted hover:bg-card-hover hover:text-text-default'
            )}
          >
            {link.label}
          </button>
        ))}
      </div>
    </div>
  );
}
