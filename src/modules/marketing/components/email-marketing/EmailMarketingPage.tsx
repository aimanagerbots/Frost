'use client';

import { useState } from 'react';
import { SendHorizonal, Users, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  SectionHeader, MetricCard, DataTable, StatusBadge,
  LoadingSkeleton, ChartWrapper, CHART_THEME,
} from '@/components';
import { useEmailCampaigns, useEmailTemplates, useMarketingMetrics } from '@/modules/marketing/hooks';
import { getListHealthTrend } from '@/mocks/marketing';
import { CampaignDrawer } from './CampaignDrawer';
import type { EmailCampaign } from '@/modules/marketing/types';

const ACCENT = '#EC4899';

const STATUS_VARIANT: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info' | 'muted'> = {
  draft: 'muted',
  scheduled: 'info',
  sending: 'warning',
  sent: 'success',
  paused: 'danger',
};

const columns = [
  {
    header: 'Campaign',
    accessor: 'name' as const,
    sortable: true,
    render: (row: EmailCampaign) => (
      <div>
        <p className="text-sm font-medium text-text-default">{row.name}</p>
        <p className="text-xs text-text-muted truncate max-w-[240px]">{row.subject}</p>
      </div>
    ),
  },
  {
    header: 'Status',
    accessor: 'status' as const,
    sortable: true,
    render: (row: EmailCampaign) => (
      <StatusBadge label={row.status} variant={STATUS_VARIANT[row.status] ?? 'default'} size="sm" />
    ),
  },
  {
    header: 'Audience',
    accessor: 'audienceSize' as const,
    sortable: true,
    hideBelow: 'md' as const,
    render: (row: EmailCampaign) => (
      <div className="flex items-center gap-1.5">
        <Users className="h-3 w-3 text-text-muted" />
        <span className="text-sm text-text-default">{row.audienceSize.toLocaleString()}</span>
      </div>
    ),
  },
  {
    header: 'Sent',
    accessor: ((row: EmailCampaign) => row.stats?.sent ?? 0) as unknown as keyof EmailCampaign,
    sortable: true,
    hideBelow: 'md' as const,
    render: (row: EmailCampaign) => (
      <span className="text-sm text-text-default">{row.stats?.sent?.toLocaleString() ?? '—'}</span>
    ),
  },
  {
    header: 'Open Rate',
    accessor: ((row: EmailCampaign) => row.stats?.openRate ?? 0) as unknown as keyof EmailCampaign,
    sortable: true,
    hideBelow: 'lg' as const,
    render: (row: EmailCampaign) => (
      <span className="text-sm text-text-default">{row.stats ? `${row.stats.openRate}%` : '—'}</span>
    ),
  },
  {
    header: 'Click Rate',
    accessor: ((row: EmailCampaign) => row.stats?.clickRate ?? 0) as unknown as keyof EmailCampaign,
    sortable: true,
    hideBelow: 'lg' as const,
    render: (row: EmailCampaign) => (
      <span className="text-sm text-text-default">{row.stats ? `${row.stats.clickRate}%` : '—'}</span>
    ),
  },
  {
    header: 'Conversions',
    accessor: ((row: EmailCampaign) => row.stats?.converted ?? 0) as unknown as keyof EmailCampaign,
    sortable: true,
    hideBelow: 'lg' as const,
    render: (row: EmailCampaign) => (
      <span className="text-sm text-text-default">{row.stats?.converted ?? '—'}</span>
    ),
  },
];

export function EmailMarketingPage() {
  const { data: campaigns, isLoading: campaignsLoading } = useEmailCampaigns();
  const { data: templates, isLoading: templatesLoading } = useEmailTemplates();
  const { data: metrics, isLoading: metricsLoading } = useMarketingMetrics();

  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

  const isLoading = campaignsLoading || metricsLoading || templatesLoading;

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <LoadingSkeleton variant="text" />
        <LoadingSkeleton variant="card" count={6} />
        <LoadingSkeleton variant="table" />
      </div>
    );
  }

  const listHealthData = getListHealthTrend();

  return (
    <div className="space-y-6 p-6">
      <SectionHeader
        icon={SendHorizonal}
        title="Email Marketing"
        subtitle="Campaign management and performance tracking"
        accentColor={ACCENT}
        stats={[
          { label: 'Campaigns', value: campaigns?.length ?? 0 },
          { label: 'Avg Open Rate', value: `${metrics?.avgOpenRate ?? 0}%` },
        ]}
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <MetricCard label="Active Campaigns" value={metrics?.activeCampaigns ?? 0} accentColor={ACCENT} />
        <MetricCard label="Emails Sent (MTD)" value={(metrics?.emailsSentMTD ?? 0).toLocaleString()} accentColor="#3B82F6" />
        <MetricCard label="Avg Open Rate" value={`${metrics?.avgOpenRate ?? 0}%`} accentColor="#22C55E" />
        <MetricCard label="Avg Click Rate" value={`${metrics?.avgClickRate ?? 0}%`} accentColor="#F59E0B" />
        <MetricCard label="Revenue Attributed" value={`$${((metrics?.revenueAttributed ?? 0) / 1000).toFixed(1)}K`} accentColor="#8B5CF6" />
        <MetricCard label="List Health" value={`${metrics?.listHealth ?? 0}%`} accentColor="#14B8A6" />
      </div>

      {/* Campaign Table */}
      <DataTable<EmailCampaign>
        data={campaigns ?? []}
        columns={columns}
        searchable
        searchPlaceholder="Search campaigns..."
        onRowClick={(row) => setSelectedCampaignId(row.id)}
        pageSize={10}
        emptyState={{
          icon: SendHorizonal,
          title: 'No campaigns yet',
          description: 'Create your first email campaign to get started.',
          accentColor: ACCENT,
        }}
      />

      {/* Quick Create + List Health */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Templates */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-text-default">Quick Create</h3>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {(templates ?? []).map((template) => (
              <div key={template.id} className="rounded-xl border border-default bg-card p-3">
                <p className="mb-1 text-sm font-medium text-text-default">{template.name}</p>
                <p className="mb-2 text-xs text-text-muted">{template.category}</p>
                <button
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-colors hover:opacity-90"
                  style={{ backgroundColor: ACCENT }}
                >
                  Use Template
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* List Health */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-text-default">Subscriber Growth</h3>
          <div className="rounded-xl border border-default bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" style={{ color: ACCENT }} />
                <span className="text-sm font-medium text-text-default">2,680 subscribers</span>
              </div>
              <StatusBadge label="+7.2% this month" variant="success" size="sm" />
            </div>
            <ChartWrapper height={180}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={listHealthData}>
                  <XAxis dataKey="month" stroke={CHART_THEME.axisColor} fontSize={10} />
                  <YAxis stroke={CHART_THEME.axisColor} fontSize={10} />
                  <Tooltip
                    contentStyle={{ backgroundColor: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 8, color: CHART_THEME.tooltipText }}
                    formatter={(value) => [Number(value).toLocaleString(), 'Subscribers']}
                  />
                  <Bar dataKey="subscribers" fill={ACCENT} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </div>
        </div>
      </div>

      {/* Campaign Drawer */}
      <CampaignDrawer
        campaignId={selectedCampaignId}
        open={!!selectedCampaignId}
        onClose={() => setSelectedCampaignId(null)}
      />
    </div>
  );
}
