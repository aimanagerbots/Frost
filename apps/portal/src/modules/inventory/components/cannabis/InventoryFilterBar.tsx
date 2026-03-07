'use client';

import type { InventoryFilter, ProductCategory, ReadinessState, Brand, COAStatus } from '@/modules/inventory/types';

interface InventoryFilterBarProps {
  filters: InventoryFilter;
  onFilterChange: (filters: InventoryFilter) => void;
}

const selectClass =
  'rounded-lg border border-default bg-elevated px-2.5 py-1.5 text-xs text-text-default outline-none focus:border-hover';

const READINESS_STATES: ReadinessState[] = [
  'growing', 'harvested', 'dried', 'bucked', 'trimmed', 'bulk-ready',
  'coa-pending', 'coa-passed', 'packaged', 'fulfilled', 'delivered',
];

export function InventoryFilterBar({ filters, onFilterChange }: InventoryFilterBarProps) {
  function set(patch: Partial<InventoryFilter>) {
    onFilterChange({ ...filters, ...patch });
  }

  const hasFilters = Object.values(filters).some((v) => v !== undefined && v !== '');

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select value={filters.category ?? ''} onChange={(e) => set({ category: (e.target.value || undefined) as ProductCategory | undefined })} className={selectClass}>
        <option value="">All Categories</option>
        <option value="flower">Flower</option>
        <option value="preroll">Preroll</option>
        <option value="vaporizer">Vaporizer</option>
        <option value="concentrate">Concentrate</option>
        <option value="edible">Edible</option>
        <option value="beverage">Beverage</option>
      </select>

      <select value={filters.readinessState ?? ''} onChange={(e) => set({ readinessState: (e.target.value || undefined) as ReadinessState | undefined })} className={selectClass}>
        <option value="">All States</option>
        {READINESS_STATES.map((s) => (
          <option key={s} value={s}>{s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Search strain..."
        value={filters.strain ?? ''}
        onChange={(e) => set({ strain: e.target.value || undefined })}
        className={`${selectClass} w-32`}
      />

      <select value={filters.brand ?? ''} onChange={(e) => set({ brand: (e.target.value || undefined) as Brand | undefined })} className={selectClass}>
        <option value="">All Brands</option>
        <option value="Frost Farms">Frost Farms</option>
        <option value="Glacier Extracts">Glacier Extracts</option>
        <option value="Northern Lights Co.">Northern Lights Co.</option>
      </select>

      <select value={filters.coaStatus ?? ''} onChange={(e) => set({ coaStatus: (e.target.value || undefined) as COAStatus | undefined })} className={selectClass}>
        <option value="">COA Status</option>
        <option value="not-tested">Not Tested</option>
        <option value="pending">Pending</option>
        <option value="passed">Passed</option>
        <option value="failed">Failed</option>
      </select>

      <select value={filters.stockLevel ?? 'all'} onChange={(e) => set({ stockLevel: e.target.value === 'all' ? undefined : e.target.value as InventoryFilter['stockLevel'] })} className={selectClass}>
        <option value="all">All Stock</option>
        <option value="in-stock">In Stock</option>
        <option value="low-stock">Low Stock</option>
        <option value="out-of-stock">Out of Stock</option>
      </select>

      <div className="flex items-center gap-1">
        <span className="text-[10px] text-text-muted">THC:</span>
        <input
          type="number"
          placeholder="Min"
          value={filters.thcMin ?? ''}
          onChange={(e) => set({ thcMin: e.target.value ? Number(e.target.value) : undefined })}
          className={`${selectClass} w-16`}
        />
        <span className="text-text-muted">-</span>
        <input
          type="number"
          placeholder="Max"
          value={filters.thcMax ?? ''}
          onChange={(e) => set({ thcMax: e.target.value ? Number(e.target.value) : undefined })}
          className={`${selectClass} w-16`}
        />
      </div>

      {hasFilters && (
        <button onClick={() => onFilterChange({})} className="text-xs text-info hover:underline">
          Clear filters
        </button>
      )}
    </div>
  );
}
