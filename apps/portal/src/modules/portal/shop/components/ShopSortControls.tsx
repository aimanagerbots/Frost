'use client';

import { ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ShopSortOption =
  | 'popular'
  | 'price-asc'
  | 'price-desc'
  | 'newest'
  | 'name-asc';

const SORT_OPTIONS: { value: ShopSortOption; label: string }[] = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'newest', label: 'Newest' },
  { value: 'name-asc', label: 'Name A–Z' },
];

interface ShopSortControlsProps {
  value: ShopSortOption;
  onChange: (value: ShopSortOption) => void;
  className?: string;
}

export function ShopSortControls({
  value,
  onChange,
  className,
}: ShopSortControlsProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <ArrowUpDown className="h-4 w-4 text-text-muted shrink-0" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ShopSortOption)}
        className="rounded-lg border border-border-default bg-elevated px-3 py-2 text-sm text-text-default transition-colors focus:border-accent-primary/50 focus:outline-none"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
