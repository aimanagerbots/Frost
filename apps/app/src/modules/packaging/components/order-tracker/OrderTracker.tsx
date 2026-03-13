'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { LoadingSkeleton } from '@/components';
import { usePackagingOrders } from '../../hooks';
import { OrderRow } from './OrderRow';
import type { PackagingOrder } from '../../types';

const ACCENT = '#84CC16';

const CATEGORY_FILTERS = [
  { value: '', label: 'All' },
  { value: 'flower', label: 'Flower' },
  { value: 'preroll', label: 'Preroll' },
  { value: 'vaporizer', label: 'Vaporizer' },
  { value: 'concentrate', label: 'Concentrate' },
  { value: 'edible', label: 'Edible' },
  { value: 'beverage', label: 'Beverage' },
] as const;

const STATUS_FILTERS = [
  { value: '', label: 'All' },
  { value: 'queued', label: 'Queued' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'blocked-material', label: 'Blocked' },
] as const;

export function OrderTracker() {
  const { data: orders, isLoading } = usePackagingOrders();
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const filtered = useMemo((): PackagingOrder[] => {
    if (!orders) return [];
    let result = [...orders];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.product.toLowerCase().includes(q) ||
          o.sku.toLowerCase().includes(q) ||
          o.id.toLowerCase().includes(q) ||
          o.assignee.toLowerCase().includes(q)
      );
    }
    if (filterCategory) result = result.filter((o) => o.category === filterCategory);
    if (filterStatus) result = result.filter((o) => o.status === filterStatus);

    return result;
  }, [orders, search, filterCategory, filterStatus]);

  if (isLoading) return <LoadingSkeleton variant="card" count={8} />;

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders, SKUs, assignees…"
            className="w-full rounded-xl bg-card py-1.5 pl-8 pr-3 text-xs text-text-default placeholder:text-text-muted outline-none ring-1 ring-transparent focus:ring-1"
            style={{ '--tw-ring-color': ACCENT } as React.CSSProperties}
          />
        </div>

        {/* Order count */}
        <span className="text-xs text-text-muted shrink-0">
          <span className="font-medium text-text-bright">{filtered.length}</span> orders
        </span>
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        {CATEGORY_FILTERS.map((f) => {
          const active = filterCategory === f.value;
          return (
            <button
              key={f.value}
              onClick={() => setFilterCategory(f.value)}
              className="rounded-full px-2.5 py-1 text-xs font-medium transition-colors"
              style={
                active
                  ? { backgroundColor: `${ACCENT}20`, color: ACCENT }
                  : { backgroundColor: 'transparent', color: '#64748B' }
              }
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Status filter pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        {STATUS_FILTERS.map((f) => {
          const active = filterStatus === f.value;
          return (
            <button
              key={f.value}
              onClick={() => setFilterStatus(f.value)}
              className="rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors"
              style={
                active
                  ? { borderColor: ACCENT, backgroundColor: `${ACCENT}10`, color: ACCENT }
                  : { borderColor: '#1e293b', color: '#64748B' }
              }
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Order rows */}
      {filtered.length === 0 ? (
        <div className="flex h-40 items-center justify-center rounded-xl border border-default bg-card">
          <p className="text-sm text-text-muted">No orders match your filters</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((order) => (
            <OrderRow key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
