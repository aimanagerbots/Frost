'use client';

import { useState } from 'react';
import {
  SectionHeader,
  MetricCard,
  DataTable,
  ChartWrapper,
  CHART_THEME,
  StatusBadge,
  LoadingSkeleton,
  ErrorState,
  EmptyState,
} from '@/components';
import { Search, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useBlogPosts, useSEOKeywords, useSEOMetrics } from '../../hooks/seo-events-hooks';
import type { BlogPost, BlogPostStatus, SEOKeyword } from '../../types/seo-events';
import { SEODrawer } from './SEODrawer';

const ACCENT = '#EC4899';

const STATUS_ORDER: BlogPostStatus[] = ['idea', 'draft', 'review', 'published'];
const STATUS_LABELS: Record<BlogPostStatus, string> = { idea: 'Ideas', draft: 'Drafts', review: 'In Review', published: 'Published' };
const STATUS_VARIANTS: Record<BlogPostStatus, 'muted' | 'info' | 'warning' | 'success'> = {
  idea: 'muted', draft: 'info', review: 'warning', published: 'success',
};

function DifficultyBar({ value }: { value: number }) {
  const color = value >= 70 ? '#FB7185' : value >= 40 ? '#FBBF24' : '#00E5A0';
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 rounded-full bg-elevated">
        <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs text-text-muted">{value}</span>
    </div>
  );
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend === 'up') return <TrendingUp className="h-3.5 w-3.5 text-success" />;
  if (trend === 'down') return <TrendingDown className="h-3.5 w-3.5 text-danger" />;
  return <Minus className="h-3.5 w-3.5 text-text-muted" />;
}

function PostCard({ post, onClick }: { post: BlogPost; onClick: (id: string) => void }) {
  const scoreColor = post.seoScore >= 80 ? '#00E5A0' : post.seoScore >= 60 ? '#FBBF24' : '#FB7185';
  return (
    <div
      className="group cursor-pointer rounded-lg border border-default bg-card p-3 transition-all hover:bg-card-hover hover:-translate-y-0.5"
      role="button"
      tabIndex={0}
      onClick={() => onClick(post.id)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(post.id); }}
    >
      <h4 className="text-sm font-medium text-text-bright line-clamp-2">{post.title}</h4>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-text-muted">{post.targetKeyword}</span>
        {post.seoScore > 0 && (
          <span className="rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ backgroundColor: `${scoreColor}20`, color: scoreColor }}>
            {post.seoScore}
          </span>
        )}
      </div>
      {post.wordCount > 0 && (
        <p className="mt-1 text-[11px] text-text-muted">{post.wordCount.toLocaleString()} words · {post.readTime} min read</p>
      )}
      {post.views != null && (
        <p className="mt-1 text-[11px] text-text-muted">{post.views.toLocaleString()} views</p>
      )}
    </div>
  );
}

export function SEOPage() {
  const { data: metrics, isLoading: metricsLoading, error: metricsError, refetch } = useSEOMetrics();
  const { data: posts, isLoading: postsLoading } = useBlogPosts();
  const { data: keywords, isLoading: keywordsLoading } = useSEOKeywords();
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  if (metricsLoading) return <LoadingSkeleton variant="card" count={4} />;
  if (metricsError) return <ErrorState title="Failed to load SEO data" message={metricsError.message} onRetry={refetch} />;

  const selectedPost = posts?.find((p) => p.id === selectedPostId) ?? null;
  const publishedPosts = posts?.filter((p) => p.status === 'published') ?? [];
  const topPosts = [...publishedPosts].sort((a, b) => (b.views ?? 0) - (a.views ?? 0)).slice(0, 5);
  const chartData = topPosts.map((p) => ({ name: p.title.length > 30 ? p.title.slice(0, 30) + '...' : p.title, views: p.views ?? 0 }));

  const keywordColumns = [
    { header: 'Keyword', accessor: 'keyword' as const, sortable: true },
    { header: 'Volume', accessor: 'searchVolume' as const, sortable: true, render: (row: SEOKeyword) => row.searchVolume.toLocaleString() },
    { header: 'Difficulty', accessor: 'difficulty' as const, sortable: true, render: (row: SEOKeyword) => <DifficultyBar value={row.difficulty} />, hideBelow: 'md' as const },
    { header: 'Rank', accessor: 'currentRank' as const, sortable: true, render: (row: SEOKeyword) => {
      if (!row.currentRank) return <span className="text-xs text-text-muted">—</span>;
      const color = row.currentRank <= 10 ? '#00E5A0' : row.currentRank <= 20 ? '#FBBF24' : '#8B9DC3';
      return <span className="text-sm font-semibold" style={{ color }}>#{row.currentRank}</span>;
    }},
    { header: 'Target', accessor: 'targetRank' as const, render: (row: SEOKeyword) => <span className="text-xs text-text-muted">#{row.targetRank}</span>, hideBelow: 'lg' as const },
    { header: 'Trend', accessor: 'trend' as const, render: (row: SEOKeyword) => <TrendIcon trend={row.trend} /> },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader icon={Search} title="SEO / Blog" subtitle="Search optimization, content pipeline, and organic performance" accentColor={ACCENT} />

      {/* Metrics Row */}
      {metrics && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <MetricCard label="Published Posts" value={metrics.publishedPosts} accentColor={ACCENT} />
          <MetricCard label="Total Views" value={metrics.totalViews.toLocaleString()} accentColor={ACCENT} />
          <MetricCard label="Avg SEO Score" value={metrics.avgSeoScore} accentColor={ACCENT} />
          <MetricCard label="Organic Traffic" value={metrics.organicTraffic.toLocaleString()} accentColor={ACCENT} />
          <MetricCard label="Top Keyword" value={`#${metrics.topKeywordRank}`} accentColor={ACCENT} />
        </div>
      )}

      {/* Keyword Tracker */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-text-bright">Keyword Tracker</h2>
        {keywordsLoading ? (
          <LoadingSkeleton variant="table" />
        ) : keywords && keywords.length > 0 ? (
          <DataTable
            data={keywords}
            columns={keywordColumns}
            searchable
            searchPlaceholder="Search keywords..."
            pageSize={10}
            emptyState={{ icon: Search, title: 'No keywords tracked', accentColor: ACCENT }}
          />
        ) : (
          <EmptyState icon={Search} title="No keywords tracked" description="Add keywords to track search performance." accentColor={ACCENT} />
        )}
      </div>

      {/* Blog Pipeline */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-text-bright">Blog Pipeline</h2>
        {postsLoading ? (
          <LoadingSkeleton variant="card" count={4} />
        ) : posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
            {STATUS_ORDER.map((status) => {
              const statusPosts = posts.filter((p) => p.status === status);
              return (
                <div key={status} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <StatusBadge variant={STATUS_VARIANTS[status]} label={STATUS_LABELS[status]} size="sm" dot />
                    <span className="text-xs text-text-muted">{statusPosts.length}</span>
                  </div>
                  <div className="space-y-2">
                    {statusPosts.map((post) => (
                      <PostCard key={post.id} post={post} onClick={setSelectedPostId} />
                    ))}
                    {statusPosts.length === 0 && (
                      <div className="rounded-lg border border-dashed border-default p-4 text-center text-xs text-text-muted">No posts</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState icon={Search} title="No blog posts" description="Create your first blog post." accentColor={ACCENT} />
        )}
      </div>

      {/* Top Performing Content */}
      {chartData.length > 0 && (
        <ChartWrapper title="Top Performing Content" subtitle="Views by published post">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridColor} horizontal={false} />
              <XAxis type="number" tick={{ fill: CHART_THEME.axisColor, fontSize: 12 }} />
              <YAxis dataKey="name" type="category" width={180} tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 8, color: CHART_THEME.tooltipText }}
              />
              <Bar dataKey="views" fill={ACCENT} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      )}

      <SEODrawer post={selectedPost} onClose={() => setSelectedPostId(null)} />
    </div>
  );
}
