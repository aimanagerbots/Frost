'use client';

import { Fragment, useState } from 'react';
import {
  SendHorizonal, Users, TrendingUp, LayoutDashboard,
  PenSquare, Palette, BarChart3, Plus, ChevronRight, ChevronLeft, Mail,
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  SectionHeader, MetricCard, DataTable, StatusBadge,
  LoadingSkeleton, ChartWrapper, CHART_THEME, DrawerPanel,
  ModuleTabs,
} from '@/components';
import type { TabItem } from '@/components';
import { useEmailCampaigns, useEmailTemplates, useMarketingMetrics, useCampaignPerformanceTrend } from '@/modules/marketing/hooks';
import { getListHealthTrend } from '@/mocks/marketing';
import { CampaignDrawer } from './CampaignDrawer';
import type { EmailCampaign, EmailTemplate } from '@/modules/marketing/types';
import { ACCENT } from '@/design/colors';


type TabKey = 'campaigns' | 'builder' | 'templates' | 'performance';

const TABS: TabItem[] = [
  { id: 'campaigns', label: 'Campaigns', icon: LayoutDashboard },
  { id: 'builder', label: 'Builder', icon: PenSquare },
  { id: 'templates', label: 'Templates', icon: Palette },
  { id: 'performance', label: 'Performance', icon: BarChart3 },
];

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

const BUILDER_STEPS = ['Details', 'Audience', 'Template', 'Content', 'Schedule', 'Review'];

const AUDIENCE_SEGMENTS = [
  'All Active Accounts',
  'New Accounts Last 30 Days',
  'Flower Buyers',
  'Vaporizer Buyers',
  'Inactive Accounts',
  'Seattle Territory',
];

const PERSONALIZATION_TOKENS = ['{account_name}', '{contact_name}', '{recommended_products}', '{rep_name}'];

export function EmailMarketingPage() {
  const { data: campaigns, isLoading: campaignsLoading } = useEmailCampaigns();
  const { data: templates, isLoading: templatesLoading } = useEmailTemplates();
  const { data: metrics, isLoading: metricsLoading } = useMarketingMetrics();
  const { data: trendData } = useCampaignPerformanceTrend('ec-009');

  const [activeTab, setActiveTab] = useState<TabKey>('campaigns');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);

  // Builder state
  const [builderStep, setBuilderStep] = useState<number>(1);
  const [builderData, setBuilderData] = useState({
    name: '',
    type: 'one-time' as string,
    audience: '',
    templateId: '',
    subject: '',
    previewText: '',
    body: '',
    scheduleType: 'now' as string,
    scheduledDate: '',
    frequency: 'weekly' as string,
  });

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
  const featuredCampaigns = (campaigns ?? []).filter(
    (c) => c.status === 'sent' || c.status === 'sending',
  ).slice(0, 3);

  const sentCampaigns = (campaigns ?? []).filter((c) => c.status === 'sent' && c.stats);

  const updateBuilder = (field: string, value: string) => {
    setBuilderData((prev) => ({ ...prev, [field]: value }));
  };

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

      <ModuleTabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab as (id: string) => void} accentColor={ACCENT} />

      {/* ═══════════════════ CAMPAIGNS TAB ═══════════════════ */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          {/* Featured Campaign Cards */}
          {featuredCampaigns.length > 0 && (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {featuredCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="rounded-xl border border-default bg-card p-4 cursor-pointer hover:bg-accent-hover"
                  onClick={() => setSelectedCampaignId(campaign.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-text-default truncate">{campaign.name}</p>
                    <StatusBadge label={campaign.status} variant={STATUS_VARIANT[campaign.status] ?? 'default'} size="sm" />
                  </div>
                  {campaign.stats && (
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-lg font-bold text-text-default">{campaign.stats.sent.toLocaleString()}</p>
                        <p className="text-[10px] text-text-muted">Sent</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold" style={{ color: ACCENT }}>{campaign.stats.openRate}%</p>
                        <p className="text-[10px] text-text-muted">Open Rate</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-text-default">{campaign.stats.clickRate}%</p>
                        <p className="text-[10px] text-text-muted">Click Rate</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Metrics Row */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-8">
            <MetricCard label="Active Campaigns" value={metrics?.activeCampaigns ?? 0} accentColor={ACCENT} />
            <MetricCard label="Emails Sent (MTD)" value={(metrics?.emailsSentMTD ?? 0).toLocaleString()} accentColor="#5BB8E6" />
            <MetricCard label="Avg Open Rate" value={`${metrics?.avgOpenRate ?? 0}%`} accentColor="#5BB8E6" />
            <MetricCard label="Avg Click Rate" value={`${metrics?.avgClickRate ?? 0}%`} accentColor="#5BB8E6" />
            <MetricCard label="Revenue Attributed" value={`$${((metrics?.revenueAttributed ?? 0) / 1000).toFixed(1)}K`} accentColor="#5BB8E6" />
            <MetricCard label="List Health" value={`${metrics?.listHealth ?? 0}%`} accentColor="#5BB8E6" />
            <MetricCard label="Deliverability" value="97.9%" accentColor="#5BB8E6" />
            <MetricCard label="Spam Complaints" value="0.02%" accentColor="#EF4444" />
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

          {/* Campaign Drawer */}
          <CampaignDrawer
            campaignId={selectedCampaignId}
            open={!!selectedCampaignId}
            onClose={() => setSelectedCampaignId(null)}
          />
        </div>
      )}

      {/* ═══════════════════ BUILDER TAB ═══════════════════ */}
      {activeTab === 'builder' && (
        <div className="space-y-6">
          {/* Step Indicator */}
          <div className="flex items-center gap-2 mb-6">
            {BUILDER_STEPS.map((step, i) => (
              <Fragment key={step}>
                <div className={`flex items-center gap-1.5 ${i + 1 <= builderStep ? 'text-text-default' : 'text-text-muted'}`}>
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                      i + 1 === builderStep
                        ? 'text-white'
                        : i + 1 < builderStep
                          ? 'text-white'
                          : 'border border-default text-text-muted'
                    }`}
                    style={i + 1 <= builderStep ? { backgroundColor: ACCENT } : undefined}
                  >
                    {i + 1 < builderStep ? '\u2713' : i + 1}
                  </div>
                  <span className="hidden sm:inline text-xs">{step}</span>
                </div>
                {i < BUILDER_STEPS.length - 1 && (
                  <div className={`h-px flex-1 ${i + 1 < builderStep ? 'bg-[#5BB8E6]' : 'bg-default'}`} />
                )}
              </Fragment>
            ))}
          </div>

          {/* Step Content */}
          <div className="rounded-xl border border-default bg-card p-6">
            {/* Step 1: Details */}
            {builderStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-text-default">Campaign Details</h3>
                <div>
                  <label className="mb-1 block text-xs text-text-muted">Campaign Name</label>
                  <input
                    type="text"
                    value={builderData.name}
                    onChange={(e) => updateBuilder('name', e.target.value)}
                    placeholder="e.g., March Flower Sale"
                    className="w-full rounded-lg border border-default bg-base px-3 py-2 text-sm text-text-default placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-[#5BB8E6]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-text-muted">Campaign Type</label>
                  <select
                    value={builderData.type}
                    onChange={(e) => updateBuilder('type', e.target.value)}
                    className="w-full rounded-lg border border-default bg-base px-3 py-2 text-sm text-text-default focus:outline-none focus:ring-1 focus:ring-[#5BB8E6]"
                  >
                    <option value="one-time">One-time</option>
                    <option value="recurring">Recurring</option>
                    <option value="drip">Drip Sequence</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 2: Audience */}
            {builderStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-text-default">Select Audience</h3>
                <div>
                  <label className="mb-1 block text-xs text-text-muted">Audience Segment</label>
                  <select
                    value={builderData.audience}
                    onChange={(e) => updateBuilder('audience', e.target.value)}
                    className="w-full rounded-lg border border-default bg-base px-3 py-2 text-sm text-text-default focus:outline-none focus:ring-1 focus:ring-[#5BB8E6]"
                  >
                    <option value="">Choose a segment...</option>
                    {AUDIENCE_SEGMENTS.map((seg) => (
                      <option key={seg} value={seg}>{seg}</option>
                    ))}
                  </select>
                </div>
                {builderData.audience && (
                  <div className="flex items-center gap-2 rounded-lg bg-base p-3">
                    <Users size={14} className="text-text-muted" />
                    <span className="text-xs text-text-muted">Estimated reach:</span>
                    <span className="text-sm font-medium text-text-default">
                      {builderData.audience === 'All Active Accounts' ? '2,680' :
                       builderData.audience === 'New Accounts Last 30 Days' ? '142' :
                       builderData.audience === 'Flower Buyers' ? '1,847' :
                       builderData.audience === 'Vaporizer Buyers' ? '923' :
                       builderData.audience === 'Inactive Accounts' ? '318' : '456'}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Template */}
            {builderStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-text-default">Choose a Template</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {(templates ?? []).map((tmpl) => (
                    <div
                      key={tmpl.id}
                      onClick={() => updateBuilder('templateId', tmpl.id)}
                      className={`cursor-pointer rounded-xl border p-4 transition-colors ${
                        builderData.templateId === tmpl.id
                          ? 'border-[#5BB8E6] bg-card-hover'
                          : 'border-default bg-card hover:bg-accent-hover'
                      }`}
                    >
                      <p className="text-sm font-medium text-text-default">{tmpl.name}</p>
                      <p className="mt-1 text-xs text-text-muted">{tmpl.category}</p>
                      {builderData.templateId === tmpl.id && (
                        <div className="mt-2 flex items-center gap-1 text-xs font-medium" style={{ color: ACCENT }}>
                          <Mail size={12} /> Selected
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Content */}
            {builderStep === 4 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-text-default">Email Content</h3>
                <div>
                  <label className="mb-1 block text-xs text-text-muted">Subject Line</label>
                  <input
                    type="text"
                    value={builderData.subject}
                    onChange={(e) => updateBuilder('subject', e.target.value)}
                    placeholder="e.g., Your favorite strains are back in stock"
                    className="w-full rounded-lg border border-default bg-base px-3 py-2 text-sm text-text-default placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-[#5BB8E6]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-text-muted">Preview Text</label>
                  <input
                    type="text"
                    value={builderData.previewText}
                    onChange={(e) => updateBuilder('previewText', e.target.value)}
                    placeholder="Short preview shown in inbox..."
                    className="w-full rounded-lg border border-default bg-base px-3 py-2 text-sm text-text-default placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-[#5BB8E6]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-text-muted">Body</label>
                  <textarea
                    value={builderData.body}
                    onChange={(e) => updateBuilder('body', e.target.value)}
                    placeholder="Write your email content..."
                    rows={6}
                    className="w-full rounded-lg border border-default bg-base px-3 py-2 text-sm text-text-default placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-[#5BB8E6]"
                  />
                </div>
                <div>
                  <p className="mb-2 text-xs text-text-muted">Personalization Tokens</p>
                  <div className="flex flex-wrap gap-2">
                    {PERSONALIZATION_TOKENS.map((token) => (
                      <button
                        key={token}
                        onClick={() => updateBuilder('body', builderData.body + ` ${token}`)}
                        className="rounded-lg border border-default bg-base px-2.5 py-1 text-xs text-text-default hover:bg-accent-hover transition-colors"
                      >
                        <Plus size={10} className="mr-1 inline" />
                        {token}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Schedule */}
            {builderStep === 5 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-text-default">Schedule</h3>
                <div className="space-y-3">
                  {(['now', 'scheduled', 'recurring'] as const).map((opt) => (
                    <label key={opt} className="flex items-center gap-3 rounded-lg border border-default bg-base p-3 cursor-pointer hover:bg-accent-hover">
                      <input
                        type="radio"
                        name="scheduleType"
                        value={opt}
                        checked={builderData.scheduleType === opt}
                        onChange={() => updateBuilder('scheduleType', opt)}
                        className="accent-[#5BB8E6]"
                      />
                      <span className="text-sm text-text-default">
                        {opt === 'now' ? 'Send Now' : opt === 'scheduled' ? 'Schedule' : 'Set Recurring'}
                      </span>
                    </label>
                  ))}
                </div>
                {builderData.scheduleType === 'scheduled' && (
                  <div>
                    <label className="mb-1 block text-xs text-text-muted">Date & Time</label>
                    <input
                      type="datetime-local"
                      value={builderData.scheduledDate}
                      onChange={(e) => updateBuilder('scheduledDate', e.target.value)}
                      className="w-full rounded-lg border border-default bg-base px-3 py-2 text-sm text-text-default focus:outline-none focus:ring-1 focus:ring-[#5BB8E6]"
                    />
                  </div>
                )}
                {builderData.scheduleType === 'recurring' && (
                  <div>
                    <label className="mb-1 block text-xs text-text-muted">Frequency</label>
                    <select
                      value={builderData.frequency}
                      onChange={(e) => updateBuilder('frequency', e.target.value)}
                      className="w-full rounded-lg border border-default bg-base px-3 py-2 text-sm text-text-default focus:outline-none focus:ring-1 focus:ring-[#5BB8E6]"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Step 6: Review */}
            {builderStep === 6 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-text-default">Review Campaign</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Name', value: builderData.name || '(not set)' },
                    { label: 'Type', value: builderData.type },
                    { label: 'Audience', value: builderData.audience || '(not set)' },
                    { label: 'Template', value: (templates ?? []).find((t) => t.id === builderData.templateId)?.name ?? '(not set)' },
                    { label: 'Subject', value: builderData.subject || '(not set)' },
                    { label: 'Schedule', value: builderData.scheduleType === 'now' ? 'Send Now' : builderData.scheduleType === 'scheduled' ? `Scheduled: ${builderData.scheduledDate}` : `Recurring: ${builderData.frequency}` },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start justify-between rounded-lg bg-base p-3">
                      <span className="text-xs text-text-muted">{item.label}</span>
                      <span className="text-sm font-medium text-text-default text-right max-w-[60%]">{item.value}</span>
                    </div>
                  ))}
                </div>
                <button
                  className="w-full rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: ACCENT }}
                >
                  <SendHorizonal size={14} className="mr-2 inline" />
                  Send Campaign
                </button>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setBuilderStep((s) => Math.max(1, s - 1))}
              disabled={builderStep === 1}
              className="flex items-center gap-1.5 rounded-lg border border-default px-4 py-2 text-xs font-medium text-text-default transition-colors hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} /> Back
            </button>
            {builderStep < 6 && (
              <button
                onClick={() => setBuilderStep((s) => Math.min(6, s + 1))}
                className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: ACCENT }}
              >
                Next <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════ TEMPLATES TAB ═══════════════════ */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-default">Email Templates</h3>
            <button
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: ACCENT }}
            >
              <Plus size={12} /> New Template
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(templates ?? []).map((template) => (
              <div
                key={template.id}
                className="rounded-xl border border-default bg-card p-4 cursor-pointer hover:bg-accent-hover transition-colors"
                onClick={() => setSelectedTemplate(template)}
              >
                <p className="mb-1 text-sm font-medium text-text-default">{template.name}</p>
                <p className="mb-3 text-xs text-text-muted">{template.category}</p>
                <button
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-colors hover:opacity-90"
                  style={{ backgroundColor: ACCENT }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab('builder');
                    setBuilderStep(3);
                    updateBuilder('templateId', template.id);
                  }}
                >
                  Use Template
                </button>
              </div>
            ))}
          </div>

          {/* Subscriber Growth */}
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

          {/* Template Preview Drawer */}
          {selectedTemplate && (
            <DrawerPanel open={!!selectedTemplate} onClose={() => setSelectedTemplate(null)} title={selectedTemplate.name} width="lg">
              <div dangerouslySetInnerHTML={{ __html: selectedTemplate.previewHtml }} className="rounded-lg overflow-hidden" />
            </DrawerPanel>
          )}
        </div>
      )}

      {/* ═══════════════════ PERFORMANCE TAB ═══════════════════ */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          {/* Featured Campaign Header */}
          <div className="flex items-center gap-2">
            <Mail size={16} style={{ color: ACCENT }} />
            <h3 className="text-sm font-semibold text-text-default">Featured Campaign: Morning Reorder Emails</h3>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            <MetricCard label="Sent" value="1,247" accentColor={ACCENT} />
            <MetricCard label="Delivered" value="1,221 (97.9%)" accentColor="#5BB8E6" />
            <MetricCard label="Opened" value="549 (45.0%)" accentColor="#5BB8E6" />
            <MetricCard label="Clicked" value="187 (15.3%)" accentColor="#5BB8E6" />
            <MetricCard label="Orders" value="34" accentColor="#5BB8E6" />
            <MetricCard label="Revenue" value="$127,400" accentColor="#5BB8E6" />
          </div>

          {/* Performance Trend Chart */}
          <div className="rounded-xl border border-default bg-card p-4">
            <h4 className="mb-3 text-sm font-semibold text-text-default">Performance Trend (30 Days)</h4>
            <ChartWrapper height={260}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData ?? []}>
                  <XAxis dataKey="date" stroke={CHART_THEME.axisColor} fontSize={10} tickFormatter={(v: string) => v.slice(5)} />
                  <YAxis stroke={CHART_THEME.axisColor} fontSize={10} unit="%" />
                  <Tooltip
                    contentStyle={{ backgroundColor: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 8, color: CHART_THEME.tooltipText }}
                    formatter={(value) => [`${Number(value)}%`]}
                  />
                  <Line type="monotone" dataKey="openRate" stroke="#5BB8E6" strokeWidth={2} dot={false} name="openRate" />
                  <Line type="monotone" dataKey="clickRate" stroke="#5BB8E6" strokeWidth={2} dot={false} name="clickRate" />
                </LineChart>
              </ResponsiveContainer>
            </ChartWrapper>
            <div className="mt-3 flex items-center justify-center gap-6 text-xs text-text-muted">
              <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-2 rounded-full bg-[#5BB8E6]" /> Open Rate</span>
              <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-2 rounded-full bg-[#5BB8E6]" /> Click Rate</span>
            </div>
          </div>

          {/* Campaign Comparison Table */}
          <div className="rounded-xl border border-default bg-card p-4">
            <h4 className="mb-3 text-sm font-semibold text-text-default">Campaign Comparison</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-default text-xs text-text-muted">
                    <th className="py-2 pr-4 font-medium">Campaign</th>
                    <th className="py-2 pr-4 font-medium text-right">Sent</th>
                    <th className="py-2 pr-4 font-medium text-right">Open Rate</th>
                    <th className="py-2 pr-4 font-medium text-right">Click Rate</th>
                    <th className="py-2 font-medium text-right">Conversions</th>
                  </tr>
                </thead>
                <tbody>
                  {sentCampaigns.map((c) => (
                    <tr
                      key={c.id}
                      className="border-b border-default last:border-0 cursor-pointer hover:bg-accent-hover"
                      onClick={() => setSelectedCampaignId(c.id)}
                    >
                      <td className="py-2.5 pr-4 text-text-default">{c.name}</td>
                      <td className="py-2.5 pr-4 text-right text-text-default">{c.stats?.sent.toLocaleString()}</td>
                      <td className="py-2.5 pr-4 text-right" style={{ color: (c.stats?.openRate ?? 0) >= 40 ? '#5BB8E6' : undefined }}>
                        {c.stats?.openRate}%
                      </td>
                      <td className="py-2.5 pr-4 text-right text-text-default">{c.stats?.clickRate}%</td>
                      <td className="py-2.5 text-right text-text-default">{c.stats?.converted}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Campaign Drawer for clicked rows */}
          <CampaignDrawer
            campaignId={selectedCampaignId}
            open={!!selectedCampaignId}
            onClose={() => setSelectedCampaignId(null)}
          />
        </div>
      )}
    </div>
  );
}
