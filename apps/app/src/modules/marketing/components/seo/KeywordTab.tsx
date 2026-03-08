'use client';

import { DataTable, StatusBadge, LoadingSkeleton, EmptyState } from '@/components';
import { Search, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { SEOKeyword, KeywordStatus } from '../../types/seo-events';
import { ACCENT } from '@/design/colors';


const STATUS_VARIANTS: Record<KeywordStatus, 'success' | 'info' | 'danger'> = {
  ranking: 'success',
  tracking: 'info',
  lost: 'danger',
};

interface KeywordTabProps {
  keywords: SEOKeyword[];
  isLoading: boolean;
}

function DifficultyBar({ value }: { value: number }) {
  const color = value >= 70 ? '#FB7185' : value >= 40 ? '#5BB8E6' : '#00E5A0';
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

const columns = [
  {
    header: 'Keyword',
    accessor: 'keyword' as const,
    sortable: true,
    render: (row: SEOKeyword) => (
      <span className="text-sm font-medium text-text-bright">{row.keyword}</span>
    ),
  },
  {
    header: 'Search Volume',
    accessor: 'searchVolume' as const,
    sortable: true,
    render: (row: SEOKeyword) => (
      <span className="text-xs text-text-muted">{row.searchVolume.toLocaleString()}</span>
    ),
  },
  {
    header: 'Current Rank',
    accessor: 'currentRank' as const,
    sortable: true,
    render: (row: SEOKeyword) => {
      if (!row.currentRank) return <span className="text-xs text-text-muted">—</span>;
      const color = row.currentRank <= 10 ? '#00E5A0' : row.currentRank <= 20 ? '#5BB8E6' : '#8B9DC3';
      return <span className="text-sm font-semibold" style={{ color }}>#{row.currentRank}</span>;
    },
  },
  {
    header: 'Rank Change',
    accessor: 'rankChange' as const,
    sortable: true,
    render: (row: SEOKeyword) => {
      if (row.rankChange == null || row.rankChange === 0) {
        return <span className="text-xs text-text-muted">—</span>;
      }
      if (row.rankChange > 0) {
        return <span className="text-xs font-medium text-success">&uarr;{row.rankChange}</span>;
      }
      return <span className="text-xs font-medium text-danger">&darr;{Math.abs(row.rankChange)}</span>;
    },
  },
  {
    header: 'Difficulty',
    accessor: 'difficulty' as const,
    sortable: true,
    render: (row: SEOKeyword) => <DifficultyBar value={row.difficulty} />,
    hideBelow: 'md' as const,
  },
  {
    header: 'Target URL',
    accessor: 'page' as const,
    render: (row: SEOKeyword) => (
      <span className="text-xs text-text-muted truncate max-w-[160px] inline-block">
        {row.page ?? '—'}
      </span>
    ),
    hideBelow: 'lg' as const,
  },
  {
    header: 'Trend',
    accessor: 'trend' as const,
    render: (row: SEOKeyword) => <TrendIcon trend={row.trend} />,
  },
  {
    header: 'Status',
    accessor: 'status' as const,
    sortable: true,
    render: (row: SEOKeyword) => (
      <StatusBadge variant={STATUS_VARIANTS[row.status]} label={row.status} size="sm" dot />
    ),
  },
];

export function KeywordTab({ keywords, isLoading }: KeywordTabProps) {
  if (isLoading) return <LoadingSkeleton variant="table" />;

  if (keywords.length === 0) {
    return (
      <EmptyState
        icon={Search}
        title="No keywords tracked"
        description="Add keywords to track your search engine rankings."
        accentColor={ACCENT}
      />
    );
  }

  return (
    <DataTable
      data={keywords}
      columns={columns}
      searchable
      searchPlaceholder="Search keywords..."
      pageSize={15}
      emptyState={{ icon: Search, title: 'No matching keywords', accentColor: ACCENT }}
    />
  );
}
