'use client';

import { useState } from 'react';
import { SectionHeader, LoadingSkeleton, ErrorState, ModuleTabs } from '@/components';
import type { TabItem } from '@/components';
import { Search, FileText, Globe } from 'lucide-react';
import { useBlogPosts, useSEOKeywords, useSEOMetrics, useOrganicTrend } from '../../hooks/seo-events-hooks';
import { BlogTab } from './BlogTab';
import { KeywordTab } from './KeywordTab';
import { SEOOverviewTab } from './SEOOverviewTab';
import { SEODrawer } from './SEODrawer';
import { ACCENT } from '@/design/colors';

type SEOTab = 'blog' | 'keywords' | 'overview';

const TABS: TabItem[] = [
  { id: 'blog', label: 'Blog Management', icon: FileText },
  { id: 'keywords', label: 'Keyword Tracker', icon: Search },
  { id: 'overview', label: 'SEO Overview', icon: Globe },
];

export function SEOPage() {
  const [activeTab, setActiveTab] = useState<SEOTab>('blog');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const { data: posts, isLoading: postsLoading } = useBlogPosts();
  const { data: keywords, isLoading: keywordsLoading } = useSEOKeywords();
  const { data: metrics, isLoading: metricsLoading, error: metricsError, refetch } = useSEOMetrics();
  const { data: trend, isLoading: trendLoading } = useOrganicTrend();

  if (metricsLoading) return <LoadingSkeleton variant="card" count={4} />;
  if (metricsError) return <ErrorState title="Failed to load SEO data" message={metricsError.message} onRetry={refetch} />;

  const selectedPost = posts?.find((p) => p.id === selectedPostId) ?? null;

  return (
    <div className="space-y-6">
      <SectionHeader icon={Search} title="SEO / Blog" subtitle="Search optimization, content pipeline, and organic performance" accentColor={ACCENT} />

      <ModuleTabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab as (id: string) => void} accentColor={ACCENT} />

      {activeTab === 'blog' && (
        <BlogTab posts={posts ?? []} isLoading={postsLoading} onSelectPost={setSelectedPostId} />
      )}
      {activeTab === 'keywords' && (
        <KeywordTab keywords={keywords ?? []} isLoading={keywordsLoading} />
      )}
      {activeTab === 'overview' && (
        <SEOOverviewTab metrics={metrics!} posts={posts ?? []} trend={trend ?? []} isTrendLoading={trendLoading} />
      )}

      <SEODrawer post={selectedPost} onClose={() => setSelectedPostId(null)} />
    </div>
  );
}
