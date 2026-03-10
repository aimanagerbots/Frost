'use client';

import { useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { MetricCard, DataTable, ChartWrapper, CHART_COLORS, CHART_THEME, StatusBadge, LoadingSkeleton } from '@/components';
import { useAccountOrders } from '../../../hooks';
import type { Account, AccountOrder } from '../../../types';
import { ACCENT as CRM_ACCENT } from '@/design/colors';


interface PurchasesTabProps {
  accountId: string;
  account: Account;
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n);
}

import type { DomainStatus } from '@/components/StatusBadge';

// All AccountOrder statuses are valid DomainStatuses
const ORDER_STATUS_DOMAIN: Record<AccountOrder['status'], DomainStatus> = {
  delivered: 'delivered',
  'in-transit': 'in-transit',
  processing: 'processing',
  cancelled: 'cancelled',
};

interface OrderRow extends Record<string, unknown> {
  id: string;
  orderNumber: string;
  date: string;
  skuCount: number;
  categories: string;
  total: number;
  status: string;
}

export function PurchasesTab({ accountId, account }: PurchasesTabProps) {
  const { data: orders, isLoading } = useAccountOrders(accountId);

  const topCategory = useMemo(() => {
    if (!account.categoryMix.length) return 'N/A';
    return account.categoryMix.reduce((a, b) => (a.percentage > b.percentage ? a : b)).category;
  }, [account.categoryMix]);

  // Build monthly revenue by category for stacked area chart
  const chartData = useMemo(() => {
    if (!orders) return [];
    const months = new Map<string, Record<string, number>>();
    orders.forEach((o) => {
      const d = new Date(o.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!months.has(key)) months.set(key, {});
      const m = months.get(key)!;
      // Distribute order total across categories based on account's category mix
      account.categoryMix.forEach((cm) => {
        const share = (cm.percentage / 100) * o.total;
        m[cm.category] = (m[cm.category] || 0) + share;
      });
    });
    return Array.from(months.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short' }),
        ...data,
      }));
  }, [orders, account.categoryMix]);

  const rows: OrderRow[] = useMemo(() => {
    if (!orders) return [];
    return orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      date: o.date,
      skuCount: o.skuCount,
      categories: o.categories.join(', '),
      total: o.total,
      status: o.status,
    }));
  }, [orders]);

  const columns = useMemo(() => [
    {
      header: 'Order #',
      accessor: 'orderNumber' as const,
      sortable: true,
      render: (row: OrderRow) => <span className="font-medium text-text-bright">{row.orderNumber}</span>,
    },
    {
      header: 'Date',
      accessor: 'date' as const,
      sortable: true,
      render: (row: OrderRow) => (
        <span className="text-text-default">
          {new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      ),
    },
    { header: 'SKUs', accessor: 'skuCount' as const, sortable: true, hideBelow: 'md' as const },
    { header: 'Categories', accessor: 'categories' as const, sortable: false, hideBelow: 'lg' as const },
    {
      header: 'Total',
      accessor: 'total' as const,
      sortable: true,
      render: (row: OrderRow) => <span className="font-medium text-text-default">{formatCurrency(row.total)}</span>,
    },
    {
      header: 'Status',
      accessor: 'status' as const,
      sortable: true,
      render: (row: OrderRow) => (
        <StatusBadge status={ORDER_STATUS_DOMAIN[row.status as AccountOrder['status']]} size="sm" />
      ),
    },
  ], []);

  if (isLoading) return <LoadingSkeleton variant="card" count={2} />;

  return (
    <div className="space-y-4">
      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Lifetime Revenue" value={formatCurrency(account.totalRevenue)} accentColor={CRM_ACCENT} />
        <MetricCard label="Total Orders" value={account.orderCount} accentColor={CRM_ACCENT} />
        <MetricCard label="Avg Order Value" value={formatCurrency(account.avgOrderValue)} accentColor={CRM_ACCENT} />
        <MetricCard label="Top Category" value={topCategory} accentColor={CRM_ACCENT} />
      </div>

      {/* Stacked Area Chart */}
      <ChartWrapper title="Revenue by Category" subtitle="Monthly breakdown">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridColor} />
            <XAxis dataKey="month" tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }} axisLine={{ stroke: CHART_THEME.gridColor }} tickLine={{ stroke: CHART_THEME.gridColor }} />
            <YAxis tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} axisLine={{ stroke: CHART_THEME.gridColor }} tickLine={{ stroke: CHART_THEME.gridColor }} />
            <Tooltip
              contentStyle={{ backgroundColor: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 8, color: CHART_THEME.tooltipText }}
              formatter={(value) => formatCurrency(Number(value))}
            />
            {account.categoryMix.map((cm) => (
              <Area
                key={cm.category}
                type="monotone"
                dataKey={cm.category}
                stackId="1"
                stroke={CHART_COLORS[cm.category as keyof typeof CHART_COLORS] || CRM_ACCENT}
                fill={CHART_COLORS[cm.category as keyof typeof CHART_COLORS] || CRM_ACCENT}
                fillOpacity={0.4}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </ChartWrapper>

      {/* Orders Table */}
      <DataTable<OrderRow>
        data={rows}
        columns={columns}
        pageSize={10}
      />
    </div>
  );
}
