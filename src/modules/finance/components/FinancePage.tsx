'use client';

import { useState } from 'react';
import { DollarSign } from 'lucide-react';
import {
  SectionHeader,
  MetricCard,
  DataTable,
  StatusBadge,
  DrawerPanel,
  LoadingSkeleton,
  ChartWrapper,
  CHART_THEME,
  CHART_COLORS,
} from '@/components';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import type { PieLabelRenderProps } from 'recharts';
import {
  useInvoices,
  useARaging,
  useFinanceMetrics,
  useRevenueByPeriod,
  useRevenueByCategory,
} from '@/modules/finance/hooks';
import type { Invoice, InvoiceStatus } from '@/modules/finance/types';

const ACCENT = '#059669';

const STATUS_VARIANT: Record<InvoiceStatus, 'success' | 'warning' | 'danger' | 'info'> = {
  paid: 'success',
  pending: 'warning',
  overdue: 'danger',
  partial: 'info',
};

const STATUS_FILTERS: { label: string; value: InvoiceStatus | undefined }[] = [
  { label: 'All', value: undefined },
  { label: 'Paid', value: 'paid' },
  { label: 'Pending', value: 'pending' },
  { label: 'Overdue', value: 'overdue' },
  { label: 'Partial', value: 'partial' },
];

const CATEGORY_COLORS: Record<string, string> = {
  Flower: CHART_COLORS.flower,
  Preroll: CHART_COLORS.preroll,
  Vaporizer: CHART_COLORS.vaporizer,
  Concentrate: CHART_COLORS.concentrate,
  Edible: CHART_COLORS.edible,
  Beverage: CHART_COLORS.beverage,
};

const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 });
const fmtShort = (v: number) => {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}K`;
  return fmt.format(v);
};

export function FinancePage() {
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | undefined>(undefined);
  const [selected, setSelected] = useState<Invoice | null>(null);

  const { data: invoices, isLoading: invoicesLoading } = useInvoices(
    statusFilter ? { status: statusFilter } : undefined
  );
  const { data: arAging, isLoading: arLoading } = useARaging();
  const { data: metrics, isLoading: metricsLoading } = useFinanceMetrics();
  const { data: revenueData, isLoading: revenueLoading } = useRevenueByPeriod();
  const { data: categoryData, isLoading: categoryLoading } = useRevenueByCategory();

  const isLoading = metricsLoading || arLoading || revenueLoading || categoryLoading;

  const revenueChange = metrics
    ? ((metrics.revenueThisMonth - metrics.revenuePriorMonth) / metrics.revenuePriorMonth) * 100
    : 0;

  const columns = [
    {
      header: 'Invoice #',
      accessor: 'orderNumber' as const,
      sortable: true,
    },
    {
      header: 'Account',
      accessor: 'accountName' as const,
      sortable: true,
    },
    {
      header: 'Amount',
      accessor: 'amount' as const,
      sortable: true,
      render: (row: Invoice) => (
        <span className="font-medium">{fmt.format(row.amount)}</span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status' as const,
      sortable: true,
      render: (row: Invoice) => (
        <StatusBadge variant={STATUS_VARIANT[row.status]} label={row.status} size="sm" />
      ),
    },
    {
      header: 'Issued',
      accessor: 'issuedDate' as const,
      sortable: true,
      render: (row: Invoice) =>
        new Date(row.issuedDate + 'T00:00:00').toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
    },
    {
      header: 'Due',
      accessor: 'dueDate' as const,
      sortable: true,
      render: (row: Invoice) =>
        new Date(row.dueDate + 'T00:00:00').toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
    },
    {
      header: 'Paid Date',
      accessor: 'paidDate' as const,
      render: (row: Invoice) =>
        row.paidDate
          ? new Date(row.paidDate + 'T00:00:00').toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })
          : '--',
    },
    {
      header: 'Days Out',
      accessor: 'daysOutstanding' as const,
      sortable: true,
      render: (row: Invoice) => (
        <span className={row.daysOutstanding > 30 ? 'text-[var(--text-danger)]' : ''}>
          {row.daysOutstanding}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={DollarSign}
        title="Finance"
        subtitle="Accounts receivable, revenue trends, and invoice management"
        accentColor={ACCENT}
      />

      {/* Metrics Row */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <LoadingSkeleton variant="card" count={4} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Total AR"
            value={fmtShort(metrics?.totalAR ?? 0)}
            accentColor={ACCENT}
          />
          <MetricCard
            label="Overdue Amount"
            value={fmtShort(metrics?.overdueAmount ?? 0)}
            accentColor={ACCENT}
            trend={{ value: 0, direction: 'flat' }}
          />
          <MetricCard
            label="Revenue This Month"
            value={fmtShort(metrics?.revenueThisMonth ?? 0)}
            accentColor={ACCENT}
            trend={{
              value: Math.round(revenueChange * 10) / 10,
              direction: revenueChange > 0 ? 'up' : revenueChange < 0 ? 'down' : 'flat',
            }}
          />
          <MetricCard
            label="Avg Days to Pay"
            value={metrics?.avgDaysToPay ?? 0}
            accentColor={ACCENT}
          />
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* AR Aging Bar Chart */}
        <ChartWrapper title="AR Aging" loading={arLoading}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={arAging ?? []} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridColor} vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }}
                axisLine={{ stroke: CHART_THEME.gridColor }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: CHART_THEME.axisColor, fontSize: 10 }}
                axisLine={{ stroke: CHART_THEME.gridColor }}
                tickLine={false}
                tickFormatter={(v: number) => fmtShort(v)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: CHART_THEME.tooltipBg,
                  border: `1px solid ${CHART_THEME.tooltipBorder}`,
                  borderRadius: 8,
                  color: CHART_THEME.tooltipText,
                }}
                formatter={(value) => [fmt.format(Number(value)), 'Amount']}
              />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                {(arAging ?? []).map((bucket, idx) => (
                  <Cell key={idx} fill={bucket.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>

        {/* Revenue Trend Line Chart */}
        <ChartWrapper title="Revenue Trend (12 Months)" loading={revenueLoading}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData ?? []} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridColor} vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: CHART_THEME.axisColor, fontSize: 10 }}
                axisLine={{ stroke: CHART_THEME.gridColor }}
                tickLine={false}
                interval={1}
              />
              <YAxis
                tick={{ fill: CHART_THEME.axisColor, fontSize: 10 }}
                axisLine={{ stroke: CHART_THEME.gridColor }}
                tickLine={false}
                tickFormatter={(v: number) => fmtShort(v)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: CHART_THEME.tooltipBg,
                  border: `1px solid ${CHART_THEME.tooltipBorder}`,
                  borderRadius: 8,
                  color: CHART_THEME.tooltipText,
                }}
                formatter={(value) => [fmt.format(Number(value)), 'Revenue']}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke={ACCENT}
                strokeWidth={2}
                dot={{ fill: ACCENT, r: 3 }}
                activeDot={{ r: 5, fill: ACCENT }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </div>

      {/* Revenue by Category Pie Chart */}
      <ChartWrapper title="Revenue by Category" loading={categoryLoading}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData ?? []}
              dataKey="revenue"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={110}
              paddingAngle={2}
              label={(props: PieLabelRenderProps) => {
                const d = props as PieLabelRenderProps & { category: string; percentage: number };
                return `${d.category} ${d.percentage}%`;
              }}
            >
              {(categoryData ?? []).map((entry, idx) => (
                <Cell key={idx} fill={CATEGORY_COLORS[entry.category] ?? CHART_COLORS.primary} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: CHART_THEME.tooltipBg,
                border: `1px solid ${CHART_THEME.tooltipBorder}`,
                borderRadius: 8,
                color: CHART_THEME.tooltipText,
              }}
              formatter={(value) => [fmt.format(Number(value)), 'Revenue']}
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartWrapper>

      {/* Invoice Status Filters */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.label}
            onClick={() => setStatusFilter(f.value)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              statusFilter === f.value
                ? 'text-white'
                : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-default)]'
            }`}
            style={statusFilter === f.value ? { backgroundColor: ACCENT } : undefined}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Invoice Table */}
      <DataTable<Invoice>
        data={invoices ?? []}
        columns={columns}
        searchable
        searchPlaceholder="Search invoices..."
        loading={invoicesLoading}
        onRowClick={(row) => setSelected(row)}
        pageSize={10}
        emptyState={{
          icon: DollarSign,
          title: 'No invoices found',
          description: 'Try adjusting your filters or search terms.',
          accentColor: ACCENT,
        }}
      />

      {/* Invoice Detail Drawer */}
      <DrawerPanel
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `Invoice ${selected.orderNumber}` : 'Invoice Details'}
      >
        {selected && (
          <div className="space-y-5">
            <div>
              <StatusBadge variant={STATUS_VARIANT[selected.status]} label={selected.status} size="sm" />
            </div>

            <div>
              <h4 className="text-xs font-medium text-[var(--text-muted)] mb-1">Account</h4>
              <p className="text-sm text-[var(--text-default)]">{selected.accountName}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-medium text-[var(--text-muted)] mb-1">Amount</h4>
                <p className="text-sm font-semibold text-[var(--text-default)]">
                  {fmt.format(selected.amount)}
                </p>
              </div>
              {selected.paidAmount !== undefined && (
                <div>
                  <h4 className="text-xs font-medium text-[var(--text-muted)] mb-1">Paid Amount</h4>
                  <p className="text-sm font-semibold text-[var(--text-default)]">
                    {fmt.format(selected.paidAmount)}
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-medium text-[var(--text-muted)] mb-1">Issued</h4>
                <p className="text-sm text-[var(--text-default)]">
                  {new Date(selected.issuedDate + 'T00:00:00').toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-medium text-[var(--text-muted)] mb-1">Due</h4>
                <p className="text-sm text-[var(--text-default)]">
                  {new Date(selected.dueDate + 'T00:00:00').toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {selected.paidDate && (
              <div>
                <h4 className="text-xs font-medium text-[var(--text-muted)] mb-1">Paid Date</h4>
                <p className="text-sm text-[var(--text-default)]">
                  {new Date(selected.paidDate + 'T00:00:00').toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            )}

            {selected.method && (
              <div>
                <h4 className="text-xs font-medium text-[var(--text-muted)] mb-1">Payment Method</h4>
                <p className="text-sm text-[var(--text-default)]">{selected.method}</p>
              </div>
            )}

            <div>
              <h4 className="text-xs font-medium text-[var(--text-muted)] mb-1">Days Outstanding</h4>
              <p className={`text-sm font-medium ${selected.daysOutstanding > 30 ? 'text-[var(--text-danger)]' : 'text-[var(--text-default)]'}`}>
                {selected.daysOutstanding} days
              </p>
            </div>

            {selected.status === 'partial' && selected.paidAmount !== undefined && (
              <div>
                <h4 className="text-xs font-medium text-[var(--text-muted)] mb-1">Payment Progress</h4>
                <div className="mt-1 h-2 rounded-full bg-[var(--bg-elevated)] overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(selected.paidAmount / selected.amount) * 100}%`,
                      backgroundColor: ACCENT,
                    }}
                  />
                </div>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  {Math.round((selected.paidAmount / selected.amount) * 100)}% paid
                  ({fmt.format(selected.amount - selected.paidAmount)} remaining)
                </p>
              </div>
            )}
          </div>
        )}
      </DrawerPanel>
    </div>
  );
}
