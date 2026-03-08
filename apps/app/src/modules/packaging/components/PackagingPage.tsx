'use client';

import { useState, useMemo } from 'react';
import { Package } from 'lucide-react';
import { SectionHeader, MetricCard, DataTable, StatusBadge, LoadingSkeleton, ErrorState } from '@/components';
import { usePackagingOrders, usePackagingMetrics } from '../hooks';
import { MaterialAlerts } from './MaterialAlerts';
import { PackagingDrawer } from './PackagingDrawer';
import { MaterialsInventory } from './MaterialsInventory';
import type { PackagingOrder } from '../types';
import { ACCENT } from '@/design/colors';


const STATUS_MAP: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  queued: 'default',
  'in-progress': 'info',
  completed: 'success',
  'blocked-material': 'danger',
};

const PRIORITY_MAP: Record<string, 'danger' | 'warning' | 'info' | 'muted'> = {
  critical: 'danger',
  high: 'warning',
  medium: 'info',
  low: 'muted',
};

type PkgRow = PackagingOrder & Record<string, unknown>;

const columns = [
  {
    header: 'Product',
    accessor: 'product' as const,
    sortable: true,
    render: (row: PkgRow) => <span className="font-medium text-text-bright">{row.product}</span>,
  },
  {
    header: 'SKU',
    accessor: 'sku' as const,
    sortable: true,
    render: (row: PkgRow) => <span className="text-xs text-text-muted">{row.sku}</span>,
  },
  {
    header: 'Category',
    accessor: 'category' as const,
    sortable: true,
    render: (row: PkgRow) => (
      <span className="inline-flex items-center rounded-full bg-elevated px-2 py-0.5 text-xs text-text-muted capitalize">
        {row.category}
      </span>
    ),
  },
  {
    header: 'Qty',
    accessor: 'quantity' as const,
    sortable: true,
  },
  {
    header: 'Status',
    accessor: 'status' as const,
    sortable: true,
    render: (row: PkgRow) => (
      <StatusBadge variant={STATUS_MAP[row.status] ?? 'default'} label={row.status} size="sm" dot pulse={row.status === 'in-progress'} />
    ),
  },
  {
    header: 'Priority',
    accessor: 'priority' as const,
    sortable: true,
    hideBelow: 'md' as const,
    render: (row: PkgRow) => (
      <StatusBadge variant={PRIORITY_MAP[row.priority] ?? 'muted'} label={row.priority} size="sm" />
    ),
  },
  {
    header: 'Materials',
    accessor: ((row: PkgRow) => {
      const hasShortage = row.nonCannabisMaterials.some((m: { inStock: boolean }) => !m.inStock);
      return hasShortage ? 'Shortage' : 'Ready';
    }) as (row: PkgRow) => unknown,
    render: (row: PkgRow) => {
      const hasShortage = row.nonCannabisMaterials.some((m: { inStock: boolean }) => !m.inStock);
      return (
        <StatusBadge variant={hasShortage ? 'danger' : 'success'} label={hasShortage ? 'Shortage' : 'Ready'} size="sm" />
      );
    },
  },
  {
    header: 'Assignee',
    accessor: 'assignee' as const,
    sortable: true,
    hideBelow: 'md' as const,
  },
  {
    header: 'Est. Time',
    accessor: 'estimatedMinutes' as const,
    sortable: true,
    hideBelow: 'lg' as const,
    render: (row: PkgRow) => <span>{row.estimatedMinutes} min</span>,
  },
];

export function PackagingPage() {
  const { data: orders, isLoading: ordersLoading, error: ordersError, refetch: refetchOrders } = usePackagingOrders();
  const { data: metrics, isLoading: metricsLoading, error: metricsError, refetch: refetchMetrics } = usePackagingMetrics();
  const [selectedOrder, setSelectedOrder] = useState<PackagingOrder | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    if (!statusFilter) return orders;
    return orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  if (metricsLoading) return <LoadingSkeleton variant="card" count={3} />;

  const error = ordersError || metricsError;
  if (error) {
    return (
      <ErrorState
        title="Failed to load packaging data"
        message={error.message}
        onRetry={() => { refetchOrders(); refetchMetrics(); }}
      />
    );
  }

  const statuses = ['queued', 'in-progress', 'completed', 'blocked-material'];

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Package}
        title="Packaging"
        subtitle="Package cannabis products with non-cannabis materials for retail"
        accentColor={ACCENT}
        stats={metrics ? [
          { label: 'Shortages', value: metrics.materialShortages },
          { label: 'Top SKU', value: metrics.topSKU },
        ] : undefined}
      />

      {/* Metrics Row */}
      {metrics && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          <MetricCard label="Total Orders" value={metrics.totalOrders} accentColor={ACCENT} />
          <MetricCard label="Completed Today" value={metrics.completedToday} accentColor={ACCENT} />
          <MetricCard label="In Progress" value={metrics.inProgress} accentColor={ACCENT} />
          <MetricCard
            label="Material Shortages"
            value={metrics.materialShortages}
            accentColor={metrics.materialShortages > 0 ? '#FB7185' : ACCENT}
          />
          <MetricCard label="Packages/Hour" value={metrics.avgPackagesPerHour} accentColor={ACCENT} />
          <MetricCard label="Top SKU" value={metrics.topSKU} accentColor={ACCENT} />
        </div>
      )}

      {/* Material Alerts */}
      <MaterialAlerts />

      {/* Packaging Orders */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text-bright">Packaging Orders</h2>
          <div className="flex gap-1">
            <button
              onClick={() => setStatusFilter(null)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                !statusFilter ? 'text-text-bright' : 'text-text-muted hover:text-text-default hover:bg-accent-hover'
              }`}
              style={!statusFilter ? { backgroundColor: `${ACCENT}20`, color: ACCENT } : undefined}
            >
              All
            </button>
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(prev => prev === s ? null : s)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  statusFilter === s ? 'text-text-bright' : 'text-text-muted hover:text-text-default hover:bg-accent-hover'
                }`}
                style={statusFilter === s ? { backgroundColor: `${ACCENT}20`, color: ACCENT } : undefined}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <DataTable<PkgRow>
          data={filteredOrders as PkgRow[]}
          columns={columns}
          searchable
          searchPlaceholder="Search packaging orders..."
          loading={ordersLoading}
          onRowClick={(row) => setSelectedOrder(row as PackagingOrder)}
          pageSize={10}
          emptyState={{
            icon: Package,
            title: 'No packaging orders',
            description: statusFilter ? `No orders with status "${statusFilter}".` : 'No packaging orders found.',
            accentColor: ACCENT,
          }}
        />
      </div>

      {/* Non-Cannabis Inventory */}
      <MaterialsInventory />

      {/* Order Drawer */}
      <PackagingDrawer
        order={selectedOrder}
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}
