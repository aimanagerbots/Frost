'use client';

import { cn } from '@/lib/utils';
import { StatusBadge, DataTable, EmptyState, LoadingSkeleton } from '@/components';
import { BarChart3, FileText, MessageSquare, Star, Tag } from 'lucide-react';
import { useAccountOrders, useAccountDiscounts } from '../hooks';
import type { AccountDetailTab, SalesAccount } from '../types';

interface AccountDetailTabsProps {
  account: SalesAccount;
  activeTab: AccountDetailTab;
  onTabChange: (tab: AccountDetailTab) => void;
}

const ACCENT = '#F59E0B';

const TABS: { key: AccountDetailTab; label: string }[] = [
  { key: 'analytics', label: 'Analytics' },
  { key: 'orders', label: 'Orders' },
  { key: 'notes', label: 'Notes' },
  { key: 'recommendations', label: 'Recommendations' },
  { key: 'discounts', label: 'Discounts' },
];

// ── Analytics Tab ────────────────────────────────────────────────

function AnalyticsTab() {
  const charts = [
    'Sales Month over Month',
    'Top Product-lines Month over Month',
    'Top Sub-product-lines sales Month over Month',
    'Top Products sales Month over Month',
  ];

  return (
    <div className="space-y-6">
      {charts.map((title) => (
        <div key={title} className="rounded-xl border border-default bg-card p-5">
          <h3 className="mb-4 text-center text-sm font-medium text-text-muted">{title}</h3>
          <div className="flex h-40 items-center justify-center">
            <BarChart3 className="h-12 w-12 text-text-muted/30" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Orders Tab ───────────────────────────────────────────────────

function OrdersTab({ accountId }: { accountId: string }) {
  const { data: orders = [], isLoading } = useAccountOrders(accountId);

  if (isLoading) return <LoadingSkeleton variant="table" />;

  type OrderRow = (typeof orders)[number] & Record<string, unknown>;

  const columns: Parameters<typeof DataTable<OrderRow>>[0]['columns'] = [
    {
      header: 'Order #',
      accessor: 'orderNumber' as keyof OrderRow,
      sortable: true,
    },
    {
      header: 'Date',
      accessor: 'submittedDate' as keyof OrderRow,
      sortable: true,
    },
    {
      header: 'Status',
      accessor: 'status' as keyof OrderRow,
      render: (row) => <StatusBadge status={row.status as 'invoiced' | 'paid'} />,
    },
    {
      header: 'Total',
      accessor: 'orderTotal' as keyof OrderRow,
      sortable: true,
      render: (row) => <span>${(row.orderTotal as number).toLocaleString()}</span>,
    },
  ];

  return (
    <DataTable
      data={orders as OrderRow[]}
      columns={columns}
      pageSize={10}
      emptyState={{ title: 'No orders', description: 'No orders for this account yet.', accentColor: ACCENT }}
    />
  );
}

// ── Notes Tab ────────────────────────────────────────────────────

function NotesTab() {
  return (
    <EmptyState
      icon={MessageSquare}
      title="No Notes"
      description="No notes have been added for this account."
      accentColor={ACCENT}
    />
  );
}

// ── Recommendations Tab ──────────────────────────────────────────

function RecommendationsTab() {
  return (
    <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-default bg-card p-8">
      <p className="text-sm italic text-text-muted">recommendation goes here</p>
    </div>
  );
}

// ── Discounts Tab ────────────────────────────────────────────────

function DiscountsTab({ accountId }: { accountId: string }) {
  const { data: discounts = [], isLoading } = useAccountDiscounts(accountId);

  if (isLoading) return <LoadingSkeleton variant="table" />;

  type DiscountRow = (typeof discounts)[number] & Record<string, unknown>;

  const columns: Parameters<typeof DataTable<DiscountRow>>[0]['columns'] = [
    {
      header: 'Product Name',
      accessor: 'productName' as keyof DiscountRow,
      sortable: true,
    },
    {
      header: 'Price',
      accessor: 'price' as keyof DiscountRow,
      sortable: true,
      render: (row) => <span>${(row.price as number).toFixed(2)}</span>,
    },
    {
      header: 'Discount Price',
      accessor: 'discountPrice' as keyof DiscountRow,
      sortable: true,
      render: (row) => <span className="text-green-400">${(row.discountPrice as number).toFixed(2)}</span>,
    },
    {
      header: 'Quantity',
      accessor: 'quantity' as keyof DiscountRow,
      sortable: true,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end">
        <button
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-colors"
          style={{ backgroundColor: ACCENT }}
        >
          Export to Excel
        </button>
      </div>
      <DataTable
        data={discounts as DiscountRow[]}
        columns={columns}
        pageSize={20}
        emptyState={{ title: 'No discounts', description: 'No discounts for this account.', accentColor: ACCENT }}
      />
    </div>
  );
}

// ── Tab Router ───────────────────────────────────────────────────

export function AccountDetailTabs({ account, activeTab, onTabChange }: AccountDetailTabsProps) {
  const TAB_ICONS = { analytics: BarChart3, orders: FileText, notes: MessageSquare, recommendations: Star, discounts: Tag };

  return (
    <div className="flex-1">
      {/* Tab navigation */}
      <div className="flex border-b border-default">
        {TABS.map((tab) => {
          const Icon = TAB_ICONS[tab.key];
          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={cn(
                'flex items-center gap-1.5 border-b-2 px-4 py-3 text-sm font-medium transition-colors',
                activeTab === tab.key
                  ? 'border-current text-amber-400'
                  : 'border-transparent text-text-muted hover:text-text-default'
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="pt-4">
        {activeTab === 'analytics' && <AnalyticsTab />}
        {activeTab === 'orders' && <OrdersTab accountId={account.id} />}
        {activeTab === 'notes' && <NotesTab />}
        {activeTab === 'recommendations' && <RecommendationsTab />}
        {activeTab === 'discounts' && <DiscountsTab accountId={account.id} />}
      </div>
    </div>
  );
}
