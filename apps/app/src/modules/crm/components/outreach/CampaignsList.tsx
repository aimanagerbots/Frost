'use client';

import { useState, useMemo } from 'react';
import { MetricCard, DataTable, StatusBadge } from '@/components';
import { useCampaigns } from '../../hooks/useCampaigns';
import { CampaignDrawer } from './CampaignDrawer';
import { Filter } from 'lucide-react';
import type { Campaign } from '../../types';
import { ACCENT as CRM_ACCENT } from '@/design/colors';


const STATUS_VARIANT: Record<string, 'success' | 'info' | 'muted' | 'warning' | 'danger'> = {
  active: 'success',
  scheduled: 'info',
  completed: 'muted',
  paused: 'warning',
  draft: 'danger',
};

const TYPE_LABELS: Record<string, string> = {
  'morning-reorder': 'Morning Reorder',
  'product-launch': 'Product Launch',
  'win-back': 'Win-Back',
  seasonal: 'Seasonal',
  custom: 'Custom',
};

type CampaignRow = Campaign & Record<string, unknown>;

const TYPES = ['morning-reorder', 'product-launch', 'win-back', 'seasonal', 'custom'] as const;
const STATUSES = ['draft', 'scheduled', 'active', 'completed', 'paused'] as const;
const CHANNELS = ['email', 'sms', 'multi'] as const;

export function CampaignsList() {
  const { data: campaigns, isLoading } = useCampaigns();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState('');
  const [channelFilter, setChannelFilter] = useState('');

  const filtered = useMemo(() => {
    if (!campaigns) return [];
    return campaigns.filter((c) => {
      if (typeFilter.size > 0 && !typeFilter.has(c.type)) return false;
      if (statusFilter && c.status !== statusFilter) return false;
      if (channelFilter && c.channel !== channelFilter) return false;
      return true;
    });
  }, [campaigns, typeFilter, statusFilter, channelFilter]);

  // Metrics
  const activeCampaigns = campaigns?.filter((c) => c.status === 'active').length ?? 0;
  const totalSent = campaigns?.reduce((sum, c) => sum + c.sentCount, 0) ?? 0;
  const avgOpenRate = campaigns && campaigns.length > 0
    ? campaigns.filter((c) => c.sentCount > 0).reduce((sum, c) => sum + c.openRate, 0) /
      Math.max(campaigns.filter((c) => c.sentCount > 0).length, 1)
    : 0;
  const avgResponseRate = campaigns && campaigns.length > 0
    ? campaigns.filter((c) => c.sentCount > 0).reduce((sum, c) => sum + c.responseRate, 0) /
      Math.max(campaigns.filter((c) => c.sentCount > 0).length, 1)
    : 0;
  const totalRevenue = campaigns?.reduce((sum, c) => sum + c.revenueAttributed, 0) ?? 0;

  const columns = [
    {
      header: 'Campaign',
      accessor: 'name' as const,
      sortable: true,
      render: (row: CampaignRow) => (
        <span className="font-medium text-text-bright">{row.name as string}</span>
      ),
    },
    {
      header: 'Type',
      accessor: 'type' as const,
      render: (row: CampaignRow) => (
        <StatusBadge variant="info" label={TYPE_LABELS[row.type as string] || (row.type as string)} size="sm" />
      ),
    },
    {
      header: 'Status',
      accessor: 'status' as const,
      sortable: true,
      render: (row: CampaignRow) => (
        <StatusBadge variant={STATUS_VARIANT[row.status as string]} label={row.status as string} size="sm" />
      ),
    },
    {
      header: 'Targets',
      accessor: 'targetCount' as const,
      sortable: true,
    },
    {
      header: 'Sent',
      accessor: 'sentCount' as const,
      sortable: true,
    },
    {
      header: 'Open %',
      accessor: 'openRate' as const,
      sortable: true,
      render: (row: CampaignRow) => (
        <span className={Number(row.openRate) >= 50 ? 'text-success' : 'text-text-default'}>
          {Number(row.openRate).toFixed(1)}%
        </span>
      ),
    },
    {
      header: 'Response %',
      accessor: 'responseRate' as const,
      sortable: true,
      render: (row: CampaignRow) => (
        <span className={Number(row.responseRate) >= 25 ? 'text-success' : 'text-text-default'}>
          {Number(row.responseRate).toFixed(1)}%
        </span>
      ),
    },
    {
      header: 'Orders',
      accessor: 'ordersGenerated' as const,
      sortable: true,
    },
    {
      header: 'Revenue',
      accessor: 'revenueAttributed' as const,
      sortable: true,
      render: (row: CampaignRow) => (
        <span className="font-medium">${Number(row.revenueAttributed).toLocaleString()}</span>
      ),
    },
  ];

  function toggleType(type: string) {
    setTypeFilter((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  }

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        <MetricCard label="Active Campaigns" value={activeCampaigns} accentColor={CRM_ACCENT} />
        <MetricCard label="Total Sent (All Time)" value={totalSent.toLocaleString()} accentColor="#5BB8E6" />
        <MetricCard label="Avg Open Rate" value={`${avgOpenRate.toFixed(1)}%`} accentColor="#5BB8E6" />
        <MetricCard label="Avg Response Rate" value={`${avgResponseRate.toFixed(1)}%`} accentColor="#5BB8E6" />
        <MetricCard label="Revenue Attributed" value={`$${totalRevenue.toLocaleString()}`} accentColor="#5BB8E6" />
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-default bg-card p-4">
        <Filter className="h-4 w-4 text-text-muted" />

        {/* Type multi-select */}
        <div className="flex flex-wrap gap-1.5">
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => toggleType(t)}
              className={`rounded-md px-2 py-1 text-xs transition-colors ${
                typeFilter.size === 0 || typeFilter.has(t)
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-elevated text-text-muted hover:text-text-default'
              }`}
            >
              {TYPE_LABELS[t]}
            </button>
          ))}
        </div>

        <div className="h-5 w-px bg-default" />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-default bg-base px-2 py-1 text-xs text-text-default focus:outline-none"
        >
          <option value="">All Status</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={channelFilter}
          onChange={(e) => setChannelFilter(e.target.value)}
          className="rounded-lg border border-default bg-base px-2 py-1 text-xs text-text-default focus:outline-none"
        >
          <option value="">All Channels</option>
          {CHANNELS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <DataTable
        data={filtered as CampaignRow[]}
        columns={columns}
        searchable
        searchPlaceholder="Search campaigns..."
        onRowClick={(row) => setSelectedId(row.id as string)}
        loading={isLoading}
        pageSize={10}
      />

      {/* Campaign detail drawer */}
      <CampaignDrawer campaignId={selectedId} onClose={() => setSelectedId(null)} />
    </div>
  );
}
