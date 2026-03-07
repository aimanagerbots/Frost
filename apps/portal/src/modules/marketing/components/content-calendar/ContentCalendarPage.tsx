'use client';

import { useState, useMemo } from 'react';
import { CalendarRange, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { SectionHeader, MetricCard, LoadingSkeleton, StatusBadge } from '@/components';
import { useContentPieces, useMarketingMetrics } from '@/modules/marketing/hooks';
import type { ContentPiece } from '@/modules/marketing/types';

const ACCENT = '#EC4899';

const PLATFORM_COLORS: Record<string, string> = {
  instagram: '#E1306C',
  facebook: '#1877F2',
  twitter: '#1DA1F2',
  email: '#F59E0B',
  website: '#22C55E',
  multi: '#8B5CF6',
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

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  items: ContentPiece[];
  isToday: boolean;
}

function getMonthGrid(year: number, month: number, pieces: ContentPiece[]): CalendarDay[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  const today = new Date();
  const days: CalendarDay[] = [];

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

  // Ensure we have complete weeks (multiples of 7)
  while (days.length % 7 !== 0) {
    const d = new Date(days[days.length - 1].date);
    d.setDate(d.getDate() + 1);
    days.push({ date: d, isCurrentMonth: false, items: [], isToday: false });
  }

  return days;
}

export function ContentCalendarPage() {
  const { data: pieces, isLoading: piecesLoading } = useContentPieces();
  const { data: metrics, isLoading: metricsLoading } = useMarketingMetrics();

  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1)); // March 2026
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const calendarDays = useMemo(() => {
    return getMonthGrid(year, month, pieces ?? []);
  }, [year, month, pieces]);

  const statusCounts = useMemo(() => {
    if (!pieces) return {};
    const counts: Record<string, number> = {};
    for (const s of STATUS_ORDER) {
      counts[s] = pieces.filter((p) => p.status === s).length;
    }
    return counts;
  }, [pieces]);

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
  const selectedDayItems = selectedDate
    ? calendarDays.find((d) => d.date.toISOString().split('T')[0] === selectedDate)?.items ?? []
    : [];

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
        <MetricCard label="Scheduled" value={metrics?.scheduledCount ?? 0} accentColor="#3B82F6" />
        <MetricCard label="Drafts in Pipeline" value={metrics?.draftsInPipeline ?? 0} accentColor="#F59E0B" />
        <MetricCard label="Avg Engagement" value={`${metrics?.avgEngagementRate ?? 0}%`} accentColor="#22C55E" />
        <MetricCard label="Content Gap Days" value={metrics?.contentGapDays ?? 0} accentColor="#EF4444" />
      </div>

      {/* Calendar */}
      <div className="rounded-xl border border-default bg-card">
        {/* Month Navigation */}
        <div className="flex items-center justify-between border-b border-default px-4 py-3">
          <button
            onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
            className="rounded-lg p-1.5 text-text-muted hover:bg-card-hover hover:text-text-default transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h3 className="text-sm font-semibold text-text-default">{monthName}</h3>
          <button
            onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
            className="rounded-lg p-1.5 text-text-muted hover:bg-card-hover hover:text-text-default transition-colors"
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
            const isGap = day.isCurrentMonth && day.items.length === 0 && day.date.getDay() > 0 && day.date.getDay() < 6;
            const isSelected = selectedDate === dateStr;

            return (
              <button
                key={i}
                onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                className={`min-h-[80px] border-b border-r border-default p-1.5 text-left transition-colors ${
                  !day.isCurrentMonth ? 'opacity-30' : ''
                } ${isGap ? 'bg-red-500/5' : ''} ${isSelected ? 'bg-[#EC4899]/10' : 'hover:bg-card-hover'} ${
                  day.isToday ? 'ring-1 ring-inset ring-[#EC4899]/40' : ''
                }`}
              >
                <span className={`text-xs font-medium ${day.isToday ? 'text-[#EC4899]' : 'text-text-muted'}`}>
                  {day.date.getDate()}
                </span>
                <div className="mt-1 space-y-0.5">
                  {day.items.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="truncate rounded px-1 py-0.5 text-[10px] text-white"
                      style={{ backgroundColor: PLATFORM_COLORS[item.platform] ?? ACCENT }}
                      title={item.title}
                    >
                      {item.title}
                    </div>
                  ))}
                  {day.items.length > 3 && (
                    <span className="text-[10px] text-text-muted">+{day.items.length - 3} more</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Detail */}
      {selectedDate && selectedDayItems.length > 0 && (
        <div className="rounded-xl border border-default bg-card p-4">
          <h3 className="mb-3 text-sm font-semibold text-text-default">
            Content for {new Date(selectedDate + 'T12:00:00').toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h3>
          <div className="space-y-2">
            {selectedDayItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3 rounded-lg border border-default bg-base p-3">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: PLATFORM_COLORS[item.platform] ?? ACCENT }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-default truncate">{item.title}</p>
                  <p className="text-xs text-text-muted truncate">{item.content.slice(0, 100)}</p>
                </div>
                <StatusBadge label={item.status} variant={item.status === 'published' ? 'success' : 'info'} size="sm" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content Pipeline */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-text-default">Content Pipeline</h3>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6">
          {STATUS_ORDER.map((status) => {
            const count = statusCounts[status] ?? 0;
            return (
              <div key={status} className="rounded-xl border border-default bg-card p-3 text-center">
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
    </div>
  );
}
