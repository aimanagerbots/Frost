'use client';

import { useState } from 'react';
import {
  SectionHeader,
  MetricCard,
  DataTable,
  StatusBadge,
  ChartWrapper,
  CHART_THEME,
  CHART_COLORS,
  LoadingSkeleton,
  ErrorState,
  EmptyState,
} from '@/components';
import { Megaphone, AlertTriangle } from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { useAdCampaigns, useAdMetrics } from '../../hooks/seo-events-hooks';
import type { AdCampaign } from '../../types/seo-events';
import { AdDrawer } from './AdDrawer';
import { legendFormatter } from '@/components';

const ACCENT = '#EC4899';

const PLATFORM_LABELS: Record<string, string> = { google: 'Google', programmatic: 'Programmatic', 'cannabis-specific': 'Cannabis Network' };
const STATUS_VARIANTS: Record<string, 'success' | 'info' | 'warning' | 'danger' | 'muted'> = { active: 'success', paused: 'warning', completed: 'muted', draft: 'info' };
const COMPLIANCE_VARIANTS: Record<string, 'success' | 'warning' | 'danger'> = { approved: 'success', 'pending-review': 'warning', flagged: 'danger' };
const PLATFORM_COLORS: Record<string, string> = { google: CHART_COLORS.info, programmatic: CHART_COLORS.purple, 'cannabis-specific': CHART_COLORS.success };

export function PaidAdsPage() {
  const { data: metrics, isLoading: metricsLoading, error: metricsError, refetch } = useAdMetrics();
  const { data: campaigns, isLoading: campaignsLoading } = useAdCampaigns();
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

  if (metricsLoading) return <LoadingSkeleton variant="card" count={4} />;
  if (metricsError) return <ErrorState title="Failed to load ad data" message={metricsError.message} onRetry={refetch} />;

  const selectedCampaign = campaigns?.find((c) => c.id === selectedCampaignId) ?? null;

  // Spend by platform donut
  const platformSpend = (campaigns ?? []).reduce<Record<string, number>>((acc, c) => {
    acc[c.platform] = (acc[c.platform] ?? 0) + c.spent;
    return acc;
  }, {});
  const donutData = Object.entries(platformSpend).map(([platform, spent]) => ({
    name: PLATFORM_LABELS[platform] ?? platform,
    value: spent,
    color: PLATFORM_COLORS[platform] ?? ACCENT,
  }));

  // Performance trend (monthly simulated from campaigns)
  const trendData = [
    { month: 'Oct', impressions: 28000, ctr: 1.4 },
    { month: 'Nov', impressions: 35000, ctr: 1.6 },
    { month: 'Dec', impressions: 62000, ctr: 2.1 },
    { month: 'Jan', impressions: 57000, ctr: 1.9 },
    { month: 'Feb', impressions: 85000, ctr: 2.0 },
    { month: 'Mar', impressions: 145000, ctr: 1.8 },
  ];

  const columns = [
    { header: 'Campaign', accessor: 'name' as const, sortable: true },
    {
      header: 'Platform', accessor: 'platform' as const,
      render: (row: AdCampaign) => (
        <span className="rounded-full px-2 py-0.5 text-[11px]" style={{ backgroundColor: `${PLATFORM_COLORS[row.platform] ?? ACCENT}20`, color: PLATFORM_COLORS[row.platform] ?? ACCENT }}>
          {PLATFORM_LABELS[row.platform]}
        </span>
      ),
      hideBelow: 'md' as const,
    },
    { header: 'Status', accessor: 'status' as const, render: (row: AdCampaign) => <StatusBadge variant={STATUS_VARIANTS[row.status] ?? 'muted'} label={row.status} size="sm" /> },
    { header: 'Budget', accessor: 'budget' as const, sortable: true, render: (row: AdCampaign) => `$${row.budget.toLocaleString()}`, hideBelow: 'lg' as const },
    { header: 'Spent', accessor: 'spent' as const, sortable: true, render: (row: AdCampaign) => `$${row.spent.toLocaleString()}` },
    { header: 'Impressions', accessor: 'impressions' as const, sortable: true, render: (row: AdCampaign) => row.impressions.toLocaleString(), hideBelow: 'md' as const },
    {
      header: 'CTR', accessor: 'clicks' as const, sortable: true,
      render: (row: AdCampaign) => row.impressions > 0 ? `${((row.clicks / row.impressions) * 100).toFixed(1)}%` : '—',
      hideBelow: 'lg' as const,
    },
    { header: 'CPC', accessor: 'cpc' as const, render: (row: AdCampaign) => row.cpc > 0 ? `$${row.cpc.toFixed(2)}` : '—', hideBelow: 'lg' as const },
    { header: 'Conv.', accessor: 'conversions' as const, sortable: true, render: (row: AdCampaign) => row.conversions },
    {
      header: 'Compliance', accessor: 'complianceStatus' as const,
      render: (row: AdCampaign) => <StatusBadge variant={COMPLIANCE_VARIANTS[row.complianceStatus] ?? 'muted'} label={row.complianceStatus} size="sm" dot />,
    },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader icon={Megaphone} title="Paid Ads" subtitle="Campaign management, spend tracking, and compliance" accentColor={ACCENT} />

      {/* Compliance Banner */}
      <div className="flex items-start gap-3 rounded-xl border border-warning/30 bg-warning/10 p-4">
        <AlertTriangle className="mt-0.5 h-5 w-5 text-warning" />
        <div>
          <p className="text-sm font-medium text-warning">WSLCB Cannabis Advertising Compliance</p>
          <p className="mt-0.5 text-xs text-text-muted">Cannabis advertising is subject to strict regulations. All campaigns must be reviewed for compliance before activation. No targeting minors, no health claims.</p>
        </div>
      </div>

      {/* Metrics Row */}
      {metrics && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <MetricCard label="Active Campaigns" value={metrics.activeCampaigns} accentColor={ACCENT} />
          <MetricCard label="Total Spend" value={`$${metrics.totalSpendMTD.toLocaleString()}`} accentColor={ACCENT} />
          <MetricCard label="Impressions" value={metrics.totalImpressions.toLocaleString()} accentColor={ACCENT} />
          <MetricCard label="Avg CPC" value={`$${metrics.avgCPC.toFixed(2)}`} accentColor={ACCENT} />
          <MetricCard label="Conversions" value={metrics.totalConversions} accentColor={ACCENT} />
          <MetricCard
            label="Flagged"
            value={metrics.flaggedCampaigns}
            accentColor={metrics.flaggedCampaigns > 0 ? '#FB7185' : ACCENT}
          />
        </div>
      )}

      {/* Campaign Table */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-text-bright">Campaigns</h2>
        {campaignsLoading ? (
          <LoadingSkeleton variant="table" />
        ) : campaigns && campaigns.length > 0 ? (
          <DataTable
            data={campaigns}
            columns={columns}
            searchable
            searchPlaceholder="Search campaigns..."
            onRowClick={(row) => setSelectedCampaignId(row.id)}
            pageSize={10}
            emptyState={{ icon: Megaphone, title: 'No campaigns', accentColor: ACCENT }}
          />
        ) : (
          <EmptyState icon={Megaphone} title="No campaigns" description="Create your first ad campaign." accentColor={ACCENT} />
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {/* Spend by Platform */}
        {donutData.length > 0 && (
          <ChartWrapper title="Spend by Platform" height={260}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donutData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3}>
                  {donutData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 8, color: CHART_THEME.tooltipText }}
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Spend']}
                />
                <Legend formatter={legendFormatter} />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>
        )}

        {/* Performance Trend */}
        <ChartWrapper title="Impressions & CTR Trend" height={260}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridColor} />
              <XAxis dataKey="month" tick={{ fill: CHART_THEME.axisColor, fontSize: 12 }} />
              <YAxis yAxisId="left" tick={{ fill: CHART_THEME.axisColor, fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: CHART_THEME.axisColor, fontSize: 12 }} unit="%" />
              <Tooltip
                contentStyle={{ backgroundColor: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 8, color: CHART_THEME.tooltipText }}
              />
              <Line yAxisId="left" type="monotone" dataKey="impressions" stroke={ACCENT} strokeWidth={2} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="ctr" stroke={CHART_COLORS.info} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </div>

      <AdDrawer campaign={selectedCampaign} onClose={() => setSelectedCampaignId(null)} />
    </div>
  );
}
