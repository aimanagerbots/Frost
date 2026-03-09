'use client';

import { cn } from '@/lib/utils';

export interface ShopFilters {
  categories: Set<string>;
  strainTypes: Set<string>;
  thcMin: number;
  thcMax: number;
  inStockOnly: boolean;
  onPromotion: boolean;
}

export const DEFAULT_SHOP_FILTERS: ShopFilters = {
  categories: new Set(),
  strainTypes: new Set(),
  thcMin: 0,
  thcMax: 40,
  inStockOnly: false,
  onPromotion: false,
};

interface ShopFilterSidebarProps {
  filters: ShopFilters;
  onFilterChange: (filters: ShopFilters) => void;
  className?: string;
}

const CATEGORY_OPTIONS = [
  { value: 'flower', label: 'Flower' },
  { value: 'prerolls', label: 'Prerolls' },
  { value: 'vaporizers', label: 'Vaporizers' },
  { value: 'concentrates', label: 'Concentrates' },
  { value: 'edibles', label: 'Edibles' },
  { value: 'beverages', label: 'Beverages' },
] as const;

const STRAIN_OPTIONS = [
  { value: 'indica', label: 'Indica' },
  { value: 'sativa', label: 'Sativa' },
  { value: 'hybrid', label: 'Hybrid' },
] as const;

function toggleSet(set: Set<string>, value: string): Set<string> {
  const next = new Set(set);
  if (next.has(value)) {
    next.delete(value);
  } else {
    next.add(value);
  }
  return next;
}

function FilterCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-1">
      <div
        className={cn(
          'flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors',
          checked
            ? 'border-accent-primary bg-accent-primary'
            : 'border-border-default bg-elevated'
        )}
      >
        {checked && (
          <svg
            width="10"
            height="8"
            viewBox="0 0 10 8"
            fill="none"
            className="text-white"
          >
            <path
              d="M1 4L3.5 6.5L9 1"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <span className="text-sm text-text-default">{label}</span>
    </label>
  );
}

function FilterToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between py-1">
      <span className="text-sm text-text-default">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={cn(
          'relative h-5 w-9 rounded-full transition-colors',
          checked ? 'bg-accent-primary' : 'bg-elevated border border-border-default'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform',
            checked && 'translate-x-4'
          )}
        />
      </button>
    </label>
  );
}

export function ShopFilterSidebar({
  filters,
  onFilterChange,
  className,
}: ShopFilterSidebarProps) {
  const updateFilters = (partial: Partial<ShopFilters>) => {
    onFilterChange({ ...filters, ...partial });
  };

  return (
    <aside className={cn('space-y-6', className)}>
      {/* Category */}
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
          Category
        </h4>
        <div className="space-y-0.5">
          {CATEGORY_OPTIONS.map((opt) => (
            <FilterCheckbox
              key={opt.value}
              label={opt.label}
              checked={filters.categories.has(opt.value)}
              onChange={() =>
                updateFilters({
                  categories: toggleSet(filters.categories, opt.value),
                })
              }
            />
          ))}
        </div>
      </div>

      {/* Strain Type */}
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
          Strain Type
        </h4>
        <div className="space-y-0.5">
          {STRAIN_OPTIONS.map((opt) => (
            <FilterCheckbox
              key={opt.value}
              label={opt.label}
              checked={filters.strainTypes.has(opt.value)}
              onChange={() =>
                updateFilters({
                  strainTypes: toggleSet(filters.strainTypes, opt.value),
                })
              }
            />
          ))}
        </div>
      </div>

      {/* THC Range */}
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
          THC Range
        </h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <label className="text-xs text-text-muted w-8">Min</label>
            <input
              type="range"
              min={0}
              max={40}
              step={1}
              value={filters.thcMin}
              onChange={(e) =>
                updateFilters({ thcMin: Number(e.target.value) })
              }
              className="flex-1 accent-accent-primary"
            />
            <span className="w-10 text-right text-xs text-text-default">
              {filters.thcMin}%
            </span>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs text-text-muted w-8">Max</label>
            <input
              type="range"
              min={0}
              max={40}
              step={1}
              value={filters.thcMax}
              onChange={(e) =>
                updateFilters({ thcMax: Number(e.target.value) })
              }
              className="flex-1 accent-accent-primary"
            />
            <span className="w-10 text-right text-xs text-text-default">
              {filters.thcMax}%
            </span>
          </div>
        </div>
      </div>

      {/* Toggles */}
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
          Availability
        </h4>
        <div className="space-y-2">
          <FilterToggle
            label="In Stock Only"
            checked={filters.inStockOnly}
            onChange={() =>
              updateFilters({ inStockOnly: !filters.inStockOnly })
            }
          />
          <FilterToggle
            label="On Promotion"
            checked={filters.onPromotion}
            onChange={() =>
              updateFilters({ onPromotion: !filters.onPromotion })
            }
          />
        </div>
      </div>
    </aside>
  );
}
