'use client';

import { useState, useMemo } from 'react';
import { CalendarRange, ChevronLeft, ChevronRight, Pencil, CalendarClock, Trash2 } from 'lucide-react';
import { SectionHeader, MetricCard, LoadingSkeleton, StatusBadge, DrawerPanel } from '@/components';
import { useContentPieces, useMarketingMetrics, useGapSuggestions } from '@/modules/marketing/hooks';
import type { ContentPiece, ContentPlatform, ContentStatus, GapSuggestion } from '@/modules/marketing/types';
import { ACCENT } from '@/design/colors';


const PLATFORM_COLORS: Record<string, string> = {
  instagram: '#E1306C',
  facebook: '#1877F2',
  twitter: '#1DA1F2',
  email: '#5BB8E6',
  website: '#5BB8E6',
  multi: '#5BB8E6',
};

const PLATFORM_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  twitter: 'Twitter/X',
  email: 'Email',
  website: 'Website',
  multi: 'Multi',
};

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const STATUS_ORDER = ['idea', 'draft', 'review', 'approved', 'scheduled', 'published'] as const;
const STATUS_LABELS: Record<string, string> = {
  idea: 'Ideas',
  draft: 'Drafts',
  review: 'Review',
  approved: 'Approved',
  scheduled: 'Scheduled',
  published: 'Published',
};

type ViewMode = 'month' | 'week';
type ChannelFilter = 'all' | ContentPlatform;
type StatusFilter = 'all' | ContentStatus;

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  items: ContentPiece[];
  isToday: boolean;
}

function getMonthGrid(year: number, month: number, pieces: ContentPiece[]): CalendarDay[] {
  const firstDay = new Date(year, month, 1);
  const today = new Date();
  const days: CalendarDay[] = [];
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  for (let i = 0; i < 42; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];

    const dayItems = pieces.filter((p) => {
      const pDate = p.publishedDate || p.scheduledDate;
      return pDate === dateStr;
    });

    days.push({
      date: d,
      isCurrentMonth: d.getMonth() === month,
      items: dayItems,
      isToday: d.toDateString() === today.toDateString(),
    });

    if (i >= 34 && d.getMonth() !== month) break;
  }

  while (days.length % 7 !== 0) {
    const d = new Date(days[days.length - 1].date);
    d.setDate(d.getDate() + 1);
    days.push({ date: d, isCurrentMonth: false, items: [], isToday: false });
  }

  return days;
}

function getWeekDays(anchorDate: Date, pieces: ContentPiece[]): CalendarDay[] {
  const today = new Date();
  const dayOfWeek = anchorDate.getDay();
  const sunday = new Date(anchorDate);
  sunday.setDate(sunday.getDate() - dayOfWeek);

  const days: CalendarDay[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(sunday);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];

    const dayItems = pieces.filter((p) => {
      const pDate = p.publishedDate || p.scheduledDate;
      return pDate === dateStr;
    });

    days.push({
      date: d,
      isCurrentMonth: true,
      items: dayItems,
      isToday: d.toDateString() === today.toDateString(),
    });
  }

  return days;
}

function WorkflowSteps({ currentStatus }: { currentStatus: ContentStatus }) {
  const currentIdx = STATUS_ORDER.indexOf(currentStatus);

  return (
    <div className="flex items-center gap-1">
      {STATUS_ORDER.map((step, idx) => {
        const isActive = idx <= currentIdx;
        const isCurrent = idx === currentIdx;
        return (
          <div key={step} className="flex items-center gap-1">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold transition-colors ${
                  isCurrent
                    ? 'ring-2 ring-[#5BB8E6] ring-offset-1 ring-offset-transparent'
                    : ''
                }`}
                style={{
                  backgroundColor: isActive ? ACCENT : 'var(--color-elevated)',
                  color: isActive ? '#fff' : 'var(--color-text-muted)',
                }}
              >
                {idx + 1}
              </div>
              <span
                className={`mt-1 text-[9px] leading-tight ${
                  isActive ? 'text-text-default font-medium' : 'text-text-muted'
                }`}
              >
                {STATUS_LABELS[step]}
              </span>
            </div>
            {idx < STATUS_ORDER.length - 1 && (
              <div
                className="mb-4 h-0.5 w-4"
                style={{
                  backgroundColor: idx < currentIdx ? ACCENT : 'var(--color-border-default)',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function GapSuggestionChip({ suggestion }: { suggestion: GapSuggestion }) {
  return (
    <div className="mt-1 truncate rounded px-1 py-0.5 text-[10px] text-amber-400 bg-amber-500/10">
      💡 {suggestion.suggestion}
    </div>
  );
}

export function ContentCalendarPage() {
  const { data: pieces, isLoading: piecesLoading } = useContentPieces();
  const { data: metrics, isLoading: metricsLoading } = useMarketingMetrics();
  const { data: gapSuggestions } = useGapSuggestions();

  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1)); // March 2026
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [channelFilter, setChannelFilter] = useState<ChannelFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Build a lookup map for gap suggestions by date
  const gapMap = useMemo(() => {
    const map = new Map<string, GapSuggestion>();
    if (gapSuggestions) {
      for (const gs of gapSuggestions) {
        map.set(gs.date, gs);
      }
    }
    return map;
  }, [gapSuggestions]);

  // Filter pieces by channel and status
  const filteredPieces = useMemo(() => {
    if (!pieces) return [];
    return pieces.filter((p) => {
      if (channelFilter !== 'all' && p.platform !== channelFilter) return false;
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      return true;
    });
  }, [pieces, channelFilter, statusFilter]);

  const calendarDays = useMemo(() => {
    if (viewMode === 'week') {
      return getWeekDays(currentDate, filteredPieces);
    }
    return getMonthGrid(year, month, filteredPieces);
  }, [year, month, filteredPieces, viewMode, currentDate]);

  const statusCounts = useMemo(() => {
    if (!pieces) return {};
    const counts: Record<string, number> = {};
    for (const s of STATUS_ORDER) {
      counts[s] = pieces.filter((p) => p.status === s).length;
    }
    return counts;
  }, [pieces]);

  const selectedPiece = useMemo(() => {
    if (!selectedPieceId || !pieces) return null;
    return pieces.find((p) => p.id === selectedPieceId) ?? null;
  }, [selectedPieceId, pieces]);

  const isLoading = piecesLoading || metricsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <LoadingSkeleton variant="text" />
        <LoadingSkeleton variant="card" count={5} />
        <LoadingSkeleton variant="chart" />
      </div>
    );
  }

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const navigatePrev = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, month - 1, 1));
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 7);
      setCurrentDate(d);
    }
  };

  const navigateNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, month + 1, 1));
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 7);
      setCurrentDate(d);
    }
  };

  const weekLabel = (() => {
    if (viewMode !== 'week') return '';
    const dayOfWeek = currentDate.getDay();
    const sunday = new Date(currentDate);
    sunday.setDate(sunday.getDate() - dayOfWeek);
    const saturday = new Date(sunday);
    saturday.setDate(saturday.getDate() + 6);
    const fmt = (d: Date) =>
      d.toLocaleDateString('default', { month: 'short', day: 'numeric' });
    return `${fmt(sunday)} – ${fmt(saturday)}, ${sunday.getFullYear()}`;
  })();

  return (
    <div className="space-y-6 p-6">
      <SectionHeader
        icon={CalendarRange}
        title="Content Calendar"
        subtitle="Plan and schedule content across all channels"
        accentColor={ACCENT}
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        <MetricCard label="Posts This Month" value={metrics?.postsThisMonth ?? 0} accentColor={ACCENT} />
        <MetricCard label="Scheduled" value={metrics?.scheduledCount ?? 0} accentColor="#5BB8E6" />
        <MetricCard label="Drafts in Pipeline" value={metrics?.draftsInPipeline ?? 0} accentColor="#5BB8E6" />
        <MetricCard label="Avg Engagement" value={`${metrics?.avgEngagementRate ?? 0}%`} accentColor="#5BB8E6" />
        <MetricCard label="Content Gap Days" value={metrics?.contentGapDays ?? 0} accentColor="#EF4444" />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-text-muted">Channel</label>
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value as ChannelFilter)}
            className="rounded-xl bg-card px-3 py-1.5 text-xs text-text-default focus:outline-none focus:ring-1 focus:ring-[#5BB8E6]"
          >
            <option value="all">All</option>
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="twitter">Twitter/X</option>
            <option value="email">Email</option>
            <option value="website">Website</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-text-muted">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="rounded-xl bg-card px-3 py-1.5 text-xs text-text-default focus:outline-none focus:ring-1 focus:ring-[#5BB8E6]"
          >
            <option value="all">All</option>
            <option value="idea">Idea</option>
            <option value="draft">Draft</option>
            <option value="review">Review</option>
            <option value="approved">Approved</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      {/* Calendar */}
      <div className="rounded-xl bg-card">
        {/* Navigation Header */}
        <div className="flex items-center justify-between border-b border-default px-4 py-3">
          <button
            onClick={navigatePrev}
            className="rounded-lg p-1.5 text-text-muted hover:bg-accent-hover hover:text-text-default transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-4">
            <h3 className="text-sm font-semibold text-text-default">
              {viewMode === 'month' ? monthName : weekLabel}
            </h3>

            {/* View Mode Toggle */}
            <div className="flex rounded-lg border border-default overflow-hidden">
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1 text-xs font-medium transition-colors ${
                  viewMode === 'month'
                    ? 'bg-[#5BB8E6] text-white'
                    : 'bg-card text-text-muted hover:text-text-default hover:bg-accent-hover'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1 text-xs font-medium transition-colors ${
                  viewMode === 'week'
                    ? 'bg-[#5BB8E6] text-white'
                    : 'bg-card text-text-muted hover:text-text-default hover:bg-accent-hover'
                }`}
              >
                Week
              </button>
            </div>
          </div>

          <button
            onClick={navigateNext}
            className="rounded-lg p-1.5 text-text-muted hover:bg-accent-hover hover:text-text-default transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 border-b border-default">
          {WEEKDAYS.map((day) => (
            <div key={day} className="px-2 py-2 text-center text-xs font-medium text-text-muted">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, i) => {
            const dateStr = day.date.toISOString().split('T')[0];
            const isWeekday = day.date.getDay() > 0 && day.date.getDay() < 6;
            const isGap = day.isCurrentMonth && day.items.length === 0 && isWeekday;
            const gapSuggestion = isGap ? gapMap.get(dateStr) : undefined;

            return (
              <div
                key={i}
                className={`border-b border-r border-default p-1.5 text-left transition-colors ${
                  viewMode === 'week' ? 'min-h-[200px]' : 'min-h-[80px]'
                } ${!day.isCurrentMonth ? 'opacity-30' : ''} ${
                  isGap ? 'bg-red-500/5' : ''
                } ${day.isToday ? 'ring-1 ring-inset ring-[#5BB8E6]/40' : ''}`}
              >
                <span className={`text-xs font-medium ${day.isToday ? 'text-[#5BB8E6]' : 'text-text-muted'}`}>
                  {day.date.getDate()}
                </span>
                <div className="mt-1 space-y-0.5">
                  {(viewMode === 'week' ? day.items : day.items.slice(0, 3)).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedPieceId(item.id)}
                      className="flex w-full items-center gap-1 truncate rounded px-1 py-0.5 text-[10px] text-white text-left hover:brightness-110 transition-all"
                      style={{ backgroundColor: PLATFORM_COLORS[item.platform] ?? ACCENT }}
                      title={item.title}
                    >
                      <span className="truncate flex-1">{item.title}</span>
                      {viewMode === 'week' && (
                        (item.status === 'draft' || item.status === 'scheduled' || item.status === 'review' || item.status === 'approved')
                          ? <StatusBadge status={item.status} size="sm" />
                          : <StatusBadge label={item.status} variant={item.status === 'published' ? 'success' : 'info'} size="sm" />
                      )}
                      {item.performance && (
                        <span className="text-[9px] text-text-muted">{item.performance.engagementRate}%</span>
                      )}
                    </button>
                  ))}
                  {viewMode === 'month' && day.items.length > 3 && (
                    <span className="text-[10px] text-text-muted">+{day.items.length - 3} more</span>
                  )}
                  {gapSuggestion && <GapSuggestionChip suggestion={gapSuggestion} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content Pipeline */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-text-default">Content Pipeline</h3>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6">
          {STATUS_ORDER.map((status) => {
            const count = statusCounts[status] ?? 0;
            return (
              <div key={status} className="rounded-xl bg-card p-3 text-center">
                <p className="text-2xl font-bold text-text-default">{count}</p>
                <p className="text-xs text-text-muted">{STATUS_LABELS[status]}</p>
                <div className="mx-auto mt-2 h-1 w-full rounded-full bg-base">
                  <div
                    className="h-1 rounded-full transition-all"
                    style={{ width: `${Math.min((count / Math.max((pieces?.length ?? 1), 1)) * 100, 100)}%`, backgroundColor: ACCENT }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Drawer Panel for Content Detail */}
      <DrawerPanel
        open={!!selectedPiece}
        onClose={() => setSelectedPieceId(null)}
        title={selectedPiece?.title ?? 'Content Detail'}
        width="md"
        footer={
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 rounded-lg bg-[#5BB8E6] px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90">
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </button>
            <button className="flex items-center gap-1.5 rounded-xl bg-card px-4 py-2 text-sm font-medium text-text-default transition-colors hover:bg-accent-hover">
              <CalendarClock className="h-3.5 w-3.5" />
              Reschedule
            </button>
            <button className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20">
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        }
      >
        {selectedPiece && (
          <div className="space-y-6">
            {/* Platform & Date */}
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                style={{ backgroundColor: PLATFORM_COLORS[selectedPiece.platform] ?? ACCENT }}
              >
                {PLATFORM_LABELS[selectedPiece.platform] ?? selectedPiece.platform}
              </span>
              <span className="text-xs text-text-muted">
                {selectedPiece.publishedDate
                  ? `Published ${selectedPiece.publishedDate}`
                  : selectedPiece.scheduledDate
                    ? `Scheduled ${selectedPiece.scheduledDate}`
                    : 'No date set'}
              </span>
            </div>

            {/* Workflow Visualization */}
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">Workflow</h4>
              <WorkflowSteps currentStatus={selectedPiece.status} />
            </div>

            {/* Content Preview */}
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">Content</h4>
              <div className="rounded-lg border border-default bg-base p-3">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-default">{selectedPiece.content}</p>
              </div>
            </div>

            {/* Creator */}
            <div>
              <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-text-muted">Creator</h4>
              <p className="text-sm text-text-default">{selectedPiece.createdBy}</p>
            </div>

            {/* Performance Metrics (if published) */}
            {selectedPiece.performance && (
              <div>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">Performance</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg border border-default bg-base p-3 text-center">
                    <p className="text-lg font-bold text-text-default">
                      {selectedPiece.performance.impressions.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-text-muted">Impressions</p>
                  </div>
                  <div className="rounded-lg border border-default bg-base p-3 text-center">
                    <p className="text-lg font-bold text-text-default">
                      {selectedPiece.performance.engagementRate}%
                    </p>
                    <p className="text-[10px] text-text-muted">Engagement</p>
                  </div>
                  <div className="rounded-lg border border-default bg-base p-3 text-center">
                    <p className="text-lg font-bold text-text-default">
                      {selectedPiece.performance.clicks.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-text-muted">Clicks</p>
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
