'use client';

import { useState } from 'react';
import { Megaphone } from 'lucide-react';
import {
  SectionHeader,
  MetricCard,
  DataTable,
  StatusBadge,
  DrawerPanel,
  LoadingSkeleton,
  ErrorState,
  EmptyState,
} from '@/components';
import { useContentPosts, useContentMetrics } from '@/modules/content/hooks';
import type { ContentPost, ContentStatus } from '@/modules/content/types';

const ACCENT = '#EC4899';

const STATUS_VARIANT: Record<ContentStatus, 'muted' | 'info' | 'success' | 'default'> = {
  draft: 'muted',
  scheduled: 'info',
  published: 'success',
  archived: 'default',
};

const PLATFORM_VARIANT: Record<string, 'warning' | 'info' | 'default'> = {
  instagram: 'warning',
  email: 'info',
  website: 'default',
};

const TYPE_LABELS: Record<string, string> = {
  social: 'Social',
  email: 'Email',
  blog: 'Blog',
  'product-description': 'Product Desc',
};

const STATUS_FILTERS: { label: string; value: ContentStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Draft', value: 'draft' },
  { label: 'Scheduled', value: 'scheduled' },
  { label: 'Published', value: 'published' },
  { label: 'Archived', value: 'archived' },
];

export function ContentPage() {
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'all'>('all');
  const [selectedPost, setSelectedPost] = useState<ContentPost | null>(null);

  const { data: posts, isLoading: postsLoading, error: postsError, refetch: refetchPosts } = useContentPosts(
    statusFilter === 'all' ? undefined : { status: statusFilter }
  );
  const { data: metrics, isLoading: metricsLoading, error: metricsError, refetch: refetchMetrics } = useContentMetrics();

  if (postsLoading || metricsLoading) {
    return (
      <div className="space-y-6 p-6">
        <LoadingSkeleton variant="text" />
        <LoadingSkeleton variant="card" count={4} />
        <LoadingSkeleton variant="table" />
      </div>
    );
  }

  if (postsError || metricsError) {
    return (
      <ErrorState
        title="Failed to load content"
        message={(postsError || metricsError)?.message}
        onRetry={() => { refetchPosts(); refetchMetrics(); }}
      />
    );
  }

  if (!posts?.length) {
    return (
      <EmptyState
        icon={Megaphone}
        title="No content found"
        description="No marketing content has been created yet. Start creating posts to see them here."
        accentColor={ACCENT}
      />
    );
  }

  const tableColumns = [
    {
      header: 'Title',
      accessor: 'title' as const,
      sortable: true,
      render: (row: ContentPost) => (
        <span className="text-sm font-medium text-text-bright">{row.title}</span>
      ),
    },
    {
      header: 'Platform',
      accessor: 'platform' as const,
      sortable: true,
      render: (row: ContentPost) => (
        <StatusBadge
          variant={PLATFORM_VARIANT[row.platform] ?? 'default'}
          label={row.platform}
          size="sm"
        />
      ),
    },
    {
      header: 'Type',
      accessor: 'type' as const,
      sortable: true,
      hideBelow: 'md' as const,
      render: (row: ContentPost) => (
        <StatusBadge variant="default" label={TYPE_LABELS[row.type] ?? row.type} size="sm" />
      ),
    },
    {
      header: 'Status',
      accessor: 'status' as const,
      sortable: true,
      render: (row: ContentPost) => (
        <StatusBadge
          variant={STATUS_VARIANT[row.status]}
          label={row.status}
          size="sm"
          dot
        />
      ),
    },
    {
      header: 'Date',
      accessor: ((row: ContentPost) =>
        row.scheduledDate ?? row.publishedDate ?? '') as (row: ContentPost) => unknown,
      sortable: true,
      render: (row: ContentPost) => {
        const date = row.scheduledDate ?? row.publishedDate;
        if (!date) return <span className="text-text-muted">--</span>;
        return (
          <span className="text-sm text-text-default">
            {new Date(date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        );
      },
    },
    {
      header: 'Engagement',
      accessor: ((row: ContentPost) =>
        row.performance?.impressions ?? 0) as (row: ContentPost) => unknown,
      sortable: true,
      hideBelow: 'lg' as const,
      render: (row: ContentPost) => {
        if (!row.performance) return <span className="text-text-muted">--</span>;
        return (
          <span className="text-sm text-text-default">
            {row.performance.impressions.toLocaleString()} imp
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <SectionHeader
        icon={Megaphone}
        title="Content & Marketing"
        subtitle="Create, schedule, and track marketing content"
        accentColor={ACCENT}
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Posts This Month"
          value={metrics?.postsThisMonth ?? 0}
          accentColor={ACCENT}
        />
        <MetricCard
          label="Avg Engagement Rate"
          value={metrics?.avgEngagement ?? '0%'}
          accentColor={ACCENT}
        />
        <MetricCard
          label="Email Open Rate"
          value={metrics?.emailOpenRate ?? '0%'}
          accentColor={ACCENT}
        />
        <MetricCard
          label="Scheduled Posts"
          value={metrics?.scheduledCount ?? 0}
          accentColor={ACCENT}
        />
      </div>

      {/* Status Filter Buttons */}
      <div className="flex items-center gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              statusFilter === f.value
                ? 'text-white'
                : 'bg-elevated text-text-muted hover:text-text-default'
            }`}
            style={
              statusFilter === f.value ? { backgroundColor: ACCENT } : undefined
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Data Table */}
      <DataTable<ContentPost>
        data={posts ?? []}
        columns={tableColumns}
        searchable
        searchPlaceholder="Search content..."
        onRowClick={setSelectedPost}
        pageSize={15}
        emptyState={{
          icon: Megaphone,
          title: 'No content found',
          description: 'Try adjusting your filters.',
          accentColor: ACCENT,
        }}
      />

      {/* Detail Drawer */}
      <DrawerPanel
        open={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        title={selectedPost?.title ?? ''}
        width="lg"
      >
        {selectedPost && (
          <div className="space-y-6">
            {/* Status & Platform */}
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge
                variant={STATUS_VARIANT[selectedPost.status]}
                label={selectedPost.status}
                dot
              />
              <StatusBadge
                variant={PLATFORM_VARIANT[selectedPost.platform] ?? 'default'}
                label={selectedPost.platform}
              />
              <StatusBadge
                variant="default"
                label={TYPE_LABELS[selectedPost.type] ?? selectedPost.type}
              />
            </div>

            {/* Dates */}
            <div className="space-y-1">
              {selectedPost.publishedDate && (
                <p className="text-sm text-text-muted">
                  Published:{' '}
                  <span className="text-text-default">
                    {new Date(selectedPost.publishedDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </p>
              )}
              {selectedPost.scheduledDate && (
                <p className="text-sm text-text-muted">
                  Scheduled:{' '}
                  <span className="text-text-default">
                    {new Date(selectedPost.scheduledDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </p>
              )}
            </div>

            {/* Content */}
            <div>
              <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-text-muted">
                Content
              </h3>
              <div className="whitespace-pre-wrap rounded-lg border border-default bg-base p-4 text-sm text-text-default">
                {selectedPost.content}
              </div>
            </div>

            {/* Performance Metrics */}
            {selectedPost.performance && (
              <div>
                <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">
                  Performance
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-default bg-base p-3">
                    <div className="text-lg font-bold text-text-bright">
                      {selectedPost.performance.impressions.toLocaleString()}
                    </div>
                    <div className="text-xs text-text-muted">Impressions</div>
                  </div>
                  <div className="rounded-lg border border-default bg-base p-3">
                    <div className="text-lg font-bold text-text-bright">
                      {selectedPost.performance.engagement}%
                    </div>
                    <div className="text-xs text-text-muted">Engagement Rate</div>
                  </div>
                  <div className="rounded-lg border border-default bg-base p-3">
                    <div className="text-lg font-bold text-text-bright">
                      {selectedPost.performance.clicks.toLocaleString()}
                    </div>
                    <div className="text-xs text-text-muted">Clicks</div>
                  </div>
                  <div className="rounded-lg border border-default bg-base p-3">
                    <div className="text-lg font-bold text-text-bright">
                      {selectedPost.performance.conversions}
                    </div>
                    <div className="text-xs text-text-muted">Conversions</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </DrawerPanel>
    </div>
  );
}
