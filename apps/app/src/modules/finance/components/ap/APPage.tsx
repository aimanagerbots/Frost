'use client';

import { useState } from 'react';
import { ArrowUpFromLine, DollarSign, Wallet, CalendarClock } from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
} from 'recharts';
import {
  SectionHeader,
  MetricCard,
  DataTable,
  ChartWrapper,
  StatusBadge,
  LoadingSkeleton,
  ErrorState,
  EmptyState,
} from '@/components';
import { CHART_THEME } from '@/components';
import { useVendors, useBills, useAPMetrics } from '@/modules/finance/hooks';
import type { Vendor, Bill, BillStatus } from '@/modules/finance/types';
import { VendorDrawer } from './VendorDrawer';
import { BillDrawer } from './BillDrawer';
import { ACCENT } from '@/design/colors';


const statusVariant = (s: string) => {
  switch (s) {
    case 'paid': return 'success' as const;
    case 'pending': return 'warning' as const;
    case 'overdue': return 'danger' as const;
    default: return 'default' as const;
  }
};

const fmtCurrency = (n: number) => {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n.toLocaleString()}`;
};

const CATEGORY_COLORS: Record<string, string> = {
  'Facilities': '#5BB8E6',
  'Packaging': '#5BB8E6',
  'Cultivation': '#5BB8E6',
  'Utilities': '#5BB8E6',
  'Lab Testing': '#5BB8E6',
  'Vehicle Maintenance': '#5BB8E6',
  'Insurance': '#5BB8E6',
  'Legal': '#EF4444',
  'IT / Software': '#5BB8E6',
};

export function APPage() {
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [billFilter, setBillFilter] = useState<BillStatus | undefined>(undefined);

  const { data: vendors, isLoading: venLoading, isError: venError, refetch } = useVendors();
  const { data: bills, isLoading: billLoading } = useBills(billFilter ? { status: billFilter } : undefined);
  const { data: metrics, isLoading: metLoading } = useAPMetrics();

  if (venError) {
    return (
      <div className="space-y-6">
        <SectionHeader icon={ArrowUpFromLine} title="Accounts Payable" subtitle="Vendor management & bill tracking" accentColor={ACCENT} />
        <ErrorState title="Failed to load AP data" message="Could not fetch accounts payable data." onRetry={() => refetch()} />
      </div>
    );
  }

  // Expense category breakdown from bills
  const categorySpend: Record<string, number> = {};
  bills?.forEach((b) => {
    categorySpend[b.category] = (categorySpend[b.category] ?? 0) + b.amount;
  });
  const categoryData = Object.entries(categorySpend)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Upcoming bills (pending, sorted by due date)
  const upcomingBills = bills
    ?.filter((b) => b.status === 'pending' || b.status === 'overdue')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 6) ?? [];

  const upcomingTotal = upcomingBills.reduce((s, b) => s + b.amount, 0);

  const vendorColumns = [
    { header: 'Vendor', accessor: 'name' as const, sortable: true },
    {
      header: 'Category',
      accessor: 'category' as const,
      sortable: true,
      render: (row: Vendor) => (
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ backgroundColor: `${CATEGORY_COLORS[row.category] ?? '#5BB8E6'}20`, color: CATEGORY_COLORS[row.category] ?? '#5BB8E6' }}
        >
          {row.category}
        </span>
      ),
    },
    { header: 'Terms', accessor: 'paymentTerms' as const, hideBelow: 'md' as const },
    {
      header: 'YTD Spend',
      accessor: 'ytdSpend' as const,
      sortable: true,
      render: (row: Vendor) => <span className="font-mono">${row.ytdSpend.toLocaleString()}</span>,
    },
    {
      header: 'Avg Pay Days',
      accessor: 'avgPaymentDays' as const,
      sortable: true,
      hideBelow: 'lg' as const,
    },
    {
      header: 'Reliability',
      accessor: 'scorecard' as const,
      hideBelow: 'lg' as const,
      render: (row: Vendor) => {
        const r = row.scorecard.reliability;
        const color = r >= 95 ? 'text-green-400' : r >= 85 ? 'text-amber-400' : 'text-red-400';
        return <span className={`font-mono ${color}`}>{r}%</span>;
      },
    },
    { header: 'Last Order', accessor: 'lastOrderDate' as const, hideBelow: 'lg' as const },
  ];

  const billColumns = [
    { header: 'Vendor', accessor: 'vendorName' as const, sortable: true },
    { header: 'Description', accessor: 'description' as const, sortable: true },
    {
      header: 'Amount',
      accessor: 'amount' as const,
      sortable: true,
      render: (row: Bill) => <span className="font-mono">${row.amount.toLocaleString()}</span>,
    },
    {
      header: 'Category',
      accessor: 'category' as const,
      hideBelow: 'md' as const,
      render: (row: Bill) => (
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ backgroundColor: `${CATEGORY_COLORS[row.category] ?? '#5BB8E6'}20`, color: CATEGORY_COLORS[row.category] ?? '#5BB8E6' }}
        >
          {row.category}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status' as const,
      sortable: true,
      render: (row: Bill) => (
        <StatusBadge variant={statusVariant(row.status)} label={row.status} size="sm" dot />
      ),
    },
    { header: 'Issued', accessor: 'issuedDate' as const, hideBelow: 'lg' as const },
    { header: 'Due', accessor: 'dueDate' as const, sortable: true, hideBelow: 'md' as const },
    { header: 'Paid', accessor: 'paidDate' as const, hideBelow: 'lg' as const, render: (row: Bill) => <span>{row.paidDate ?? '—'}</span> },
  ];

  const filterButtons: { label: string; value: BillStatus | undefined }[] = [
    { label: 'All', value: undefined },
    { label: 'Pending', value: 'pending' },
    { label: 'Overdue', value: 'overdue' },
    { label: 'Paid', value: 'paid' },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={ArrowUpFromLine}
        title="Accounts Payable"
        subtitle="Vendor management & bill tracking"
        accentColor={ACCENT}
      />

      {/* Metrics Row */}
      {metLoading ? (
        <LoadingSkeleton variant="card" count={5} />
      ) : metrics ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <MetricCard label="Total AP" value={fmtCurrency(metrics.totalAP)} accentColor={ACCENT} />
          <MetricCard label="Overdue" value={fmtCurrency(metrics.overdueAmount)} accentColor="#EF4444" />
          <MetricCard label="Recurring Monthly" value={fmtCurrency(metrics.recurringMonthly)} accentColor={ACCENT} />
          <MetricCard label="Due This Week" value={fmtCurrency(metrics.upcomingThisWeek)} accentColor="#5BB8E6" />
          <MetricCard label="Vendor Count" value={String(metrics.vendorCount)} accentColor={ACCENT} />
        </div>
      ) : null}

      {/* Upcoming Payments */}
      {upcomingBills.length > 0 && (
        <div className="bg-card border border-default rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-muted" />
              <h3 className="text-sm font-semibold text-default">Upcoming Payments</h3>
            </div>
            <div className="text-xs text-muted">
              Cash impact: <span className="font-mono text-default">{fmtCurrency(upcomingTotal)}</span>
              {' → '}
              <span className="font-mono text-default">{fmtCurrency(170000 - upcomingTotal)}</span> remaining
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {upcomingBills.map((bill) => {
              const isOverdue = bill.status === 'overdue';
              return (
                <div
                  key={bill.id}
                  onClick={() => setSelectedBill(bill)}
                  className={`rounded-lg border p-3 cursor-pointer transition-colors hover:bg-accent-hover ${
                    isOverdue ? 'border-red-500/40 bg-red-500/5' : 'border-default'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <p className="text-sm font-medium text-default">{bill.vendorName}</p>
                    <StatusBadge variant={statusVariant(bill.status)} label={bill.status} size="sm" />
                  </div>
                  <p className="text-xs text-muted mb-1">{bill.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-mono font-semibold text-default">${bill.amount.toLocaleString()}</span>
                    <span className="text-xs text-muted">Due: {bill.dueDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Vendor Management */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-default flex items-center gap-2">
          <Wallet className="w-4 h-4 text-muted" />
          Vendor Management
        </h3>
        {venLoading ? (
          <LoadingSkeleton variant="table" />
        ) : vendors && vendors.length > 0 ? (
          <DataTable
            data={vendors}
            columns={vendorColumns}
            searchable
            searchPlaceholder="Search vendors..."
            onRowClick={(v) => setSelectedVendor(v)}
            emptyState={{ icon: DollarSign, title: 'No vendors', description: 'No vendors found.' }}
          />
        ) : (
          <EmptyState icon={DollarSign} title="No vendors" description="No vendors configured." accentColor={ACCENT} />
        )}
      </div>

      {/* Bills Table */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-default">Bills</h3>
        <div className="flex items-center gap-2 flex-wrap">
          {filterButtons.map((btn) => (
            <button
              key={btn.label}
              onClick={() => setBillFilter(btn.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                billFilter === btn.value
                  ? 'bg-[#5BB8E6]/20 text-[#5BB8E6]'
                  : 'bg-elevated text-muted hover:text-default'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
        {billLoading ? (
          <LoadingSkeleton variant="table" />
        ) : bills && bills.length > 0 ? (
          <DataTable
            data={bills}
            columns={billColumns}
            searchable
            searchPlaceholder="Search bills..."
            pageSize={10}
            onRowClick={(b) => setSelectedBill(b)}
            emptyState={{ icon: DollarSign, title: 'No bills found', description: 'Try adjusting your filters.' }}
          />
        ) : (
          <EmptyState icon={DollarSign} title="No bills" description="No bills match the current filter." accentColor={ACCENT} />
        )}
      </div>

      {/* Expense Category Breakdown */}
      {categoryData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartWrapper title="Expense by Category" subtitle="All bills — YTD" height={280}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  nameKey="name"
                  paddingAngle={2}
                >
                  {categoryData.map((entry) => (
                    <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] ?? '#5BB8E6'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: CHART_THEME.tooltipBg, border: 'none', borderRadius: 8, color: '#E2E8F0' }}
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Spend']}
                />
                <Legend wrapperStyle={{ color: '#E2E8F0', fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>

          <div className="bg-card border border-default rounded-xl p-4">
            <h4 className="text-sm font-semibold text-default mb-3">Category Breakdown</h4>
            <div className="space-y-2">
              {categoryData.map((cat) => {
                const total = categoryData.reduce((s, c) => s + c.value, 0);
                const pct = total > 0 ? ((cat.value / total) * 100).toFixed(1) : '0';
                return (
                  <div key={cat.name} className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-sm shrink-0"
                      style={{ backgroundColor: CATEGORY_COLORS[cat.name] ?? '#5BB8E6' }}
                    />
                    <span className="text-sm text-muted flex-1">{cat.name}</span>
                    <span className="text-sm font-mono text-default">${cat.value.toLocaleString()}</span>
                    <span className="text-xs text-muted w-12 text-right">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Drawers */}
      <VendorDrawer vendor={selectedVendor} onClose={() => setSelectedVendor(null)} />
      <BillDrawer bill={selectedBill} onClose={() => setSelectedBill(null)} />
    </div>
  );
}
