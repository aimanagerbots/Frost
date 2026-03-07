'use client';

import { useState } from 'react';
import { Share2, Instagram, Facebook, Twitter, Sparkles, Send, Eye, Heart, MessageCircle, Repeat2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { SectionHeader, MetricCard, StatusBadge, LoadingSkeleton, ChartWrapper, CHART_THEME } from '@/components';
import { useSocialAccounts, useSocialPosts, useMarketingMetrics } from '@/modules/marketing/hooks';
import { getEngagementData } from '@/mocks/marketing';
import type { SocialAccount } from '@/modules/marketing/types';

const ACCENT = '#EC4899';

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

function AccountCard({ account }: { account: SocialAccount }) {
  const color = PLATFORM_COLORS[account.platform] ?? ACCENT;
  return (
    <div className="rounded-xl border border-default bg-card p-4">
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
        <StatusBadge
          label={account.status}
          variant={account.status === 'connected' ? 'success' : account.status === 'pending' ? 'warning' : 'muted'}
          size="sm"
        />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center">
          <p className="text-lg font-bold text-text-default">{account.followers.toLocaleString()}</p>
          <p className="text-[10px] text-text-muted">Followers</p>
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

  const [composerText, setComposerText] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram']);

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
  const bestPost = posts?.reduce((best, p) => (p.performance?.engagementRate ?? 0) > (best?.performance?.engagementRate ?? 0) ? p : best, posts[0]);

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform],
    );
  };

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

      {/* Connected Accounts */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {(accounts ?? []).map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MetricCard label="Total Followers" value={totalFollowers.toLocaleString()} accentColor={ACCENT} />
        <MetricCard label="Posts This Month" value={metrics?.postsThisMonth ?? 0} accentColor="#3B82F6" />
        <MetricCard label="Avg Engagement" value={`${metrics?.avgEngagementRate ?? 0}%`} accentColor="#22C55E" />
        <MetricCard label="Best Post" value={`${bestPost?.performance?.engagementRate ?? 0}%`} accentColor="#F59E0B" />
      </div>

      {/* Post Composer */}
      <div className="rounded-xl border border-default bg-card p-4">
        <h3 className="mb-3 text-sm font-semibold text-text-default">Create Post</h3>
        <textarea
          value={composerText}
          onChange={(e) => setComposerText(e.target.value)}
          placeholder="What's on your mind? Write your caption here..."
          className="mb-3 w-full resize-none rounded-lg border border-default bg-base px-3 py-2 text-sm text-text-default placeholder:text-text-muted focus:border-[#EC4899]/50 focus:outline-none"
          rows={3}
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted">Platforms:</span>
            {(['instagram', 'facebook', 'twitter'] as const).map((platform) => {
              const isActive = selectedPlatforms.includes(platform);
              const color = PLATFORM_COLORS[platform];
              return (
                <button
                  key={platform}
                  onClick={() => togglePlatform(platform)}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    isActive ? 'text-white' : 'border border-default text-text-muted hover:text-text-default'
                  }`}
                  style={isActive ? { backgroundColor: color } : undefined}
                >
                  {PLATFORM_ICONS[platform]}
                  <span className="hidden sm:inline capitalize">{platform}</span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 rounded-lg border border-default px-3 py-1.5 text-xs text-text-muted hover:text-text-default transition-colors">
              <Sparkles className="h-3.5 w-3.5" style={{ color: ACCENT }} />
              AI Assist
            </button>
            <button className="rounded-lg border border-default px-3 py-1.5 text-xs text-text-muted hover:text-text-default transition-colors">
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
        </div>
        {composerText && (
          <p className="mt-2 text-[10px] text-text-muted">{composerText.length} characters</p>
        )}
      </div>

      {/* Engagement Chart */}
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
              contentStyle={{ backgroundColor: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 8, color: CHART_THEME.tooltipText }}
              formatter={(value) => [`${value}%`, undefined]}
              labelFormatter={(label) => new Date(String(label)).toLocaleDateString()}
            />
            <Line type="monotone" dataKey="instagram" stroke="#E1306C" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="facebook" stroke="#1877F2" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="twitter" stroke="#1DA1F2" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartWrapper>

      {/* Recent Posts */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-text-default">Recent Posts</h3>
        <div className="space-y-3">
          {(posts ?? []).map((post) => (
            <div key={post.id} className="flex gap-4 rounded-xl border border-default bg-card p-4">
              <div className="flex-shrink-0 rounded-lg p-2" style={{ backgroundColor: `${PLATFORM_COLORS[post.platform]}20` }}>
                {PLATFORM_ICONS[post.platform]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="mb-1 flex items-center gap-2">
                  <p className="text-sm font-medium text-text-default truncate">{post.title}</p>
                  <StatusBadge label={post.platform} variant="info" size="sm" />
                </div>
                <p className="mb-2 text-xs text-text-muted line-clamp-2">{post.content.slice(0, 150)}</p>
                <div className="flex items-center gap-4 text-xs text-text-muted">
                  {post.performance && (
                    <>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {post.performance.impressions.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {post.performance.engagement}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {post.comments}
                      </span>
                      <span className="flex items-center gap-1">
                        <Repeat2 className="h-3 w-3" />
                        {post.shares}
                      </span>
                    </>
                  )}
                  {post.publishedDate && (
                    <span>{new Date(post.publishedDate).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
              {post.performance && (
                <div className="flex-shrink-0 text-right">
                  <p className="text-lg font-bold" style={{ color: ACCENT }}>{post.performance.engagementRate}%</p>
                  <p className="text-[10px] text-text-muted">Engagement</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
