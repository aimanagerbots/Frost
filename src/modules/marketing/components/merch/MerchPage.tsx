'use client';

import { useState } from 'react';
import {
  SectionHeader,
  MetricCard,
  DataTable,
  LoadingSkeleton,
  ErrorState,
  EmptyState,
} from '@/components';
import { ShoppingBag, AlertTriangle, Package } from 'lucide-react';
import { useMerchItems } from '../../hooks/seo-events-hooks';
import type { MerchItem } from '../../types/seo-events';

const ACCENT = '#EC4899';

const CATEGORY_COLORS: Record<string, string> = {
  apparel: '#8B5CF6',
  accessories: '#06B6D4',
  stickers: '#EC4899',
  containers: '#F59E0B',
  misc: '#64748B',
};

function StockIndicator({ stock }: { stock: number }) {
  const color = stock === 0 ? '#FB7185' : stock < 10 ? '#FBBF24' : '#00E5A0';
  const label = stock === 0 ? 'Out of Stock' : stock < 10 ? 'Low Stock' : 'In Stock';
  return (
    <div className="flex items-center gap-1.5">
      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-[11px]" style={{ color }}>{label}</span>
    </div>
  );
}

function MerchCard({ item }: { item: MerchItem }) {
  const catColor = CATEGORY_COLORS[item.category] ?? ACCENT;
  return (
    <div className="rounded-xl border border-default bg-card p-4 transition-all hover:bg-card-hover">
      {/* Image placeholder */}
      <div className="flex h-24 items-center justify-center rounded-lg bg-elevated mb-3">
        <Package className="h-8 w-8 text-text-muted" />
      </div>
      <h3 className="text-sm font-semibold text-text-bright line-clamp-2">{item.name}</h3>
      <div className="mt-1.5 flex items-center gap-2">
        <span className="rounded-full px-2 py-0.5 text-[11px] font-medium" style={{ backgroundColor: `${catColor}20`, color: catColor }}>
          {item.category}
        </span>
        <StockIndicator stock={item.stock} />
      </div>
      <p className="mt-2 text-xs text-text-muted line-clamp-2">{item.imageDescription}</p>
      <div className="mt-3 grid grid-cols-3 gap-2 border-t border-default pt-2.5">
        <div className="text-center">
          <p className="text-sm font-semibold text-text-bright">{item.stock}</p>
          <span className="text-[11px] text-text-muted">In Stock</span>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-text-bright">{item.distributed}</p>
          <span className="text-[11px] text-text-muted">Distributed</span>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-text-bright">${item.costPerUnit.toFixed(2)}</p>
          <span className="text-[11px] text-text-muted">Cost/Unit</span>
        </div>
      </div>
    </div>
  );
}

interface DistributionRow extends Record<string, unknown> {
  item: string;
  recipient: string;
  date: string;
  quantity: number;
}

export function MerchPage() {
  const { data: items, isLoading, error, refetch } = useMerchItems();
  const [view, setView] = useState<'grid' | 'log'>('grid');

  if (isLoading) return <LoadingSkeleton variant="card" count={4} />;
  if (error) return <ErrorState title="Failed to load merchandise" message={error.message} onRetry={refetch} />;
  if (!items || items.length === 0) {
    return (
      <div className="space-y-6">
        <SectionHeader icon={ShoppingBag} title="Merchandise" accentColor={ACCENT} />
        <EmptyState icon={ShoppingBag} title="No merchandise" description="Add branded merchandise items." accentColor={ACCENT} />
      </div>
    );
  }

  const totalItems = items.length;
  const inStock = items.filter((i) => i.stock > 0).length;
  const outOfStock = items.filter((i) => i.stock === 0).length;
  const totalDistributed = items.reduce((sum, i) => sum + i.distributed, 0);
  const inventoryValue = items.reduce((sum, i) => sum + i.stock * i.costPerUnit, 0);

  // Build distribution log
  const distLog: DistributionRow[] = items.flatMap((item) =>
    item.distributedTo.map((d) => ({
      item: item.name,
      recipient: d.accountName ?? d.event ?? 'Unknown',
      date: d.date,
      quantity: d.quantity,
    }))
  ).sort((a, b) => b.date.localeCompare(a.date));

  const distColumns = [
    { header: 'Item', accessor: 'item' as const, sortable: true },
    { header: 'Recipient', accessor: 'recipient' as const, sortable: true },
    { header: 'Date', accessor: 'date' as const, sortable: true },
    { header: 'Qty', accessor: 'quantity' as const, sortable: true },
  ];

  // Reorder items
  const reorderItems = items.filter((i) => i.stock <= 10);

  return (
    <div className="space-y-6">
      <SectionHeader icon={ShoppingBag} title="Merchandise" subtitle="Branded merchandise inventory and distribution tracking" accentColor={ACCENT} />

      {/* Compliance Note */}
      <div className="flex items-start gap-3 rounded-xl border border-warning/30 bg-warning/10 p-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 text-warning" />
        <p className="text-xs text-text-muted">
          <span className="font-medium text-warning">WSLCB Notice:</span> Washington prohibits promotional giveaways of branded cannabis merchandise. Distribution tracking is for internal/event use only.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <MetricCard label="Total Items" value={totalItems} accentColor={ACCENT} />
        <MetricCard label="In Stock" value={inStock} accentColor={ACCENT} />
        <MetricCard label="Out of Stock" value={outOfStock} accentColor={outOfStock > 0 ? '#FB7185' : ACCENT} />
        <MetricCard label="Total Distributed" value={totalDistributed.toLocaleString()} accentColor={ACCENT} />
        <MetricCard label="Inventory Value" value={`$${inventoryValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} accentColor={ACCENT} />
      </div>

      {/* View Toggle */}
      <div className="flex gap-2">
        <button
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${view === 'grid' ? 'bg-elevated text-text-bright' : 'text-text-muted hover:text-text-bright'}`}
          onClick={() => setView('grid')}
        >
          Inventory Grid
        </button>
        <button
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${view === 'log' ? 'bg-elevated text-text-bright' : 'text-text-muted hover:text-text-bright'}`}
          onClick={() => setView('log')}
        >
          Distribution Log
        </button>
      </div>

      {view === 'grid' ? (
        <>
          {/* Merch Grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => (
              <MerchCard key={item.id} item={item} />
            ))}
          </div>

          {/* Reorder Section */}
          {reorderItems.length > 0 && (
            <div>
              <h2 className="mb-3 text-sm font-semibold text-warning">Needs Reorder</h2>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {reorderItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-xl border border-warning/30 bg-card p-3">
                    <div>
                      <p className="text-sm font-medium text-text-bright">{item.name}</p>
                      <p className="text-xs text-text-muted">{item.stock} remaining · {item.distributed} distributed</p>
                    </div>
                    <button className="rounded-lg border border-default px-3 py-1.5 text-xs font-medium text-text-bright transition-colors hover:bg-elevated">
                      Reorder
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        /* Distribution Log */
        <DataTable<DistributionRow>
          data={distLog}
          columns={distColumns}
          searchable
          searchPlaceholder="Search by item or recipient..."
          pageSize={15}
          emptyState={{ icon: ShoppingBag, title: 'No distributions', accentColor: ACCENT }}
        />
      )}
    </div>
  );
}
