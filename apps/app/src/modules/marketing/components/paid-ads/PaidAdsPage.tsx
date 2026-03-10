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
  legendFormatter,
} from '@/components';
import { Megaphone, CheckCircle2, AlertTriangle } from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  BarChart, Bar,
} from 'recharts';
import { useAdCampaigns, useAdMetrics, useComplianceChecklist } from '../../hooks/seo-events-hooks';
import type { AdCampaign } from '../../types/seo-events';
import { AdDrawer } from './AdDrawer';
import { ACCENT } from '@/design/colors';


const PLATFORM_LABELS: Record<string, string> = {
  google: 'Google Ads',
  programmatic: 'Programmatic',
  'cannabis-specific': 'Cannabis Network',
  'email-retargeting': 'Email Retargeting',
};
const STATUS_VARIANTS: Record<string, 'success' | 'info' | 'warning' | 'danger' | 'muted'> = { active: 'success', paused: 'warning', completed: 'muted', draft: 'info' };
const COMPLIANCE_VARIANTS: Record<string, 'success' | 'warning' | 'danger'> = { approved: 'success', 'pending-review': 'warning', flagged: 'danger' };
const PLATFORM_COLORS: Record<string, string> = {
  google: CHART_COLORS.info,
  programmatic: CHART_COLORS.purple,
  'cannabis-specific': CHART_COLORS.success,
  'email-retargeting': '#5BB8E6',
};

export function PaidAdsPage() {
  const { data: metrics, isLoading: metricsLoading, error: metricsError, refetch } = useAdMetrics();
  const { data: campaigns, isLoading: campaignsLoading } = useAdCampaigns();
  const { data: complianceItems } = useComplianceChecklist();
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

  if (metricsLoading) return <LoadingSkeleton variant="card" count={4} />;
  if (metricsError) return <ErrorState title="Failed to load ad data" message={metricsError.message} onRetry={refetch} />;

  const selectedCampaign = campaigns?.find((c) => c.id === selectedCampaignId) ?? null;

  // Spend by platform donut
  const platformSpend = (campaigns ?? []).reduce<Record<string, number>>((acc, c) => {
    if (c.status === 'active' || c.status === 'paused') {
      acc[c.platform] = (acc[c.platform] ?? 0) + c.spent;
    }
    return acc;
  }, {});
  const donutData = Object.entries(platformSpend).map(([platform, spent]) => ({
    name: PLATFORM_LABELS[platform] ?? platform,
    value: spent,
    color: PLATFORM_COLORS[platform] ?? ACCENT,
  }));

  // Spend vs Conversions trend (simulated 30-day)
  const spendTrend = [
    { week: 'Week 1', spend: 420, conversions: 18 },
    { week: 'Week 2', spend: 510, conversions: 22 },
    { week: 'Week 3', spend: 480, conversions: 25 },
    { week: 'Week 4', spend: 590, conversions: 24 },
  ];

  // CTR by campaign
  const ctrData = (campaigns ?? [])
    .filter((c) => c.impressions > 0)
    .map((c) => ({
      name: c.name.length > 20 ? c.name.slice(0, 20) + '...' : c.name,
      ctr: Number(((c.clicks / c.impressions) * 100).toFixed(1)),
    }));

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
    { header: 'Status', accessor: 'status' as const, render: (row: AdCampaign) => (row.status === 'active' || row.status === 'draft') ? <StatusBadge status={row.status as 'active' | 'draft'} size="sm" /> : <StatusBadge variant={STATUS_VARIANTS[row.status] ?? 'muted'} label={row.status} size="sm" /> },
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
      render: (row: AdCampaign) => row.complianceStatus === 'approved' ? <StatusBadge status="approved" size="sm" /> : <StatusBadge variant={COMPLIANCE_VARIANTS[row.complianceStatus] ?? 'muted'} label={row.complianceStatus} size="sm" dot />,
    },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader icon={Megaphone} title="Paid Ads" subtitle="Campaign management, spend tracking, and compliance" accentColor={ACCENT} />

      {/* WSLCB Compliance Panel */}
      <div className="rounded-xl border border-default bg-card p-4">
        <h3 className="mb-3 text-sm font-semibold text-text-bright">WSLCB Compliance Status</h3>
        <div className="space-y-2">
          {complianceItems?.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              {item.status === 'pass' ? (
                <CheckCircle2 className="h-4 w-4 text-success" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-warning" />
              )}
              <span className={`text-sm ${item.status === 'pass' ? 'text-default' : 'text-warning'}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Metrics Row */}
      {metrics && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <MetricCard label="Active Campaigns" value={metrics.activeCampaigns} accentColor={ACCENT} />
          <MetricCard label="Ad Spend" value={`$${metrics.totalSpendMTD.toLocaleString()} / $${metrics.totalBudget.toLocaleString()}`} accentColor={ACCENT} />
          <MetricCard label="Impressions" value={metrics.totalImpressions.toLocaleString()} accentColor={ACCENT} />
          <MetricCard label="Clicks" value={metrics.totalClicks.toLocaleString()} accentColor={ACCENT} />
          <MetricCard label="Avg CPC" value={`$${metrics.avgCPC.toFixed(2)}`} accentColor={ACCENT} />
          <MetricCard label="Conversions" value={metrics.totalConversions} accentColor={ACCENT} />
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
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {/* Spend by Platform */}
        {donutData.length > 0 && (
          <ChartWrapper title="Spend Allocation" height={260}>
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

        {/* Spend vs Conversions */}
        <ChartWrapper title="Spend vs Conversions" subtitle="Weekly trend" height={260}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={spendTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridColor} />
              <XAxis dataKey="week" tick={{ fill: CHART_THEME.axisColor, fontSize: 12 }} />
              <YAxis yAxisId="left" tick={{ fill: CHART_THEME.axisColor, fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: CHART_THEME.axisColor, fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 8, color: CHART_THEME.tooltipText }}
              />
              <Line yAxisId="left" type="monotone" dataKey="spend" stroke={ACCENT} strokeWidth={2} dot={false} name="Spend ($)" />
              <Line yAxisId="right" type="monotone" dataKey="conversions" stroke={CHART_COLORS.info} strokeWidth={2} dot={false} name="Conversions" />
            </LineChart>
          </ResponsiveContainer>
        </ChartWrapper>

        {/* CTR by Campaign */}
        {ctrData.length > 0 && (
          <ChartWrapper title="CTR by Campaign" height={260}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ctrData} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridColor} horizontal={false} />
                <XAxis type="number" tick={{ fill: CHART_THEME.axisColor, fontSize: 12 }} unit="%" />
                <YAxis dataKey="name" type="category" width={140} tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 8, color: CHART_THEME.tooltipText }}
                  formatter={(value) => [`${value}%`, 'CTR']}
                />
                <Bar dataKey="ctr" fill={ACCENT} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartWrapper>
        )}
      </div>

      <AdDrawer campaign={selectedCampaign} onClose={() => setSelectedCampaignId(null)} />
    </div>
  );
}
