'use client';

import { useState, useMemo } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Clock, Users, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SectionHeader, StatusBadge, LoadingSkeleton, DrawerPanel, ErrorState, EmptyState } from '@/components';
import { useCalendarEvents } from '../hooks';
import { MonthView } from './MonthView';
import { WeekView } from './WeekView';
import { DayView } from './DayView';
import type { CalendarEvent, CalendarViewMode, EventType } from '../types';

const CALENDAR_ACCENT = '#3B82F6';

const EVENT_TYPES: { value: EventType; label: string; color: string }[] = [
  { value: 'delivery', label: 'Delivery', color: '#0EA5E9' },
  { value: 'harvest', label: 'Harvest', color: '#22C55E' },
  { value: 'meeting', label: 'Meeting', color: '#2563EB' },
  { value: 'production', label: 'Production', color: '#10B981' },
  { value: 'vendor-day', label: 'Vendor Day', color: '#F59E0B' },
  { value: 'task-due', label: 'Task Due', color: '#8B5CF6' },
];

const TYPE_BADGE_VARIANT: Record<EventType, 'info' | 'success' | 'warning' | 'danger' | 'muted'> = {
  delivery: 'info',
  harvest: 'success',
  meeting: 'info',
  production: 'success',
  'vendor-day': 'warning',
  'task-due': 'muted',
};

const VIEW_LABELS: Record<CalendarViewMode, string> = {
  month: 'Month',
  week: 'Week',
  day: 'Day',
};

function formatHeaderDate(date: Date, view: CalendarViewMode): string {
  if (view === 'month') {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }
  if (view === 'week') {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${startStr} — ${endStr}`;
  }
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function navigateDate(date: Date, view: CalendarViewMode, direction: -1 | 1): Date {
  const d = new Date(date);
  if (view === 'month') d.setMonth(d.getMonth() + direction);
  else if (view === 'week') d.setDate(d.getDate() + direction * 7);
  else d.setDate(d.getDate() + direction);
  return d;
}

export function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarViewMode>('month');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<Set<EventType>>(
    new Set(EVENT_TYPES.map((t) => t.value))
  );

  const { data: allEvents, isLoading, error, refetch } = useCalendarEvents();

  const filteredEvents = useMemo(() => {
    if (!allEvents) return [];
    return allEvents.filter((e) => selectedTypes.has(e.type));
  }, [allEvents, selectedTypes]);

  const toggleType = (type: EventType) => {
    setSelectedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const handleSelectDate = (date: Date) => {
    setCurrentDate(date);
    setView('day');
  };

  const eventCount = filteredEvents.length;

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <LoadingSkeleton variant="text" />
        <LoadingSkeleton variant="card" count={3} />
      </div>
    );
  }

  if (error) return <ErrorState title="Failed to load calendar events" message={error.message} onRetry={refetch} />;

  return (
    <div className="space-y-6 p-6">
      <SectionHeader
        icon={CalendarDays}
        title="Calendar"
        subtitle="Unified schedule across all modules"
        accentColor={CALENDAR_ACCENT}
        stats={[{ label: 'Events', value: eventCount }]}
        actions={
          <div className="flex items-center gap-1 rounded-lg border border-default bg-elevated p-0.5">
            {(['month', 'week', 'day'] as CalendarViewMode[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  'rounded-md px-3 py-1 text-xs font-medium transition-colors',
                  view === v ? 'bg-card text-text-bright' : 'text-text-muted hover:text-text-default'
                )}
              >
                {VIEW_LABELS[v]}
              </button>
            ))}
          </div>
        }
      />

      {/* Navigation + Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Date navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentDate(navigateDate(currentDate, view, -1))}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-default text-text-muted transition-colors hover:bg-elevated hover:text-text-default"
            aria-label="Previous"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="rounded-lg border border-default px-3 py-1 text-xs font-medium text-text-muted transition-colors hover:bg-elevated hover:text-text-default"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentDate(navigateDate(currentDate, view, 1))}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-default text-text-muted transition-colors hover:bg-elevated hover:text-text-default"
            aria-label="Next"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <h2 className="ml-2 text-sm font-semibold text-text-bright">
            {formatHeaderDate(currentDate, view)}
          </h2>
        </div>

        {/* Type filter checkboxes */}
        <div className="flex flex-wrap items-center gap-2">
          {EVENT_TYPES.map((t) => {
            const active = selectedTypes.has(t.value);
            return (
              <button
                key={t.value}
                onClick={() => toggleType(t.value)}
                className={cn(
                  'flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors',
                  active
                    ? 'border-transparent text-white'
                    : 'border-default text-text-muted hover:text-text-default'
                )}
                style={active ? { backgroundColor: t.color } : undefined}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: active ? 'rgba(255,255,255,0.7)' : t.color }}
                />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Empty State */}
      {allEvents && allEvents.length === 0 && (
        <EmptyState icon={CalendarDays} title="No events" description="No calendar events to display" accentColor={CALENDAR_ACCENT} />
      )}

      {/* Calendar View */}
      {view === 'month' && (
        <MonthView
          currentDate={currentDate}
          events={filteredEvents}
          onSelectDate={handleSelectDate}
          onSelectEvent={setSelectedEvent}
        />
      )}
      {view === 'week' && (
        <WeekView
          currentDate={currentDate}
          events={filteredEvents}
          onSelectEvent={setSelectedEvent}
        />
      )}
      {view === 'day' && (
        <DayView
          currentDate={currentDate}
          events={filteredEvents}
          onSelectEvent={setSelectedEvent}
        />
      )}

      {/* Event Detail Drawer */}
      <DrawerPanel
        open={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title={selectedEvent?.title ?? 'Event Details'}
      >
        {selectedEvent && (
          <div className="space-y-5">
            {/* Type badge */}
            <StatusBadge
              variant={TYPE_BADGE_VARIANT[selectedEvent.type]}
              label={selectedEvent.type.replace('-', ' ')}
              dot
            />

            {/* Date & Time */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CalendarDays className="h-4 w-4 text-text-muted" />
                <span className="text-text-default">
                  {new Date(selectedEvent.date + 'T00:00:00').toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
              {selectedEvent.startTime && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-text-muted" />
                  <span className="text-text-default">
                    {selectedEvent.startTime}
                    {selectedEvent.endTime && <> &ndash; {selectedEvent.endTime}</>}
                  </span>
                </div>
              )}
              {selectedEvent.allDay && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-text-muted" />
                  <span className="text-text-default">All day</span>
                </div>
              )}
            </div>

            {/* Description */}
            {selectedEvent.description && (
              <div>
                <h4 className="mb-1 text-xs font-medium uppercase tracking-wide text-text-muted">Description</h4>
                <p className="text-sm text-text-default leading-relaxed">{selectedEvent.description}</p>
              </div>
            )}

            {/* Attendees */}
            {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
              <div>
                <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-text-muted">Attendees</h4>
                <div className="space-y-1.5">
                  {selectedEvent.attendees.map((name) => (
                    <div key={name} className="flex items-center gap-2 text-sm text-text-default">
                      <Users className="h-3.5 w-3.5 text-text-muted" />
                      {name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Module link */}
            {selectedEvent.moduleRoute && (
              <div>
                <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-text-muted">Module</h4>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-3.5 w-3.5 text-text-muted" />
                  <a
                    href={selectedEvent.moduleRoute}
                    className="font-medium transition-colors hover:underline"
                    style={{ color: CALENDAR_ACCENT }}
                  >
                    Open in {selectedEvent.module}
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </DrawerPanel>
    </div>
  );
}
