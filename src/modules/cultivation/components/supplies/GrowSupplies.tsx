'use client';

import { useState, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { DataTable, DrawerPanel, StatusBadge, LoadingSkeleton, ErrorState } from '@/components';
import { useGrowSupplies } from '../../hooks';
import type { GrowSupply, SupplyCategory, SupplyStatus } from '../../types';
import {
  AlertTriangle,
  PackageOpen,
  ShoppingCart,
  Beaker,
  Filter,
} from 'lucide-react';

const ACCENT = '#22C55E';

const CATEGORY_COLORS: Record<SupplyCategory, string> = {
  nutrient: '#22C55E',
  'soil-media': '#8B5CF6',
  ipm: '#3B82F6',
  equipment: '#F59E0B',
  container: '#06B6D4',
  environmental: '#64748B',
  cleaning: '#94A3B8',
  other: '#475569',
};

const CATEGORY_LABELS: Record<SupplyCategory, string> = {
  nutrient: 'Nutrient',
  'soil-media': 'Soil / Media',
  ipm: 'IPM',
  equipment: 'Equipment',
  container: 'Container',
  environmental: 'Environmental',
  cleaning: 'Cleaning',
  other: 'Other',
};

const STATUS_VARIANT: Record<SupplyStatus, 'success' | 'warning' | 'danger'> = {
  'in-stock': 'success',
  low: 'warning',
  critical: 'danger',
  'out-of-stock': 'danger',
};

const STATUS_LABELS: Record<SupplyStatus, string> = {
  'in-stock': 'In Stock',
  low: 'Low',
  critical: 'Critical',
  'out-of-stock': 'Out of Stock',
};

const ALL_CATEGORIES: SupplyCategory[] = [
  'nutrient', 'soil-media', 'ipm', 'equipment', 'container', 'environmental', 'cleaning', 'other',
];

const ALL_STATUSES: SupplyStatus[] = ['in-stock', 'low', 'critical', 'out-of-stock'];

export function GrowSupplies() {
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedSupply, setSelectedSupply] = useState<GrowSupply | null>(null);

  const filters = useMemo(() => ({
    ...(categoryFilter && { category: categoryFilter }),
    ...(statusFilter && { status: statusFilter }),
  }), [categoryFilter, statusFilter]);

  const { data: supplies, isLoading, isError, refetch } = useGrowSupplies(
    Object.keys(filters).length > 0 ? filters : undefined
  );

  const alertSupplies = useMemo(() => {
    if (!supplies) return [];
    return supplies.filter(
      (s) => s.status === 'low' || s.status === 'critical' || s.status === 'out-of-stock'
    );
  }, [supplies]);

  const handleRowClick = useCallback((row: Record<string, unknown>) => {
    setSelectedSupply(row as unknown as GrowSupply);
  }, []);

  if (isLoading) return <LoadingSkeleton variant="table" />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;
  if (!supplies) return null;

  const columns = [
    {
      header: 'Name',
      accessor: 'name' as const,
      sortable: true,
      render: (row: Record<string, unknown>) => (
        <span className="font-medium text-text-bright">{row.name as string}</span>
      ),
    },
    {
      header: 'Category',
      accessor: 'category' as const,
      sortable: true,
      render: (row: Record<string, unknown>) => {
        const cat = row.category as SupplyCategory;
        return (
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium"
            style={{
              backgroundColor: `${CATEGORY_COLORS[cat]}15`,
              color: CATEGORY_COLORS[cat],
            }}
          >
            {CATEGORY_LABELS[cat]}
          </span>
        );
      },
    },
    {
      header: 'Stock',
      accessor: 'currentStock' as const,
      sortable: true,
      render: (row: Record<string, unknown>) => {
        const stock = row.currentStock as number;
        const reorder = row.reorderPoint as number;
        return (
          <span className={cn('font-mono', stock < reorder && 'font-bold text-danger')}>
            {stock}
          </span>
        );
      },
    },
    {
      header: 'Unit',
      accessor: 'unit' as const,
    },
    {
      header: 'Reorder Pt',
      accessor: 'reorderPoint' as const,
      sortable: true,
      hideBelow: 'md' as const,
    },
    {
      header: 'Status',
      accessor: 'status' as const,
      sortable: true,
      render: (row: Record<string, unknown>) => {
        const status = row.status as SupplyStatus;
        return (
          <StatusBadge
            variant={STATUS_VARIANT[status]}
            label={STATUS_LABELS[status]}
            size="sm"
            dot
            pulse={status === 'out-of-stock'}
          />
        );
      },
    },
    {
      header: 'Cost/Unit',
      accessor: 'costPerUnit' as const,
      sortable: true,
      hideBelow: 'md' as const,
      render: (row: Record<string, unknown>) => (
        <span className="font-mono text-text-default">
          ${(row.costPerUnit as number).toFixed(2)}
        </span>
      ),
    },
    {
      header: 'Supplier',
      accessor: 'supplier' as const,
      sortable: true,
      hideBelow: 'lg' as const,
    },
    {
      header: 'Mix Ratio',
      accessor: 'mixRatio' as const,
      hideBelow: 'lg' as const,
      render: (row: Record<string, unknown>) => (
        <span className="text-text-muted">{(row.mixRatio as string) || '-'}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Alerts Banner */}
      {alertSupplies.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-warning">
            <AlertTriangle className="h-4 w-4" />
            {alertSupplies.length} supply alert{alertSupplies.length !== 1 ? 's' : ''}
          </div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
            {alertSupplies.slice(0, 6).map((supply) => (
              <div
                key={supply.id}
                className={cn(
                  'flex items-center justify-between rounded-lg border p-3',
                  supply.status === 'out-of-stock'
                    ? 'border-danger/30 bg-danger/5'
                    : supply.status === 'critical'
                    ? 'border-danger/20 bg-danger/5'
                    : 'border-warning/20 bg-warning/5'
                )}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-text-bright">{supply.name}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs text-text-muted">
                      Stock: {supply.currentStock} {supply.unit}
                    </span>
                    <StatusBadge
                      variant={STATUS_VARIANT[supply.status]}
                      label={STATUS_LABELS[supply.status]}
                      size="sm"
                      dot
                      pulse={supply.status === 'out-of-stock'}
                    />
                  </div>
                </div>
                <button
                  className="ml-3 shrink-0 rounded-lg border border-default bg-elevated px-3 py-1.5 text-xs font-medium text-text-bright transition-colors hover:bg-card-hover"
                >
                  <ShoppingCart className="mr-1 inline h-3 w-3" />
                  Order More
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <Filter className="h-4 w-4 text-text-muted" />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-default bg-base px-3 py-2 text-sm text-text-default focus:border-hover focus:outline-none"
        >
          <option value="">All Categories</option>
          {ALL_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-default bg-base px-3 py-2 text-sm text-text-default focus:border-hover focus:outline-none"
        >
          <option value="">All Statuses</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>

      {/* Data Table */}
      <DataTable
        data={(supplies as unknown as Record<string, unknown>[]) ?? []}
        columns={columns}
        searchable
        searchPlaceholder="Search supplies..."
        onRowClick={handleRowClick}
        emptyState={{
          icon: PackageOpen,
          title: 'No supplies found',
          description: 'No grow supplies match your current filters.',
          accentColor: ACCENT,
        }}
        pageSize={12}
      />

      {/* Supply Detail Drawer */}
      <DrawerPanel
        open={!!selectedSupply}
        onClose={() => setSelectedSupply(null)}
        title={selectedSupply?.name ?? 'Supply Detail'}
        width="md"
        footer={
          <button
            className="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: ACCENT }}
          >
            <ShoppingCart className="h-4 w-4" />
            Order More
          </button>
        }
      >
        {selectedSupply && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Beaker className="h-5 w-5" style={{ color: CATEGORY_COLORS[selectedSupply.category] }} />
              <span
                className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                style={{
                  backgroundColor: `${CATEGORY_COLORS[selectedSupply.category]}15`,
                  color: CATEGORY_COLORS[selectedSupply.category],
                }}
              >
                {CATEGORY_LABELS[selectedSupply.category]}
              </span>
              <StatusBadge
                variant={STATUS_VARIANT[selectedSupply.status]}
                label={STATUS_LABELS[selectedSupply.status]}
                size="sm"
                dot
                pulse={selectedSupply.status === 'out-of-stock'}
              />
            </div>

            <div className="rounded-xl border border-default bg-elevated p-4">
              <h3 className="mb-3 text-sm font-semibold text-text-bright">Stock Info</h3>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <span className="text-text-muted">Current Stock</span>
                <span className={cn('text-right font-medium', selectedSupply.currentStock < selectedSupply.reorderPoint ? 'text-danger' : 'text-text-bright')}>
                  {selectedSupply.currentStock} {selectedSupply.unit}
                </span>
                <span className="text-text-muted">Reorder Point</span>
                <span className="text-right font-medium text-text-bright">{selectedSupply.reorderPoint} {selectedSupply.unit}</span>
                <span className="text-text-muted">Reorder Qty</span>
                <span className="text-right font-medium text-text-bright">{selectedSupply.reorderQuantity} {selectedSupply.unit}</span>
                <span className="text-text-muted">Cost / Unit</span>
                <span className="text-right font-medium text-text-bright">${selectedSupply.costPerUnit.toFixed(2)}</span>
              </div>
            </div>

            <div className="rounded-xl border border-default bg-elevated p-4">
              <h3 className="mb-3 text-sm font-semibold text-text-bright">Supplier</h3>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <span className="text-text-muted">Supplier</span>
                <span className="text-right font-medium text-text-bright">{selectedSupply.supplier}</span>
                {selectedSupply.lastOrderDate && (
                  <>
                    <span className="text-text-muted">Last Ordered</span>
                    <span className="text-right font-medium text-text-bright">{selectedSupply.lastOrderDate}</span>
                  </>
                )}
              </div>
            </div>

            {(selectedSupply.mixRatio || selectedSupply.applicationFrequency) && (
              <div className="rounded-xl border border-default bg-elevated p-4">
                <h3 className="mb-3 text-sm font-semibold text-text-bright">Usage</h3>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  {selectedSupply.mixRatio && (
                    <>
                      <span className="text-text-muted">Mix Ratio</span>
                      <span className="text-right font-medium text-text-bright">{selectedSupply.mixRatio}</span>
                    </>
                  )}
                  {selectedSupply.applicationFrequency && (
                    <>
                      <span className="text-text-muted">Frequency</span>
                      <span className="text-right font-medium text-text-bright">{selectedSupply.applicationFrequency}</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {selectedSupply.subcategory && (
              <div className="text-sm text-text-muted">
                Subcategory: <span className="text-text-default">{selectedSupply.subcategory}</span>
              </div>
            )}
          </div>
        )}
      </DrawerPanel>
    </div>
  );
}
