'use client';

import { useState, useMemo } from 'react';
import { MetricCard, DataTable, StatusBadge, ChartWrapper, CHART_THEME, CHART_COLORS, LoadingSkeleton } from '@/components';
import { useWinLossLog } from '../../hooks/useWinLossLog';
import { WinLossDrawer } from './WinLossDrawer';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Filter } from 'lucide-react';
import type { WinLossEntry } from '../../types';
import { ACCENT as CRM_ACCENT } from '@/design/colors';


const OUTCOME_VARIANT: Record<string, 'success' | 'danger' | 'warning'> = {
  won: 'success',
  lost: 'danger',
  churned: 'warning',
};

const REASON_LABELS: Record<string, string> = {
  pricing: 'Pricing',
  'product-quality': 'Product Quality',
  delivery: 'Delivery',
  competitor: 'Competitor',
  relationship: 'Relationship',
  compliance: 'Compliance',
  closure: 'Store Closure',
  other: 'Other',
};

type WLRow = WinLossEntry & Record<string, unknown>;

export function WinLossLog() {
  const { data: entries, isLoading } = useWinLossLog();
  const [outcomeFilter, setOutcomeFilter] = useState('');
  const [reasonFilter, setReasonFilter] = useState('');
  const [selected, setSelected] = useState<WinLossEntry | null>(null);

  const filtered = useMemo(() => {
    if (!entries) return [];
    return entries.filter((e) => {
      if (outcomeFilter && e.outcome !== outcomeFilter) return false;
      if (reasonFilter && e.reasonCategory !== reasonFilter) return false;
      return true;
    });
  }, [entries, outcomeFilter, reasonFilter]);

  // Loss reasons chart (must be before early returns)
  const lossReasons = useMemo(() => {
    if (!entries) return [];
    const map: Record<string, number> = {};
    entries.filter((e) => e.outcome !== 'won').forEach((e) => {
      const label = REASON_LABELS[e.reasonCategory] || e.reasonCategory;
      map[label] = (map[label] || 0) + 1;
    });
    return Object.entries(map).map(([reason, count]) => ({ reason, count })).sort((a, b) => b.count - a.count);
  }, [entries]);

  // Revenue impact by reason
  const revenueByReason = useMemo(() => {
    if (!entries) return [];
    const map: Record<string, number> = {};
    entries.filter((e) => e.outcome !== 'won').forEach((e) => {
      const label = REASON_LABELS[e.reasonCategory] || e.reasonCategory;
      map[label] = (map[label] || 0) + e.revenueImpact;
    });
    return Object.entries(map).map(([reason, revenue]) => ({ reason, revenue })).sort((a, b) => b.revenue - a.revenue);
  }, [entries]);

  if (isLoading) return <LoadingSkeleton variant="card" count={4} />;
  if (!entries) return null;

  const totalEntries = entries.length;
  const wins = entries.filter((e) => e.outcome === 'won');
  const losses = entries.filter((e) => e.outcome === 'lost');
  const winRate = totalEntries > 0 ? (wins.length / totalEntries * 100) : 0;
  const revenueWon = wins.reduce((s, e) => s + e.revenueImpact, 0);
  const revenueLost = losses.reduce((s, e) => s + e.revenueImpact, 0) + entries.filter((e) => e.outcome === 'churned').reduce((s, e) => s + e.revenueImpact, 0);

  const columns = [
    {
      header: 'Date',
      accessor: 'date' as const,
      sortable: true,
      render: (row: WLRow) => new Date(row.date as string).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    },
    {
      header: 'Account',
      accessor: 'accountName' as const,
      sortable: true,
      render: (row: WLRow) => <span className="font-medium text-text-bright">{row.accountName as string}</span>,
    },
    {
      header: 'Outcome',
      accessor: 'outcome' as const,
      render: (row: WLRow) => <StatusBadge variant={OUTCOME_VARIANT[row.outcome as string]} label={row.outcome as string} size="sm" />,
    },
    {
      header: 'Reason',
      accessor: 'reasonCategory' as const,
      render: (row: WLRow) => (
        <StatusBadge variant="info" label={REASON_LABELS[row.reasonCategory as string] || (row.reasonCategory as string)} size="sm" />
      ),
    },
    {
      header: 'Competitor',
      accessor: 'competitor' as const,
      render: (row: WLRow) => <span className="text-text-muted">{(row.competitor as string) || '—'}</span>,
    },
    {
      header: 'Revenue Impact',
      accessor: 'revenueImpact' as const,
      sortable: true,
      render: (row: WLRow) => {
        const outcome = row.outcome as string;
        return (
          <span className={outcome === 'won' ? 'text-success font-medium' : 'text-danger font-medium'}>
            {outcome === 'won' ? '+' : '-'}${Number(row.revenueImpact).toLocaleString()}/mo
          </span>
        );
      },
    },
    {
      header: 'Products',
      accessor: ((row: WLRow) => (row.productsAffected as string[]).join(', ')) as (row: WLRow) => unknown,
      render: (row: WLRow) => {
        const products = row.productsAffected as string[];
        return <span className="text-xs text-text-muted">{products.length > 2 ? `${products[0]} +${products.length - 1}` : products.join(', ')}</span>;
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <MetricCard label="Total Entries" value={totalEntries} accentColor={CRM_ACCENT} />
        <MetricCard label="Win Rate" value={`${winRate.toFixed(0)}%`} accentColor="#5BB8E6" />
        <MetricCard label="Revenue Won" value={`$${(revenueWon / 1000).toFixed(1)}K/mo`} accentColor="#5BB8E6" />
        <MetricCard label="Revenue Lost" value={`$${(revenueLost / 1000).toFixed(1)}K/mo`} accentColor="#EF4444" />
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartWrapper title="Loss Reasons" subtitle="Frequency by category">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={lossReasons} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridColor} />
              <XAxis type="number" tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }} />
              <YAxis type="category" dataKey="reason" tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }} width={100} />
              <Tooltip contentStyle={{ backgroundColor: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, color: CHART_THEME.tooltipText, borderRadius: 8 }} />
              <Bar dataKey="count" fill={CHART_COLORS.danger} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>

        <ChartWrapper title="Revenue Impact by Reason" subtitle="Monthly revenue at risk">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueByReason} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridColor} />
              <XAxis type="number" tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="reason" tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }} width={100} />
              <Tooltip
                contentStyle={{ backgroundColor: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, color: CHART_THEME.tooltipText, borderRadius: 8 }}
                formatter={(value) => [`$${Number(value).toLocaleString()}/mo`, 'Impact']}
              />
              <Bar dataKey="revenue" fill={CRM_ACCENT} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl bg-card p-4">
        <Filter className="h-4 w-4 text-text-muted" />
        <select
          value={outcomeFilter}
          onChange={(e) => setOutcomeFilter(e.target.value)}
          className="rounded-lg border border-default bg-base px-2 py-1 text-xs text-text-default focus:outline-none"
        >
          <option value="">All Outcomes</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
          <option value="churned">Churned</option>
        </select>
        <select
          value={reasonFilter}
          onChange={(e) => setReasonFilter(e.target.value)}
          className="rounded-lg border border-default bg-base px-2 py-1 text-xs text-text-default focus:outline-none"
        >
          <option value="">All Reasons</option>
          {Object.entries(REASON_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <DataTable
        data={filtered as WLRow[]}
        columns={columns}
        searchable
        searchPlaceholder="Search win/loss log..."
        onRowClick={(row) => {
          const entry = entries?.find((e) => e.id === row.id);
          if (entry) setSelected(entry);
        }}
        pageSize={10}
      />

      {/* Drawer */}
      <WinLossDrawer entry={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
