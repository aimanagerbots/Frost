'use client';

import { DataTable, StatusBadge, LoadingSkeleton, EmptyState } from '@/components';
import { FileText } from 'lucide-react';
import type { BlogPost, BlogPostStatus } from '../../types/seo-events';
import { ACCENT } from '@/design/colors';


const STATUS_VARIANTS: Record<BlogPostStatus, 'muted' | 'info' | 'warning' | 'success'> = {
  idea: 'muted',
  draft: 'info',
  review: 'warning',
  published: 'success',
};

interface BlogTabProps {
  posts: BlogPost[];
  isLoading: boolean;
  onSelectPost: (id: string) => void;
}

const columns = [
  {
    header: 'Title',
    accessor: 'title' as const,
    sortable: true,
    render: (row: BlogPost) => (
      <span className="text-sm font-medium text-text-bright line-clamp-1">{row.title}</span>
    ),
  },
  {
    header: 'Status',
    accessor: 'status' as const,
    sortable: true,
    render: (row: BlogPost) => (
      (row.status === 'draft' || row.status === 'review')
        ? <StatusBadge status={row.status as 'draft' | 'review'} size="sm" />
        : <StatusBadge variant={STATUS_VARIANTS[row.status]} label={row.status} size="sm" dot />
    ),
  },
  {
    header: 'Author',
    accessor: 'author' as const,
    sortable: true,
    hideBelow: 'md' as const,
  },
  {
    header: 'Category',
    accessor: 'category' as const,
    sortable: true,
    hideBelow: 'lg' as const,
  },
  {
    header: 'Published',
    accessor: 'publishedDate' as const,
    sortable: true,
    render: (row: BlogPost) => (
      <span className="text-xs text-text-muted">{row.publishedDate ?? '—'}</span>
    ),
    hideBelow: 'md' as const,
  },
  {
    header: 'SEO Score',
    accessor: 'seoScore' as const,
    sortable: true,
    render: (row: BlogPost) => {
      const color = row.seoScore >= 80 ? '#00E5A0' : row.seoScore >= 50 ? '#5BB8E6' : '#FB7185';
      return (
        <span className="text-sm font-semibold" style={{ color }}>
          {row.seoScore}
        </span>
      );
    },
  },
  {
    header: 'Views',
    accessor: 'views' as const,
    sortable: true,
    render: (row: BlogPost) => (
      <span className="text-xs text-text-muted">{row.views != null ? row.views.toLocaleString() : '—'}</span>
    ),
    hideBelow: 'lg' as const,
  },
  {
    header: 'Organic',
    accessor: 'organicTraffic' as const,
    sortable: true,
    render: (row: BlogPost) => (
      <span className="text-xs text-text-muted">
        {row.organicTraffic != null ? row.organicTraffic.toLocaleString() : '—'}
      </span>
    ),
    hideBelow: 'lg' as const,
  },
];

export function BlogTab({ posts, isLoading, onSelectPost }: BlogTabProps) {
  if (isLoading) return <LoadingSkeleton variant="table" />;

  if (posts.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No blog posts"
        description="Create your first blog post to start tracking SEO performance."
        accentColor={ACCENT}
      />
    );
  }

  return (
    <DataTable
      data={posts}
      columns={columns}
      searchable
      searchPlaceholder="Search blog posts..."
      pageSize={15}
      onRowClick={(row) => onSelectPost(row.id)}
      emptyState={{ icon: FileText, title: 'No matching posts', accentColor: ACCENT }}
    />
  );
}
