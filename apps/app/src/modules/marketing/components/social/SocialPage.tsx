'use client';

import { Fragment, useState } from 'react';
import {
  Share2,
  Instagram,
  Facebook,
  Twitter,
  Send,
  Heart,
  Upload,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  LayoutDashboard,
  PenSquare,
  Sparkles,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  SectionHeader,
  MetricCard,
  StatusBadge,
  LoadingSkeleton,
  ChartWrapper,
  CHART_THEME,
  DataTable,
  ModuleTabs,
} from '@/components';
import type { TabItem } from '@/components';
import {
  useSocialAccounts,
  useSocialPosts,
  useMarketingMetrics,
  usePostingTimesHeatMap,
  useFollowerGrowth,
  useEngagementByContentType,
  useHashtagSuggestions,
} from '@/modules/marketing/hooks';
import { getEngagementData } from '@/mocks/marketing';
import type { SocialAccount, SocialPost } from '@/modules/marketing/types';
import { ACCENT } from '@/design/colors';


type TabKey = 'dashboard' | 'composer' | 'analytics';

const TABS: TabItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'composer', label: 'Post Composer', icon: PenSquare },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  instagram: <Instagram className="h-5 w-5" />,
  facebook: <Facebook className="h-5 w-5" />,
  twitter: <Twitter className="h-5 w-5" />,
};

const PLATFORM_COLORS: Record<string, string> = {
  instagram: '#E1306C',
  facebook: '#1877F2',
  twitter: '#1DA1F2',
};

const PLATFORM_GROWTH: Record<string, number> = {
  instagram: 320,
  facebook: 85,
  twitter: 45,
};

const CHAR_LIMITS: Record<string, number> = {
  instagram: 2200,
  twitter: 280,
  facebook: 63206,
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function AccountCard({ account }: { account: SocialAccount }) {
  const color = PLATFORM_COLORS[account.platform] ?? ACCENT;
  const growth = PLATFORM_GROWTH[account.platform] ?? 0;
  return (
    <div className="rounded-xl bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg p-2" style={{ backgroundColor: `${color}20`, color }}>
            {PLATFORM_ICONS[account.platform]}
          </div>
          <div>
            <p className="text-sm font-semibold text-text-default">{account.handle}</p>
            <p className="text-xs text-text-muted capitalize">{account.platform}</p>
          </div>
        </div>
        {account.status === 'pending'
          ? <StatusBadge status="pending" size="sm" />
          : <StatusBadge label={account.status} variant={account.status === 'connected' ? 'success' : 'muted'} size="sm" />
        }
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center">
          <p className="text-lg font-bold text-text-default">{account.followers.toLocaleString()}</p>
          <p className="text-[10px] text-text-muted">Followers</p>
          {growth > 0 && (
            <p className="text-[10px] font-medium text-green-400">+{growth} this month</p>
          )}
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-text-default">{account.postsCount}</p>
          <p className="text-[10px] text-text-muted">Posts</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold" style={{ color }}>{account.engagementRate}%</p>
          <p className="text-[10px] text-text-muted">Engagement</p>
        </div>
      </div>
      {account.lastPost && (
        <p className="mt-2 text-[10px] text-text-muted">
          Last post: {new Date(account.lastPost).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

export function SocialPage() {
  const { data: accounts, isLoading: accountsLoading } = useSocialAccounts();
  const { data: posts, isLoading: postsLoading } = useSocialPosts();
  const { data: metrics, isLoading: metricsLoading } = useMarketingMetrics();
  const { data: heatMapData } = usePostingTimesHeatMap();
  const { data: followerGrowthData } = useFollowerGrowth();
  const { data: engagementByType } = useEngagementByContentType();
  const { data: hashtagSuggestions } = useHashtagSuggestions();

  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const [composerText, setComposerText] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram']);
  const [showScheduler, setShowScheduler] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');

  const isLoading = accountsLoading || postsLoading || metricsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <LoadingSkeleton variant="text" />
        <LoadingSkeleton variant="card" count={3} />
        <LoadingSkeleton variant="table" />
      </div>
    );
  }

  const engagementData = getEngagementData();
  const totalFollowers = accounts?.reduce((sum, a) => sum + a.followers, 0) ?? 0;
  const bestPost = posts?.reduce(
    (best, p) =>
      (p.performance?.engagementRate ?? 0) > (best?.performance?.engagementRate ?? 0) ? p : best,
    posts[0],
  );

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform],
    );
  };

  const mostRestrictiveLimit = Math.min(
    ...selectedPlatforms.map((p) => CHAR_LIMITS[p] ?? Infinity),
  );

  const hasComplianceIssue = composerText
    .toLowerCase()
    .match(/medical|health|cure|treat|anxiety|pain|sleep|disease/);

  const top5 = [...(posts ?? [])]
    .sort((a, b) => (b.performance?.engagementRate ?? 0) - (a.performance?.engagementRate ?? 0))
    .slice(0, 5);

  const postColumns: {
    header: string;
    accessor: keyof SocialPost | ((row: SocialPost) => unknown);
    sortable?: boolean;
    hideBelow?: 'sm' | 'md' | 'lg';
    render?: (row: SocialPost) => React.ReactNode;
  }[] = [
    {
      header: 'Date',
      accessor: 'publishedDate',
      sortable: true,
      render: (row: SocialPost) =>
        row.publishedDate ? new Date(row.publishedDate).toLocaleDateString() : '--',
    },
    {
      header: 'Platform',
      accessor: 'platform',
      sortable: true,
      render: (row: SocialPost) => (
        <span className="capitalize">{row.platform}</span>
      ),
    },
    {
      header: 'Content',
      accessor: 'title',
      render: (row: SocialPost) => (
        <span className="truncate block max-w-[200px]">{row.title}</span>
      ),
    },
    {
      header: 'Impressions',
      accessor: (row: SocialPost) => row.performance?.impressions ?? 0,
      sortable: true,
      hideBelow: 'md',
      render: (row: SocialPost) => (row.performance?.impressions ?? 0).toLocaleString(),
    },
    {
      header: 'Likes',
      accessor: (row: SocialPost) => row.performance?.engagement ?? 0,
      sortable: true,
      hideBelow: 'md',
      render: (row: SocialPost) => (row.performance?.engagement ?? 0).toLocaleString(),
    },
    {
      header: 'Comments',
      accessor: 'comments',
      sortable: true,
      hideBelow: 'lg',
    },
    {
      header: 'Shares',
      accessor: 'shares',
      sortable: true,
      hideBelow: 'lg',
    },
    {
      header: 'Eng Rate',
      accessor: (row: SocialPost) => row.performance?.engagementRate ?? 0,
      sortable: true,
      render: (row: SocialPost) => (
        <span style={{ color: ACCENT }}>{row.performance?.engagementRate ?? 0}%</span>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <SectionHeader
        icon={Share2}
        title="Social Media"
        subtitle="Manage social presence across all platforms"
        accentColor={ACCENT}
        stats={[
          { label: 'Connected', value: accounts?.filter((a) => a.status === 'connected').length ?? 0 },
          { label: 'Total Followers', value: totalFollowers.toLocaleString() },
        ]}
      />

      <ModuleTabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab as (id: string) => void} accentColor={ACCENT} />

      {/* ─── Dashboard Tab ──────────────────────────────────────────────── */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Connected Accounts */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {(accounts ?? []).map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <MetricCard label="Total Followers" value={totalFollowers.toLocaleString()} accentColor={ACCENT} />
            <MetricCard label="Posts This Month" value={metrics?.postsThisMonth ?? 0} accentColor="#5BB8E6" />
            <MetricCard label="Avg Engagement" value={`${metrics?.avgEngagementRate ?? 0}%`} accentColor="#5BB8E6" />
            <MetricCard label="Best Post" value={`${bestPost?.performance?.engagementRate ?? 0}%`} accentColor="#5BB8E6" />
          </div>

          {/* Recent Posts Thumbnail Grid */}
          <div className="rounded-xl bg-card p-4">
            <h4 className="mb-3 text-sm font-semibold text-text-default">Recent Posts</h4>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {(posts ?? []).slice(0, 12).map((post) => (
                <div
                  key={post.id}
                  className="group relative aspect-square rounded-lg overflow-hidden"
                  style={{ backgroundColor: `${PLATFORM_COLORS[post.platform] ?? ACCENT}20` }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    {PLATFORM_ICONS[post.platform]}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1 text-[10px] text-white flex items-center gap-2">
                    <Heart className="h-3 w-3" /> {post.performance?.engagement ?? 0}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Engagement Trend Chart */}
          <ChartWrapper title="Engagement Rate (30 Days)" height={280}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engagementData}>
                <XAxis
                  dataKey="date"
                  stroke={CHART_THEME.axisColor}
                  fontSize={10}
                  tickFormatter={(val: string) => val.slice(5)}
                  interval={4}
                />
                <YAxis
                  stroke={CHART_THEME.axisColor}
                  fontSize={10}
                  tickFormatter={(val: number) => `${val}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: CHART_THEME.tooltipBg,
                    border: `1px solid ${CHART_THEME.tooltipBorder}`,
                    borderRadius: 8,
                    color: CHART_THEME.tooltipText,
                  }}
                  formatter={(value) => [`${value}%`, undefined]}
                  labelFormatter={(label) => new Date(String(label)).toLocaleDateString()}
                />
                <Line type="monotone" dataKey="instagram" stroke="#E1306C" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="facebook" stroke="#1877F2" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="twitter" stroke="#1DA1F2" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartWrapper>

          {/* Best Posting Times Heat Map */}
          {heatMapData && heatMapData.length > 0 && (
            <div className="rounded-xl bg-card p-4">
              <h4 className="mb-3 text-sm font-semibold text-text-default">Best Posting Times</h4>
              <div className="grid grid-cols-[auto_repeat(12,1fr)] gap-1">
                <div /> {/* empty corner */}
                {Array.from({ length: 12 }, (_, h) => (
                  <div key={h} className="text-center text-[9px] text-text-muted">
                    {h * 2}:00
                  </div>
                ))}
                {DAYS.map((day, d) => (
                  <Fragment key={day}>
                    <div className="pr-2 text-right text-[10px] text-text-muted leading-6">
                      {day}
                    </div>
                    {heatMapData
                      .filter((h) => h.day === d)
                      .map((cell) => (
                        <div
                          key={cell.hour}
                          className="h-6 rounded-sm"
                          style={{
                            backgroundColor: ACCENT,
                            opacity: cell.engagement / 100,
                          }}
                          title={`${day} ${cell.hour}:00 — ${cell.engagement}% engagement`}
                        />
                      ))}
                  </Fragment>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── Post Composer Tab ──────────────────────────────────────────── */}
      {activeTab === 'composer' && (
        <div className="space-y-6">
          {/* Text Area with Character Counter */}
          <div className="rounded-xl bg-card p-4">
            <h3 className="mb-3 text-sm font-semibold text-text-default">Create Post</h3>
            <textarea
              value={composerText}
              onChange={(e) => setComposerText(e.target.value)}
              placeholder="What's on your mind? Write your caption here..."
              className="mb-2 w-full resize-none rounded-lg border border-default bg-base px-3 py-2 text-sm text-text-default placeholder:text-text-muted focus:border-[#5BB8E6]/50 focus:outline-none"
              rows={4}
            />
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-text-muted">
                {composerText.length} / {mostRestrictiveLimit === Infinity ? '---' : mostRestrictiveLimit}
              </p>
              {/* WSLCB Compliance Check */}
              <div className="flex items-center gap-1.5 text-xs">
                {hasComplianceIssue ? (
                  <>
                    <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                    <span className="text-red-400">WSLCB: Potential compliance issue</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-3.5 w-3.5 text-green-400" />
                    <span className="text-green-400">WSLCB compliant</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Image Upload Area */}
          <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-default bg-base text-text-muted">
            <div className="text-center">
              <Upload className="mx-auto h-6 w-6 mb-1" />
              <p className="text-xs">Drop image or click to upload</p>
            </div>
          </div>

          {/* Platform Toggles */}
          <div className="rounded-xl bg-card p-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs text-text-muted">Platforms:</span>
              {(['instagram', 'facebook', 'twitter'] as const).map((platform) => {
                const isActive = selectedPlatforms.includes(platform);
                const color = PLATFORM_COLORS[platform];
                return (
                  <button
                    key={platform}
                    onClick={() => togglePlatform(platform)}
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                      isActive
                        ? 'text-white'
                        : 'border border-default text-text-muted hover:text-text-default'
                    }`}
                    style={isActive ? { backgroundColor: color } : undefined}
                  >
                    {PLATFORM_ICONS[platform]}
                    <span className="hidden sm:inline capitalize">{platform}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Platform Preview Cards */}
          {selectedPlatforms.length > 0 && (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {selectedPlatforms.map((platform) => (
                <div key={platform} className="rounded-xl border border-default bg-base p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="rounded-full p-1"
                      style={{ backgroundColor: PLATFORM_COLORS[platform] }}
                    >
                      {PLATFORM_ICONS[platform]}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-text-default">@frostfarms_wa</p>
                      <p className="text-[10px] text-text-muted">Preview</p>
                    </div>
                  </div>
                  <p className="text-xs text-text-muted">
                    {composerText || 'Your post preview will appear here...'}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Hashtag Suggestions */}
          {hashtagSuggestions && hashtagSuggestions.length > 0 && (
            <div className="rounded-xl bg-card p-4">
              <h4 className="mb-2 text-sm font-semibold text-text-default">Hashtag Suggestions</h4>
              <div className="flex flex-wrap gap-1.5">
                {hashtagSuggestions.slice(0, 8).map((s) => (
                  <button
                    key={s.tag}
                    onClick={() => setComposerText((prev) => prev + ' ' + s.tag)}
                    className="rounded-full border border-default px-2 py-1 text-[10px] text-text-muted hover:border-[#5BB8E6]/50"
                  >
                    {s.tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Scheduling & Post Actions */}
          <div className="rounded-xl bg-card p-4">
            <div className="flex flex-wrap items-center gap-2">
              <button className="flex items-center gap-1.5 rounded-lg border border-default px-3 py-1.5 text-xs text-text-muted hover:text-text-default transition-colors">
                <Sparkles className="h-3.5 w-3.5" style={{ color: ACCENT }} />
                AI Assist
              </button>
              <button
                onClick={() => setShowScheduler((prev) => !prev)}
                className={`rounded-lg border border-default px-3 py-1.5 text-xs transition-colors ${
                  showScheduler ? 'text-text-default border-[#5BB8E6]/50' : 'text-text-muted hover:text-text-default'
                }`}
              >
                Schedule
              </button>
              <button
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-colors hover:opacity-90"
                style={{ backgroundColor: ACCENT }}
              >
                <Send className="h-3.5 w-3.5" />
                Post Now
              </button>
            </div>
            {showScheduler && (
              <div className="mt-3">
                <input
                  type="datetime-local"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="rounded-lg border border-default bg-base px-3 py-1.5 text-xs text-text-default focus:border-[#5BB8E6]/50 focus:outline-none"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Analytics Tab ──────────────────────────────────────────────── */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Post Performance DataTable */}
          <div className="rounded-xl bg-card p-4">
            <h4 className="mb-3 text-sm font-semibold text-text-default">Post Performance</h4>
            <DataTable<SocialPost>
              data={posts ?? []}
              columns={postColumns}
              searchable
              searchPlaceholder="Search posts..."
              pageSize={10}
              emptyState={{
                title: 'No posts yet',
                description: 'Create your first post in the Composer tab',
                accentColor: ACCENT,
              }}
            />
          </div>

          {/* Top 5 Performing Posts */}
          <div className="rounded-xl bg-card p-4">
            <h4 className="mb-3 text-sm font-semibold text-text-default">Top Performing Posts</h4>
            <div className="space-y-2">
              {top5.map((post, i) => (
                <div
                  key={post.id}
                  className="flex items-center gap-3 rounded-xl bg-card p-3"
                >
                  <span className="text-lg font-bold text-text-muted">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-default truncate">{post.title}</p>
                    <p className="text-xs text-text-muted">
                      {post.platform} &middot;{' '}
                      {post.publishedDate
                        ? new Date(post.publishedDate).toLocaleDateString()
                        : '--'}
                    </p>
                  </div>
                  <p className="text-lg font-bold" style={{ color: ACCENT }}>
                    {post.performance?.engagementRate ?? 0}%
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Follower Growth Chart */}
          {followerGrowthData && followerGrowthData.length > 0 && (
            <ChartWrapper title="Follower Growth" height={280}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={followerGrowthData}>
                  <XAxis
                    dataKey="date"
                    stroke={CHART_THEME.axisColor}
                    fontSize={10}
                    tickFormatter={(val: string) => val.slice(5)}
                    interval={4}
                  />
                  <YAxis stroke={CHART_THEME.axisColor} fontSize={10} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: CHART_THEME.tooltipBg,
                      border: `1px solid ${CHART_THEME.tooltipBorder}`,
                      borderRadius: 8,
                      color: CHART_THEME.tooltipText,
                    }}
                    labelFormatter={(label) => new Date(String(label)).toLocaleDateString()}
                  />
                  <Line type="monotone" dataKey="instagram" stroke="#E1306C" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="facebook" stroke="#1877F2" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="twitter" stroke="#1DA1F2" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartWrapper>
          )}

          {/* Engagement by Content Type */}
          {engagementByType && engagementByType.length > 0 && (
            <ChartWrapper title="Engagement by Content Type" height={280}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={engagementByType}>
                  <XAxis dataKey="type" stroke={CHART_THEME.axisColor} fontSize={10} />
                  <YAxis
                    stroke={CHART_THEME.axisColor}
                    fontSize={10}
                    tickFormatter={(val: number) => `${val}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: CHART_THEME.tooltipBg,
                      border: `1px solid ${CHART_THEME.tooltipBorder}`,
                      borderRadius: 8,
                      color: CHART_THEME.tooltipText,
                    }}
                    formatter={(value) => [`${value}%`, 'Engagement']}
                  />
                  <Bar dataKey="engagement" fill={ACCENT} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartWrapper>
          )}
        </div>
      )}
    </div>
  );
}
