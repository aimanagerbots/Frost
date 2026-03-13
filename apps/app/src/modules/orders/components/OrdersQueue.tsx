'use client';

import { useState } from 'react';
import { ClipboardList, Filter, Search } from 'lucide-react';
import { DataTable, StatusBadge, LoadingSkeleton, ErrorState } from '@/components';
import type { DomainStatus } from '@/components/StatusBadge';
import type { SalesOrder, SalesOrderStatus } from '@/modules/sales/types';
import { useSalesOrders, useSalesOrderCounts } from '../hooks/useSalesOrders';
import type { SalesOrderFilter, SalesOrderStatusTab } from '../hooks/useSalesOrders';
import { OrderStatusTabs } from './OrderStatusTabs';
import { OrderQuickFiltersModal } from './OrderQuickFiltersModal';

const SALES_STATUS_TO_DOMAIN: Record<SalesOrderStatus, DomainStatus> = {
  submitted: 'pending',
  'partially-sublotted': 'processing',
  sublotted: 'processing',
  manifested: 'shipped',
  quarantined: 'review',
  invoiced: 'invoiced',
  paid: 'paid',
};

// Extend SalesOrder with index signature for DataTable compatibility
type TableSalesOrder = SalesOrder & Record<string, unknown>;

function toTableOrder(order: SalesOrder): TableSalesOrder {
  return { ...order } as TableSalesOrder;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '--';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatShortDate(dateStr?: string): string {
  if (!dateStr) return '--';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function OrdersQueue() {
  const [activeStatusTab, setActiveStatusTab] = useState<SalesOrderStatusTab>('all');
  const [filters, setFilters] = useState<SalesOrderFilter>({});
  const [showQuickFilters, setShowQuickFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Combine status tab with other filters
  const combinedFilters: SalesOrderFilter = {
    ...filters,
    status: activeStatusTab === 'all' ? undefined : activeStatusTab,
    search: searchTerm || undefined,
  };

  const { data: orders, isLoading, error, refetch } = useSalesOrders(combinedFilters);
  const { data: counts } = useSalesOrderCounts();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton variant="card" count={1} />
        <LoadingSkeleton variant="table" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load sales orders"
        message={error.message}
        onRetry={() => refetch()}
      />
    );
  }

  const tableData = (orders ?? []).map(toTableOrder);

  const tableColumns = [
    {
      header: 'Order #',
      accessor: 'orderNumber' as const,
      sortable: true,
      render: (row: TableSalesOrder) => (
        <span className="text-sm font-medium text-text-bright">{row.orderNumber}</span>
      ),
    },
    {
      header: 'Submitted By',
      accessor: 'submittedBy' as const,
      sortable: true,
      hideBelow: 'lg' as const,
      render: (row: TableSalesOrder) => (
        <span className="text-sm text-text-default">{row.submittedBy}</span>
      ),
    },
    {
      header: 'Submitted',
      accessor: 'submittedDate' as const,
      sortable: true,
      hideBelow: 'md' as const,
      render: (row: TableSalesOrder) => (
        <span className="text-sm text-text-muted">{formatShortDate(row.submittedDate)}</span>
      ),
    },
    {
      header: 'Client',
      accessor: 'clientName' as const,
      sortable: true,
      render: (row: TableSalesOrder) => (
        <span className="text-sm font-medium text-text-default">{row.clientName}</span>
      ),
    },
    {
      header: 'City',
      accessor: 'city' as const,
      sortable: true,
      hideBelow: 'lg' as const,
      render: (row: TableSalesOrder) => (
        <span className="text-sm text-text-muted">{row.city}</span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status' as const,
      sortable: true,
      render: (row: TableSalesOrder) => (
        <StatusBadge
          status={SALES_STATUS_TO_DOMAIN[row.status]}
          label={row.status.replace(/-/g, ' ')}
          size="sm"
        />
      ),
    },
    {
      header: 'Manifest Date',
      accessor: 'manifestedDate' as const,
      sortable: true,
      hideBelow: 'md' as const,
      render: (row: TableSalesOrder) => (
        <span className="text-sm text-text-muted">{formatDate(row.manifestedDate)}</span>
      ),
    },
    {
      header: 'Est. Delivery',
      accessor: 'estDeliveryDate' as const,
      sortable: true,
      hideBelow: 'md' as const,
      render: (row: TableSalesOrder) => (
        <span className="text-sm text-text-muted">{formatDate(row.estDeliveryDate)}</span>
      ),
    },
    {
      header: 'Released',
      accessor: 'releasedDate' as const,
      sortable: true,
      hideBelow: 'lg' as const,
      render: (row: TableSalesOrder) => (
        <span className="text-sm text-text-muted">{formatDate(row.releasedDate)}</span>
      ),
    },
    {
      header: 'Total',
      accessor: 'orderTotal' as const,
      sortable: true,
      render: (row: TableSalesOrder) => (
        <span className="text-sm font-semibold text-text-bright">
          ${row.orderTotal.toLocaleString()}
        </span>
      ),
    },
  ];

  const activeFilterCount = [
    filters.clientName,
    filters.city,
    filters.submittedBy,
    filters.backordersOnly,
    filters.hideReleased,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Status Tabs */}
      <OrderStatusTabs
        activeTab={activeStatusTab}
        onTabChange={setActiveStatusTab}
        counts={counts}
      />

      {/* Toolbar: toggle filters + search */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Toggle checkboxes */}
        <label className="flex items-center gap-1.5 text-xs text-text-default cursor-pointer">
          <input
            type="checkbox"
            checked={!!filters.hideReleased}
            onChange={(e) =>
              setFilters((f) => ({ ...f, hideReleased: e.target.checked || undefined }))
            }
            className="h-3.5 w-3.5 rounded border-default bg-elevated accent-[#F59E0B]"
          />
          Hide Released
        </label>

        <div className="flex-1" />

        {/* Partner Name search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Find order..."
            className="w-52 rounded-lg border border-default bg-elevated py-1.5 pl-8 pr-3 text-xs text-text-default placeholder-text-muted outline-none focus:border-hover"
          />
        </div>

        {/* Quick Filters button */}
        <button
          onClick={() => setShowQuickFilters(true)}
          className="relative flex items-center gap-1.5 rounded-lg border border-default bg-elevated px-3 py-1.5 text-xs font-medium text-text-default transition-colors hover:border-hover hover:text-text-bright"
        >
          <Filter className="h-3.5 w-3.5" />
          Filters
          {activeFilterCount > 0 && (
            <span
              className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white"
              style={{ backgroundColor: '#F59E0B' }}
            >
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Orders Table */}
      <DataTable<TableSalesOrder>
        data={tableData}
        columns={tableColumns}
        searchable={false}
        onRowClick={() => {}}
        pageSize={20}
        emptyState={{
          icon: ClipboardList,
          title: 'No orders found',
          description: 'Try adjusting your filters or search term.',
          accentColor: '#F59E0B',
        }}
      />

      {/* Quick Filters Modal */}
      <OrderQuickFiltersModal
        open={showQuickFilters}
        onClose={() => setShowQuickFilters(false)}
        currentFilters={filters}
        onApply={setFilters}
      />
    </div>
  );
}
