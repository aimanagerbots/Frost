'use client';

import { useState } from 'react';
import { ArrowDownToLine, DollarSign, CalendarClock } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
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
import { useInvoices, useARMetrics, useARAging } from '@/modules/finance/hooks';
import type { Invoice, InvoiceStatus } from '@/modules/finance/types';
import { ComplianceCountdown } from './ComplianceCountdown';
import { ARDrawer } from './ARDrawer';
import { ACCENT } from '@/design/colors';


const statusVariant = (s: string) => {
  switch (s) {
    case 'paid': return 'success' as const;
    case 'pending': return 'warning' as const;
    case 'overdue': return 'danger' as const;
    case 'partial': return 'info' as const;
    default: return 'default' as const;
  }
};

const complianceVariant = (s: string) => {
  switch (s) {
    case 'compliant': return 'success' as const;
    case 'approaching': return 'warning' as const;
    case 'overdue': return 'danger' as const;
    default: return 'default' as const;
  }
};

const fmtCurrency = (n: number) => {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n.toLocaleString()}`;
};

const fmtShort = (n: number) => {
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
};

const dunningLabels: Record<number, string> = { 0: 'None', 1: 'Email', 2: 'Follow-up', 3: 'Phone', 4: 'Escalation' };

export function ARPage() {
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | undefined>(undefined);
  const [selected, setSelected] = useState<Invoice | null>(null);

  const { data: invoices, isLoading: invLoading, isError: invError, refetch } = useInvoices(statusFilter ? { status: statusFilter } : undefined);
  const { data: metrics, isLoading: metLoading } = useARMetrics();
  const { data: aging, isLoading: agingLoading } = useARAging();

  if (invError) {
    return (
      <div className="space-y-6">
        <SectionHeader icon={ArrowDownToLine} title="Accounts Receivable" subtitle="Invoice management & compliance tracking" accentColor={ACCENT} />
        <ErrorState title="Failed to load AR data" message="Could not fetch accounts receivable data." onRetry={() => refetch()} />
      </div>
    );
  }

  const columns = [
    { header: 'Invoice #', accessor: 'invoiceNumber' as const, sortable: true },
    { header: 'Account', accessor: 'accountName' as const, sortable: true },
    {
      header: 'Amount',
      accessor: 'amount' as const,
      sortable: true,
      render: (row: Invoice) => (
        <span className="font-mono">${row.amount.toLocaleString()}</span>
      ),
    },
    {
      header: 'Delivered',
      accessor: 'deliveredDate' as const,
      sortable: true,
      hideBelow: 'md' as const,
    },
    {
      header: 'Due',
      accessor: 'dueDate' as const,
      sortable: true,
      hideBelow: 'md' as const,
    },
    {
      header: 'Days Out',
      accessor: 'daysOutstanding' as const,
      sortable: true,
      hideBelow: 'lg' as const,
      render: (row: Invoice) => (
        <span className={row.daysOutstanding > 5 ? 'text-red-400 font-medium' : ''}>
          {row.daysOutstanding}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status' as const,
      sortable: true,
      render: (row: Invoice) => (
        <StatusBadge variant={statusVariant(row.status)} label={row.status} size="sm" dot />
      ),
    },
    {
      header: 'Compliance',
      accessor: 'complianceStatus' as const,
      sortable: true,
      hideBelow: 'lg' as const,
      render: (row: Invoice) => (
        <StatusBadge variant={complianceVariant(row.complianceStatus)} size="sm" dot label={
          row.complianceDaysRemaining >= 0
            ? `${row.complianceDaysRemaining}d`
            : `${Math.abs(row.complianceDaysRemaining)}d late`
        } />
      ),
    },
    {
      header: 'Dunning',
      accessor: 'dunningStage' as const,
      hideBelow: 'lg' as const,
      render: (row: Invoice) => (
        <span className="text-xs text-muted">{dunningLabels[row.dunningStage] ?? 'Unknown'}</span>
      ),
    },
    {
      header: 'Method',
      accessor: 'method' as const,
      hideBelow: 'lg' as const,
      render: (row: Invoice) => (
        <span className="text-xs text-muted">{row.method ?? '—'}</span>
      ),
    },
  ];

  const filterButtons: { label: string; value: InvoiceStatus | undefined }[] = [
    { label: 'All', value: undefined },
    { label: 'Pending', value: 'pending' },
    { label: 'Overdue', value: 'overdue' },
    { label: 'Partial', value: 'partial' },
    { label: 'Paid', value: 'paid' },
  ];

  // Projected inflows calendar data (simple week view)
  const projectedWeeks = [
    { day: 'Mon', amount: 14500, confidence: 'high' },
    { day: 'Tue', amount: 8200, confidence: 'high' },
    { day: 'Wed', amount: 11200, confidence: 'medium' },
    { day: 'Thu', amount: 6800, confidence: 'medium' },
    { day: 'Fri', amount: 3400, confidence: 'low' },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={ArrowDownToLine}
        title="Accounts Receivable"
        subtitle="Invoice management & compliance tracking"
        accentColor={ACCENT}
      />

      {/* Metrics Row */}
      {metLoading ? (
        <LoadingSkeleton variant="card" count={6} />
      ) : metrics ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <MetricCard label="Total AR" value={fmtCurrency(metrics.totalAR)} accentColor={ACCENT} />
          <MetricCard label="Overdue" value={fmtCurrency(metrics.overdueAmount)} accentColor="#EF4444" trend={{ value: metrics.overdueCount, direction: 'up' }} />
          <MetricCard label="DSO" value={`${metrics.dso} days`} accentColor={ACCENT} trend={{ value: Math.abs(metrics.dsoTrend), direction: metrics.dsoTrend > 0 ? 'up' : 'down' }} />
          <MetricCard label="Compliance Rate" value={`${metrics.complianceRate}%`} accentColor={ACCENT} />
          <MetricCard label="Projected Inflows" value={fmtCurrency(metrics.projectedInflows30d)} accentColor={ACCENT} />
          <MetricCard label="Collection Velocity" value={`${metrics.collectionVelocity} days`} accentColor={ACCENT} />
        </div>
      ) : null}

      {/* Compliance Countdown */}
      {invLoading ? (
        <LoadingSkeleton variant="card" count={3} />
      ) : invoices ? (
        <ComplianceCountdown invoices={invoices} />
      ) : null}

      {/* AR Aging Chart */}
      {agingLoading ? (
        <LoadingSkeleton variant="chart" />
      ) : aging ? (
        <ChartWrapper title="AR Aging" subtitle="Outstanding receivables by age bucket" height={240}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={aging} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridColor} vertical={false} />
              <XAxis dataKey="label" tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }} />
              <YAxis tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }} tickFormatter={fmtShort} />
              <Tooltip
                contentStyle={{ backgroundColor: CHART_THEME.tooltipBg, border: 'none', borderRadius: 8, color: '#E2E8F0' }}
                formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Amount']}
              />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                {aging.map((bucket) => (
                  <Cell key={bucket.label} fill={bucket.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      ) : null}

      {/* Invoice Table */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          {filterButtons.map((btn) => (
            <button
              key={btn.label}
              onClick={() => setStatusFilter(btn.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === btn.value
                  ? 'bg-[#5BB8E6]/20 text-[#5BB8E6]'
                  : 'bg-elevated text-muted hover:text-default'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {invLoading ? (
          <LoadingSkeleton variant="table" />
        ) : invoices && invoices.length > 0 ? (
          <DataTable
            data={invoices}
            columns={columns}
            searchable
            searchPlaceholder="Search invoices..."
            pageSize={10}
            onRowClick={(inv) => setSelected(inv)}
            emptyState={{ icon: DollarSign, title: 'No invoices found', description: 'Try adjusting your filters.' }}
          />
        ) : (
          <EmptyState icon={DollarSign} title="No invoices" description="No invoices match the current filter." accentColor={ACCENT} />
        )}
      </div>

      {/* Projected Inflows */}
      <div className="bg-card border border-default rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <CalendarClock className="w-4 h-4 text-muted" />
          <h3 className="text-sm font-semibold text-default">Projected Inflows This Week</h3>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {projectedWeeks.map((day) => {
            const color = day.confidence === 'high' ? 'bg-green-500/20 text-green-400' : day.confidence === 'medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400';
            return (
              <div key={day.day} className={`rounded-lg p-3 text-center ${color}`}>
                <p className="text-xs font-medium mb-1">{day.day}</p>
                <p className="text-sm font-bold">{fmtCurrency(day.amount)}</p>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs text-muted">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> High confidence</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Medium</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Low</span>
        </div>
      </div>

      {/* Drawer */}
      <ARDrawer invoice={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
