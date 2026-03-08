'use client';

import { useState } from 'react';
import {
  SectionHeader,
  MetricCard,
  StatusBadge,
  ChartWrapper,
  CHART_THEME,
  LoadingSkeleton,
  ErrorState,
  EmptyState,
  ModuleTabs,
} from '@/components';
import type { TabItem } from '@/components';
import { PartyPopper, MapPin, Calendar as CalendarIcon, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useEvents, useEventMetrics } from '../../hooks/seo-events-hooks';
import type { Event } from '../../types/seo-events';
import { EventDrawer } from './EventDrawer';
import { EventCalendar } from './EventCalendar';
import { VendorDayStats } from './VendorDayStats';
import { ACCENT } from '@/design/colors';


type Tab = 'calendar' | 'events-list' | 'roi';

const TABS: TabItem[] = [
  { id: 'calendar', label: 'Calendar' },
  { id: 'events-list', label: 'Events List' },
  { id: 'roi', label: 'ROI' },
];

const TYPE_LABELS: Record<string, string> = {
  'vendor-day': 'Vendor Day',
  'trade-show': 'Trade Show',
  'pop-up': 'Pop-Up',
  'webinar': 'Webinar',
  'industry-event': 'Industry Event',
  'internal': 'Internal',
};

const TYPE_COLORS: Record<string, string> = {
  'vendor-day': '#5BB8E6',
  'trade-show': '#5BB8E6',
  'pop-up': '#5BB8E6',
  'webinar': '#5BB8E6',
  'industry-event': '#5BB8E6',
  'internal': '#5BB8E6',
};

const STATUS_VARIANTS: Record<string, 'success' | 'info' | 'warning' | 'danger' | 'muted'> = {
  planned: 'info',
  confirmed: 'success',
  'day-of': 'warning',
  completed: 'muted',
  'follow-up-done': 'success',
  cancelled: 'danger',
};

function EventCard({ event, onClick }: { event: Event; onClick: (id: string) => void }) {
  const typeColor = TYPE_COLORS[event.type] ?? ACCENT;
  return (
    <div
      className="group cursor-pointer rounded-xl border border-default bg-card p-4 transition-all hover:bg-accent-hover hover:-translate-y-0.5"
      role="button"
      tabIndex={0}
      onClick={() => onClick(event.id)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(event.id); }}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-text-bright truncate">{event.name}</h3>
          <div className="mt-1 flex items-center gap-2">
            <span className="rounded-full px-2 py-0.5 text-[11px] font-medium" style={{ backgroundColor: `${typeColor}20`, color: typeColor }}>
              {TYPE_LABELS[event.type]}
            </span>
            <StatusBadge variant={STATUS_VARIANTS[event.status] ?? 'muted'} label={event.status} size="sm" />
          </div>
        </div>
      </div>
      <div className="mt-3 space-y-1.5">
        <div className="flex items-center gap-1.5">
          <CalendarIcon className="h-3.5 w-3.5 text-text-muted" />
          <span className="text-xs text-text-muted">{event.date}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-text-muted" />
          <span className="text-xs text-text-muted truncate">{event.location}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <DollarSign className="h-3.5 w-3.5 text-text-muted" />
          <span className="text-xs text-text-muted">${event.budget.toLocaleString()} budget</span>
        </div>
      </div>
      {event.roiMeasured && (
        <div className="mt-3 border-t border-default pt-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted">Revenue Lift</span>
            <span className="text-sm font-semibold text-success">+{event.roiMeasured.lift}%</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function EventsPage() {
  const { data: metrics, isLoading: metricsLoading, error: metricsError, refetch } = useEventMetrics();
  const { data: events, isLoading: eventsLoading } = useEvents();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('calendar');

  if (metricsLoading) return <LoadingSkeleton variant="card" count={4} />;
  if (metricsError) return <ErrorState title="Failed to load events" message={metricsError.message} onRetry={refetch} />;

  const selectedEvent = events?.find((e) => e.id === selectedEventId) ?? null;
  const upcoming = events?.filter((e) => e.status === 'planned' || e.status === 'confirmed' || e.status === 'day-of') ?? [];
  const completed = events?.filter((e) => e.status === 'completed' || e.status === 'follow-up-done') ?? [];
  const cancelled = events?.filter((e) => e.status === 'cancelled') ?? [];

  const roiChartData = completed
    .filter((e) => e.roiMeasured)
    .map((e) => ({
      name: e.name.length > 25 ? e.name.slice(0, 25) + '...' : e.name,
      lift: e.roiMeasured!.lift,
    }));

  const totalBudget = events?.filter((e) => e.status !== 'cancelled').reduce((sum, e) => sum + e.budget, 0) ?? 0;
  const totalSpent = events?.reduce((sum, e) => sum + (e.actualSpend ?? 0), 0) ?? 0;
  const budgetPct = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  return (
    <div className="space-y-6">
      <SectionHeader icon={PartyPopper} title="Events" subtitle="Vendor days, trade shows, and event ROI tracking" accentColor={ACCENT} />

      {/* Metrics Row */}
      {metrics && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Upcoming Events" value={metrics.upcoming} accentColor={ACCENT} />
          <MetricCard label="Completed (Quarter)" value={metrics.completedThisQuarter} accentColor={ACCENT} />
          <MetricCard label="Total Budget" value={`$${metrics.totalBudget.toLocaleString()}`} accentColor={ACCENT} />
          <MetricCard label="Avg ROI Lift" value={`${metrics.avgROI}%`} accentColor={ACCENT} trend={{ value: metrics.avgROI, direction: 'up' }} />
        </div>
      )}

      <ModuleTabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab as (id: string) => void} accentColor={ACCENT} />

      {/* Calendar Tab */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          {metrics && <VendorDayStats metrics={metrics} />}
          {eventsLoading ? (
            <LoadingSkeleton variant="card" count={1} />
          ) : (
            <EventCalendar events={events ?? []} onSelectEvent={setSelectedEventId} />
          )}
        </div>
      )}

      {/* Events List Tab */}
      {activeTab === 'events-list' && (
        <div className="space-y-6">
          {/* Upcoming Events */}
          <div>
            <h2 className="mb-3 text-sm font-semibold text-text-bright">Upcoming Events</h2>
            {eventsLoading ? (
              <LoadingSkeleton variant="card" count={3} />
            ) : upcoming.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {upcoming.map((evt) => (
                  <EventCard key={evt.id} event={evt} onClick={setSelectedEventId} />
                ))}
              </div>
            ) : (
              <EmptyState icon={PartyPopper} title="No upcoming events" description="Schedule your next vendor day or event." accentColor={ACCENT} />
            )}
          </div>

          {/* Completed Events */}
          <div>
            <h2 className="mb-3 text-sm font-semibold text-text-bright">Completed Events</h2>
            {eventsLoading ? (
              <LoadingSkeleton variant="card" count={3} />
            ) : completed.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {completed.map((evt) => (
                  <EventCard key={evt.id} event={evt} onClick={setSelectedEventId} />
                ))}
              </div>
            ) : (
              <EmptyState icon={PartyPopper} title="No completed events" description="Complete events to see ROI data." accentColor={ACCENT} />
            )}
          </div>

          {/* Cancelled */}
          {cancelled.length > 0 && (
            <div>
              <h2 className="mb-3 text-sm font-semibold text-text-muted">Cancelled</h2>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {cancelled.map((evt) => (
                  <EventCard key={evt.id} event={evt} onClick={setSelectedEventId} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ROI Tab */}
      {activeTab === 'roi' && (
        <div className="space-y-6">
          {/* ROI Chart */}
          {roiChartData.length > 0 ? (
            <ChartWrapper title="Event ROI — Revenue Lift %" subtitle="Post-event revenue lift by event">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={roiChartData} margin={{ left: 10, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridColor} />
                  <XAxis dataKey="name" tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }} angle={-15} textAnchor="end" height={60} />
                  <YAxis tick={{ fill: CHART_THEME.axisColor, fontSize: 12 }} unit="%" />
                  <Tooltip
                    contentStyle={{ backgroundColor: CHART_THEME.tooltipBg, border: `1px solid ${CHART_THEME.tooltipBorder}`, borderRadius: 8, color: CHART_THEME.tooltipText }}
                    formatter={(value) => [`${value}%`, 'Revenue Lift']}
                  />
                  <Bar dataKey="lift" fill={ACCENT} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartWrapper>
          ) : (
            <EmptyState icon={PartyPopper} title="No ROI data yet" description="Complete events with ROI measurements to see the chart." accentColor={ACCENT} />
          )}

          {/* Annual Budget Tracker */}
          <div className="rounded-xl border border-default bg-card p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-text-bright">Annual Events Budget</h3>
              <span className="text-xs text-text-muted">${totalSpent.toLocaleString()} / ${totalBudget.toLocaleString()}</span>
            </div>
            <div className="h-3 w-full rounded-full bg-elevated">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${Math.min(budgetPct, 100)}%`, backgroundColor: budgetPct > 90 ? '#FB7185' : ACCENT }}
              />
            </div>
            <p className="mt-1 text-xs text-text-muted">{budgetPct}% spent</p>
          </div>
        </div>
      )}

      <EventDrawer event={selectedEvent} onClose={() => setSelectedEventId(null)} />
    </div>
  );
}
